import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../JWT";

export async function POST(req: Request) {
  try {
    const { email, passWord } = await req.json();

 
    if (!email || !passWord) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

  
    const candidate = await prisma.cANDIDATE.findUnique({
      where: { email },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }


    const isValid = await bcrypt.compare(passWord, candidate.passWord!);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }


    const token = signToken({
      id: candidate.id,
      email: candidate.email,
      tier: candidate.tier
    });

    const response = NextResponse.json({
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

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
