import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "node:crypto";
import { createRateLimiter } from "@/lib/rateLimit";

// Rate limit: max 10 orders per 15 minutes per IP
const orderRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000,
});

const orderItemSchema = z.object({
  medicineId: z.string().min(1, "Medicine ID is required").max(50),
  quantity: z.number().int().positive("ප්‍රමාණය 1ක් හෝ ඊට වැඩි විය යුතුය (Quantity must be at least 1)").max(100),
});

const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(2, "කරුණාකර ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න (Please enter your name)")
    .max(100, "Name must be under 100 characters"),
  customerPhone: z
    .string()
    .min(9, "කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න (Please enter a valid phone number)")
    .max(15, "Phone number too long"),
  address: z
    .string()
    .min(5, "කරුණාකර බෙදාහැරීමේ ලිපිනය ඇතුළත් කරන්න (Please enter your delivery address)")
    .max(500, "Address must be under 500 characters"),
  city: z
    .string()
    .min(2, "කරුණාකර නගරය ඇතුළත් කරන්න (Please enter your city)")
    .max(100, "City must be under 100 characters"),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]).default("COD"),
  items: z.array(orderItemSchema).min(1, "ඇණවුම සඳහා අවම වශයෙන් එක් ඖෂධයක්වත් තිබිය යුතුය (Cart must have at least one item)").max(50),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting — prevent order spam / abuse
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (!orderRateLimiter.check(ip)) {
      return NextResponse.json(
        {
          error: "ඇණවුම් ඉල්ලීම් සීමාව ඉක්මවා ඇත. කරුණාකර පසුව උත්සාහ කරන්න. (Too many order requests. Please try again later.)",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const parseResult = createOrderSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: parseResult.error.issues[0]?.message || "වලංගු නොවන ඇණවුම් තොරතුරු (Invalid order data)",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const { customerName, customerPhone, address, city, notes, paymentMethod, items } =
      parseResult.data;

    // Fetch the medicines from DB to verify price and stock
    const medicineIds = items.map((i) => i.medicineId);
    const dbMedicines = await prisma.medicine.findMany({
      where: { id: { in: medicineIds } },
    });

    if (dbMedicines.length !== items.length) {
      return NextResponse.json(
        { error: "තෝරාගත් සමහර ඖෂධ සොයාගත නොහැක (Some items could not be found)", code: "ITEM_NOT_FOUND" },
        { status: 400 }
      );
    }

    // Check stock & compute totals
    let totalAmount = 0;
    const orderItemsToCreate: {
      medicineId: string;
      medicineName: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const dbMed = dbMedicines.find((m) => m.id === item.medicineId);
      if (!dbMed) continue;

      if (dbMed.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `'${dbMed.nameSi}' සඳහා ප්‍රමාණවත් තොග නොමැත. පවතින ප්‍රමාණය: ${dbMed.stock} (Insufficient stock for ${dbMed.nameEn})`,
            code: "INSUFFICIENT_STOCK",
          },
          { status: 400 }
        );
      }

      const subtotal = dbMed.price * item.quantity;
      totalAmount += subtotal;

      orderItemsToCreate.push({
        medicineId: dbMed.id,
        medicineName: `${dbMed.nameSi} (${dbMed.nameEn})`,
        price: dbMed.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    // Generate cryptographically unpredictable order number
    const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
    const orderNumber = `AYU-${randomHex}`;

    // Execute order creation and stock decrement in transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          address,
          city,
          notes: notes || "",
          paymentMethod,
          status: "PENDING",
          totalAmount,
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Decrement medicine stock
      for (const item of items) {
        await tx.medicine.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return NextResponse.json(
      {
        success: true,
        message: "ඔබගේ ඇණවුම සාර්ථකව භාරගන්නා ලදී (Order placed successfully!)",
        orderNumber: newOrder.orderNumber,
        orderId: newOrder.id,
        totalAmount: newOrder.totalAmount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "ඇණවුම සකස් කිරීමේදී දෝෂයක් සිදු විය (Failed to process order)", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
