import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { key } = await req.json();
  if (!key) {
    return NextResponse.json(
      { valid: false, error: "No key provided" },
      { status: 400 },
    );
  }
  const foundBrina = await prisma.superSecretKey.findUnique({
    where: { key: "super_secret_code", value: key },
  });
  const foundAdmin = await prisma.superSecretKey.findUnique({
    where: { key: "admin_code", value: key },
  });
  console.log("Found Brina:", foundBrina);
  console.log("Found Admin:", foundAdmin);
  if (foundAdmin) {
    return NextResponse.json({ valid: true, admin: true });
  }
  if (foundBrina) {
    return NextResponse.json({ valid: true });
  }
  return NextResponse.json({ valid: false }, { status: 401 });
}
