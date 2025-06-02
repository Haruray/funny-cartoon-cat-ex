import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { z } from "zod";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

// Schema for the AI response
const searchQuerySchema = z.object({
  queries: z.array(
    z.object({
      field: z.string(),
      operator: z.string(),
      value: z.string(),
    }),
  ),
});

export const generateQuery = async (input: string) => {
  "use server";
  try {
    const result = await generateObject({
      model: google("gemini-2.0-flash", {
        apiKey: process.env.GEMINI_KEY as string,
      } as any),
      system: `You are a Prisma ORM expert. I need you to help me generate Prisma queries to find images based on user input.

Our Image model schema is:
model Image {
  id          Int      @id @default(autoincrement())
  imageUrl    String
  title       String
  description String
  keywords    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

Given the user input, generate a series of Prisma queries that would best search for matching images. 
Focus on searching the title, description, and keywords fields.

But, make sure to only search for relevant words only and exclude person names, locations, or any other irrelevant terms.
For example, if the input is "makan ramen di jepang, enak banget", you should only search for "makan" or "ramen".
Another example, "brina sedang di jepang, mengunjungi kuil", you should only search for "mengunjungi" or "kuil".

Return only a valid JSON with the key 'queries' containing an array of Prisma query objects.`,
      prompt: `Generate search queries for: ${input}`,
      schema: searchQuerySchema,
    });
    console.log("Generated queries:", result.object.queries);
    return result.object.queries || [];
  } catch (e) {
    console.error(e);
    throw new Error("Failed to generate query");
  }
};

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Search text is required" },
        { status: 400 },
      );
    }

    // Generate queries using AI
    const queries = await generateQuery(text);

    if (queries.length === 0) {
      return NextResponse.json(
        { error: "No valid search queries generated" },
        { status: 400 },
      );
    }

    // Build OR conditions for all the generated queries
    const conditions = queries.map((query) => {
      const { field, operator, value } = query;
      if (operator === "contains") {
        return {
          [field]: {
            contains: value,
            mode: "insensitive",
          },
        };
      }
      // Add more operators as needed
      return {};
    });

    // Execute Prisma search with OR conditions
    const results = await db.image.findMany({
      where: {
        OR: conditions.filter((c) => Object.keys(c).length > 0),
      },
    });

    // Map to array of imageUrls
    const imageUrls = results.map((image) => image.imageUrl);

    return NextResponse.json({
      success: true,
      imageUrls,
      results,
      generatedQueries: queries,
    });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 },
    );
  }
}
