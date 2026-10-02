import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const featured = searchParams.get("featured");

    const whereClause: any = {};

    if (category && category !== "ALL") {
      whereClause.category = {
        contains: category,
      };
    }

    if (featured === "true") {
      whereClause.featured = true;
    }

    if (search) {
      whereClause.OR = [
        { nameSi: { contains: search } },
        { nameEn: { contains: search } },
        { descriptionSi: { contains: search } },
        { descriptionEn: { contains: search } },
        { ingredientsSi: { contains: search } },
      ];
    }

    const medicines = await prisma.medicine.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    console.error("Fetch medicines error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "ඖෂධ තොරතුරු ලබාගැනීම අසාර්ථක විය (Failed to fetch medicines)", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
