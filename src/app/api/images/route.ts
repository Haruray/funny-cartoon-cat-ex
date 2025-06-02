import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
  try {
    const images = await db.image.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, title, description, keywords } = body;

    if (!imageUrl || !title) {
      return NextResponse.json(
        { error: "Image URL and title are required" },
        { status: 400 },
      );
    }

    const image = await db.image.create({
      data: {
        imageUrl,
        title,
        description: description || "",
        keywords: keywords || "",
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Failed to create image:", error);
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 },
    );
  }
}
