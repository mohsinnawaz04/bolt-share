// app/api/bundles/[slug]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const bundle = await prisma.bundle.findUnique({
    where: { slug },
    include: { files: true },
  });

  if (!bundle) {
    return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
  }

  return NextResponse.json(bundle);
}
