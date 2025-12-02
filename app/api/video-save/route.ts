import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      title,
      description,
      publicId,
      originalSize,
      compressedSize,
      duration,
    } = body;

    if (!title || !publicId || !originalSize || !compressedSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId,
        originalSize: String(originalSize),
        compressedSize: String(compressedSize),
        duration: duration ?? 0,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Failed to save video metadata:", error);
    return NextResponse.json(
      { error: "Failed to save video metadata" },
      { status: 500 }
    );
  }
}
