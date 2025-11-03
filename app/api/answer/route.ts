import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { answers, candidateId } = await req.json();

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Answers array is required and cannot be empty." },
        { status: 400 }
      );
    }

    if (!candidateId) {
      return NextResponse.json(
        { error: "Candidate ID is required." },
        { status: 400 }
      );
    }

  
    const formattedAnswers = answers.map((answer) => ({
  questionId: answer.questionId,
  selectedAnswer: !!answer.value, 
  candidateId,           
}));
    const result = await prisma.answer.createMany({
      data: formattedAnswers,
      skipDuplicates: true,
    });

    return NextResponse.json(
      { message: "Answers saved successfully.", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving answers:", error);
    return NextResponse.json(
      { error: "Failed to save answers." },
      { status: 500 }
    );
  }
}
