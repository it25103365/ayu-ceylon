import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminGuard";
import { z } from "zod";

const medicineSchema = z.object({
  nameSi: z.string().min(2, "සිංහල නම ඇතුළත් කරන්න (Sinhala name is required)"),
  nameEn: z.string().min(2, "ඉංග්‍රීසි නම ඇතුළත් කරන්න (English name is required)"),
  category: z.string().min(1, "කාණ්ඩය තෝරන්න (Category is required)"),
  price: z.number().positive("මිල ශුන්‍යයට වඩා වැඩි විය යුතුය (Price must be positive)"),
  stock: z.number().int().min(0, "තොග ප්‍රමාණය 0 හෝ ඊට වැඩි විය යුතුය (Stock must be >= 0)"),
  descriptionSi: z.string().min(5, "සිංහල විස්තරය ඇතුළත් කරන්න (Sinhala description is required)"),
  descriptionEn: z.string().min(5, "ඉංග්‍රීසි විස්තරය ඇතුළත් කරන්න (English description is required)"),
  ingredientsSi: z.string().optional(),
  ingredientsEn: z.string().optional(),
  usageSi: z.string().optional(),
  usageEn: z.string().optional(),
  imageUrl: z.string().min(1, "පින්තූරය ඇතුළත් කරන්න (Image is required)"),
  featured: z.boolean().optional(),
});

// GET /api/admin/medicines
export async function GET(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if (!auth.authorized) return auth.response;

  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      medicines,
    });
  } catch (error) {
    console.error("Admin fetch medicines error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "තොරතුරු ලබාගැනීම අසාර්ථක විය", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

// POST /api/admin/medicines
export async function POST(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json().catch(() => null);
    const parseResult = medicineSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: parseResult.error.issues[0]?.message || "වලංගු නොවන තොරතුරු (Invalid input)",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Generate unique slug from English name
    let baseSlug = data.nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!baseSlug) {
      baseSlug = `medicine-${Date.now()}`;
    }

    let slug = baseSlug;
    let count = 1;
    while (await prisma.medicine.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const newMedicine = await prisma.medicine.create({
      data: {
        nameSi: data.nameSi,
        nameEn: data.nameEn,
        slug,
        category: data.category,
        price: data.price,
        stock: data.stock,
        descriptionSi: data.descriptionSi,
        descriptionEn: data.descriptionEn,
        ingredientsSi: data.ingredientsSi || "",
        ingredientsEn: data.ingredientsEn || "",
        usageSi: data.usageSi || "",
        usageEn: data.usageEn || "",
        imageUrl: data.imageUrl,
        featured: data.featured ?? false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "ඖෂධය සාර්ථකව එකතු කරන ලදී (Medicine created successfully)",
        medicine: newMedicine,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin create medicine error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "ඖෂධය එකතු කිරීමේදී දෝෂයක් සිදු විය", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
