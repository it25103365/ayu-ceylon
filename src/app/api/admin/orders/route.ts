import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminGuard";

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if (!auth.authorized) return auth.response;

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin fetch orders error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "ඇණවුම් තොරතුරු ලබාගැනීම අසාර්ථක විය", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
