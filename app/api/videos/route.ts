import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Video fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
