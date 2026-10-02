import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("SECURITY: JWT_SECRET environment variable is not set.");
}
const JWT_SECRET = new TextEncoder().encode(jwtSecret);

export const SESSION_COOKIE_NAME = "ayu_admin_session";

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Sign JWT session token
 */
export async function signAdminSession(payload: AdminSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

/**
 * Verify JWT session token
 */
export async function verifyAdminSession(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || payload.role !== "ADMIN") {
      return null;
    }
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

/**
 * Get current admin session from server components or server actions
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyAdminSession(token);
}

/**
 * Verify admin session from NextRequest (for API routes and middleware)
 */
export async function getAdminSessionFromRequest(
  request: NextRequest
): Promise<AdminSessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyAdminSession(token);
}

// ----------------------------------------------------
// IN-MEMORY LOGIN RATE LIMITER
// Limits brute force attacks (Max 5 failed attempts per 15 minutes per IP)
// ----------------------------------------------------
interface RateLimitEntry {
  failedAttempts: number;
  lockUntil: number | null;
  firstAttemptAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_TIME_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockMinutes?: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check if locked
  if (record.lockUntil && record.lockUntil > now) {
    const remainingMinutes = Math.ceil((record.lockUntil - now) / (60 * 1000));
    return {
      allowed: false,
      remainingAttempts: 0,
      lockMinutes: remainingMinutes,
    };
  }

  // Window expired, reset
  if (now - record.firstAttemptAt > WINDOW_TIME_MS) {
    rateLimitMap.delete(ip);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  return { allowed: true, remainingAttempts: remaining };
}

export function recordFailedLoginAttempt(ip: string) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || {
    failedAttempts: 0,
    lockUntil: null,
    firstAttemptAt: now,
  };

  record.failedAttempts += 1;

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.lockUntil = now + LOCK_TIME_MS;
  }

  rateLimitMap.set(ip, record);
}

export function clearLoginRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}
