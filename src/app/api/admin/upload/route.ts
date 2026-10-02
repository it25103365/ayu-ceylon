import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminGuard";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Megabytes

/**
 * Validate actual file content by checking magic bytes (file signature).
 * This prevents attackers from uploading malicious files with a spoofed MIME type.
 */
function validateMagicBytes(buffer: Buffer): { valid: boolean; detectedType: string } {
  if (buffer.length < 4) {
    return { valid: false, detectedType: "unknown" };
  }

  // JPEG: starts with FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { valid: true, detectedType: "image/jpeg" };
  }

  // PNG: starts with 89 50 4E 47 (‰PNG)
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { valid: true, detectedType: "image/png" };
  }

  // WebP: starts with RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && // RIFF
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50   // WEBP
  ) {
    return { valid: true, detectedType: "image/webp" };
  }

  return { valid: false, detectedType: "unknown" };
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if (!auth.authorized) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "ඡායාරූප ගොනුවක් තෝරා නොමැත (No file uploaded)", code: "NO_FILE" },
        { status: 400 }
      );
    }

    // 1. Validate declared MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "වලංගු ඡායාරූප වර්ගයක් පමණක් තෝරන්න (JPG, PNG, WebP පමණි) (Invalid file type. Allowed: JPG, PNG, WebP)",
          code: "INVALID_FILE_TYPE",
        },
        { status: 400 }
      );
    }

    // 2. Validate file size (<5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "ඡායාරූපයේ ප්‍රමාණය 5MB ට වඩා අඩු විය යුතුය (File size must be under 5MB)",
          code: "FILE_TOO_LARGE",
        },
        { status: 400 }
      );
    }

    // 3. Read file bytes and validate magic bytes (actual file content)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const magicCheck = validateMagicBytes(buffer);
    if (!magicCheck.valid) {
      return NextResponse.json(
        {
          error: "ගොනුවේ අන්තර්ගතය වලංගු රූපයක් නොවේ (File content is not a valid image)",
          code: "INVALID_FILE_CONTENT",
        },
        { status: 400 }
      );
    }

    // 4. Convert image buffer to base64 Data URL (serverless/read-only filesystem compatible)
    const base64 = buffer.toString("base64");
    const mimeType = magicCheck.detectedType || file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      message: "ඡායාරූපය සාර්ථකව උඩුගත කරන ලදී (Image uploaded successfully)",
      url: dataUrl,
    });
  } catch (error) {
    console.error("Image upload error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "ඡායාරූපය උඩුගත කිරීමේදී දෝෂයක් සිදු විය", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
