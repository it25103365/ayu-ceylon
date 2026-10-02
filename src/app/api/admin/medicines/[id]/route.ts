import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminGuard";
import { z } from "zod";

const updateMedicineSchema = z.object({
  nameSi: z.string().min(2).optional(),
  nameEn: z.string().min(2).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  descriptionSi: z.string().min(5).optional(),
  descriptionEn: z.string().min(5).optional(),
  ingredientsSi: z.string().optional(),
  ingredientsEn: z.string().optional(),
  usageSi: z.string().optional(),
  usageEn: z.string().optional(),
  imageUrl: z.string().min(1).optional(),
  featured: z.boolean().optional(),
});

// GET single medicine for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const medicine = await prisma.medicine.findUnique({
      where: { id },
    });

    if (!medicine) {
      return NextResponse.json(
        { error: "ඖෂධය සොයාගත නොහැක", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, medicine });
  } catch (error) {
    console.error("Admin fetch single error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "තොරතුරු ලබාගැනීම අසාර්ථක විය", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

// PUT update medicine
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);

    const parseResult = updateMedicineSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: parseResult.error.issues[0]?.message || "වලංගු නොවන තොරතුරු",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.medicine.update({
      where: { id },
      data: parseResult.data,
    });

    return NextResponse.json({
      success: true,
      message: "ඖෂධ තොරතුරු සාර්ථකව යාවත්කාලීන කරන ලදී (Updated successfully)",
      medicine: updated,
    });
  } catch (error) {
    console.error("Admin update medicine error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "යාවත්කාලීන කිරීම අසාර්ථක විය", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

// DELETE medicine
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;

    await prisma.medicine.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "ඖෂධය සාර්ථකව ඉවත් කරන ලදී (Deleted successfully)",
    });
  } catch (error) {
    console.error("Admin delete medicine error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "ඉවත් කිරීම අසාර්ථක විය", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
