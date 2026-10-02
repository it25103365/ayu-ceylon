import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({
      authenticated: false,
      admin: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
