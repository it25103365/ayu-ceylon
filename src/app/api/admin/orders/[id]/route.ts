import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminGuard";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);

    const parseResult = statusSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "වලංගු නොවන තත්ත්වයක් (Invalid order status)", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: parseResult.data.status },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: "ඇණවුම් තත්ත්වය යාවත්කාලීන කරන ලදී (Order status updated)",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "තත්ත්වය යාවත්කාලීන කිරීම අසාර්ථක විය", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
