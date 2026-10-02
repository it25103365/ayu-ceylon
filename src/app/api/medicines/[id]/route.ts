import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const medicine = await prisma.medicine.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
    });

    if (!medicine) {
      return NextResponse.json(
        { error: "ඖෂධය සොයාගත නොහැක (Medicine not found)", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      medicine,
    });
  } catch (error) {
    console.error("Fetch single medicine error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "ඖෂධ තොරතුරු ලබාගැනීම අසාර්ථක විය", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
