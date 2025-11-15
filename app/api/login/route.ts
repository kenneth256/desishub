import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../JWT";

export async function POST(req: Request) {
  try {
    const { email, passWord } = await req.json();

    // Validate input
    if (!email || !passWord) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const candidate = await prisma.cANDIDATE.findUnique({
      where: { email },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare password with hashed password
    const isValid = await bcrypt.compare(passWord, candidate.passWord!);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT toke
    const token = signToken({id: candidate.id, email: candidate.email})

    return NextResponse.json({
      message: "Login successful",
      candidate: {
        id: candidate.id,
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone,
        tier: candidate.tier,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
