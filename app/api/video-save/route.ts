import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
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
        userId: session.user.id,
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
