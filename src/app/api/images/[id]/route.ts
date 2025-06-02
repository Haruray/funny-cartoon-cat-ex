import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const image = await db.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error(`Failed to fetch image with ID ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { imageUrl, title, description, keywords } = body;

    if (!imageUrl || !title) {
      return NextResponse.json(
        { error: "Image URL and title are required" },
        { status: 400 },
      );
    }

    const updated = await db.image.update({
      where: { id },
      data: {
        imageUrl,
        title,
        description: description || "",
        keywords: keywords || "",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`Failed to update image with ID ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await db.image.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete image with ID ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
