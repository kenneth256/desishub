import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "../JWT";



export async function POST(req: Request) {
  try {
    const { name, email, phone, tier, passWord } = await req.json();

 
    if (!name || !email || !phone || !tier || !passWord) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }; 
    const hashedPassword = await bcrypt.hash(passWord, 10)
    const response = await  prisma.cANDIDATE.create({
        data: {
            fullName: name,
            email,
            phone,
            tier,
            passWord: hashedPassword
           
        }
    })

    const token = signToken({id: response.id, email: response.email})
  

    return NextResponse.json(
      {
        message: "Candidate created successfully",
        candidate: response,
        token
       
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    const candidate = await prisma.cANDIDATE.findUnique({
      where: { email },
    });

    if (!candidate) {
      return new Response(JSON.stringify({ error: "Candidate not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(candidate), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
