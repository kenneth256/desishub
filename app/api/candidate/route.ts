import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "../JWT";

export async function POST(req: Request) {
  console.log("🚀 POST /api/candidate called");
  
  try {
    let body: any;
    
  
    try {
      body = await req.json();
      console.log("📥 Received POST body:", JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    
    const { name, email, phone, tier, passWord } = body;
    
  
    
    if (!name || !email || !phone || !tier || !passWord) {
      
      
      return NextResponse.json(
        { 
          error: "All fields are required",
          received: Object.keys(body)
        },
        { status: 400 }
      );
    }
   
    console.log("✅ All fields present, checking for existing user...");    
    const existingCandidate = await prisma.cANDIDATE.findUnique({
      where: { email },
    });

    if (existingCandidate) {
      console.log("❌ Email already registered:", email);
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(passWord, 10);
    const response = await prisma.cANDIDATE.create({
      data: {
        fullName: name,
        email,
        phone,
        tier,
        passWord: hashedPassword
      }
    });

   
    
    const token = signToken({id: response.id, email: response.email, tier: response.tier});

    return NextResponse.json(
      {
        message: "Candidate created successfully",
        candidate: response,
        token
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating candidate:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    console.log("📥 GET request for email:", email);

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    const candidate = await prisma.cANDIDATE.findUnique({
      where: { email },
      include: {
        answers: true, 
      },
    });

    if (!candidate) {
      console.log("❌ Candidate not found:", email);
      return new Response(JSON.stringify({ error: "Candidate not found" }), { status: 404 });
    }

    console.log("✅ Candidate found:", email);
    return new Response(JSON.stringify(candidate), { status: 200 });
  } catch (error: any) {
    console.error("❌ GET Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
