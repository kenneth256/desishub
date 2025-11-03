import { PrismaClient, TierLabel } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { question, tier } = await req.json();
    
    if (!question || !tier) {
      return NextResponse.json(
        { error: "Question and tier are required" },
        { status: 400 }
      );
    }

    const tierUpper = tier.toUpperCase();
    
   
    if (!Object.values(TierLabel).includes(tierUpper as TierLabel)) {
      return NextResponse.json(
        { error: "Invalid tier value" },
        { status: 400 }
      );
    }

    console.log('Creating question with:', {
      questionText: question,
      tier: tierUpper,
      tierLabel: tierUpper
    });

    const response = await prisma.question.create({
      data: {
        questionText: question,
        tier: tierUpper,                    // ✅ STRING now
        tierLabel: tierUpper as TierLabel,  // ENUM for reference
        correctAnswer: true
      },
    });

    return NextResponse.json(
      { message: "Question created successfully", response },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tier = searchParams.get('tier');
    
    if (!tier) {
      return NextResponse.json(
        { error: 'Tier parameter is required' },
        { status: 400 }
      );
    }

  
    const tierUpper = tier.toUpperCase();
    
    if (!Object.values(TierLabel).includes(tierUpper as TierLabel)) {
      return NextResponse.json(
        { error: 'Invalid tier value' },
        { status: 400 }
      );
    }

    const response = await prisma.question.findMany({
      where: { tierLabel: tierUpper as TierLabel }
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}