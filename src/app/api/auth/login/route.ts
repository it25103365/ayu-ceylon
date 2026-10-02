import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  clearLoginRateLimit,
  signAdminSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Identify Client IP for Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in ${rateLimit.lockMinutes || 15} minutes.`,
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // 2. Validate Input Body
    const body = await request.json().catch(() => null);
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: parseResult.error.issues[0]?.message || "Invalid input",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    // 3. Find Admin Account
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      recordFailedLoginAttempt(ip);
      const updatedRate = checkLoginRateLimit(ip);
      return NextResponse.json(
        {
          error: `Invalid email or password. (Remaining attempts: ${updatedRate.remainingAttempts})`,
          code: "INVALID_CREDENTIALS",
          remainingAttempts: updatedRate.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 4. Verify Password with bcrypt
    const passwordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordValid) {
      recordFailedLoginAttempt(ip);
      const updatedRate = checkLoginRateLimit(ip);
      return NextResponse.json(
        {
          error: `Invalid email or password. (Remaining attempts: ${updatedRate.remainingAttempts})`,
          code: "INVALID_CREDENTIALS",
          remainingAttempts: updatedRate.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 5. Successful login: Clear rate limit and create session
    clearLoginRateLimit(ip);

    const sessionToken = await signAdminSession({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin logged in successfully",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // 6. Set Secure httpOnly Cookie
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours — matches JWT expiration
    });

    return response;
  } catch (error) {
    console.error("Login error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
