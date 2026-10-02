import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "./auth";

export async function requireAdminApi(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

  if (!session || session.role !== "ADMIN") {
    return {
      authorized: false as const,
      response: NextResponse.json(
        {
          error: "Forbidden: Admin privileges required to access this resource.",
          code: "FORBIDDEN",
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true as const,
    session,
  };
}
