import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";

// POST /api/save-file
export async function POST(req: Request) {
  try {
    const { slug, name, size, type, url } = await req.json();

    // Step 1 — Generate slug if missing
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = randomBytes(3).toString("hex");
    }

    // Step 2 — Find bundle, create if it doesn't exist
    let bundle = await prisma.bundle.findUnique({
      where: { slug: finalSlug },
    });

    if (!bundle) {
      bundle = await prisma.bundle.create({
        data: { slug: finalSlug },
      });
    }

    // Step 3 — Save file in DB
    const file = await prisma.file.create({
      data: {
        name,
        size,
        type,
        url,
        bundleId: bundle.id,
      },
    });

    // Step 4 — Build share URL
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/share/${finalSlug}`;

    return NextResponse.json({
      message: "File metadata saved",
      slug: finalSlug,
      shareUrl,
      file,
    });
  } catch (error) {
    console.error("Error saving file metadata:", error);
    return NextResponse.json(
      { error: "Failed to save file metadata" },
      { status: 500 }
    );
  }
}
