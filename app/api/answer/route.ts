import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    let candidateId: string;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      candidateId = payload.id as string;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const { answers } = await req.json();

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Answers array is required and cannot be empty." },
        { status: 400 }
      );
    }

    console.log("Saving answers for candidate:", candidateId);
    console.log("Answers:", answers);

    const formattedAnswers = answers.map((answer) => ({
      questionId: answer.questionId,
      selectedAnswer: !!answer.value,
      candidateId,
    }));

    const result = await prisma.answer.createMany({
      data: formattedAnswers,
      skipDuplicates: true,
    });

    console.log("✅ Answers saved successfully:", result);

    return NextResponse.json(
      { message: "Answers saved successfully.", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error saving answers:", error);
    return NextResponse.json(
      { error: "Failed to save answers." },
      { status: 500 }
    );
  }
}