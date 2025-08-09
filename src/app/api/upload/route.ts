import { supabase } from "@/lib/supabase";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  if (files.length > 6) {
    return NextResponse.json(
      { error: "Maximum 6 files allowed." },
      { status: 400 }
    );
  }

  // Unique slug for public sharing
  const slug = randomBytes(3).toString("hex");
  // Unique random string for Supabase paths
  const random = randomBytes(4).toString("hex");

  const bundle = await prisma.bundle.create({
    data: { slug },
  });

  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const filePath = `${Date.now()}_${random}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (error) throw new Error(error.message);

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${data.path}`;

      return prisma.file.create({
        data: {
          name: file.name,
          size: file.size,
          type: file.type,
          url,
          bundleId: bundle.id,
        },
      });
    })
  );

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/download/${slug}`;

  return NextResponse.json({
    message: "Files uploaded",
    slug,
    shareUrl,
    files: uploadedFiles,
  });
}
