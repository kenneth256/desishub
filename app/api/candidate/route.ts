import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "../JWT";

export async function POST(req: Request) {
  console.log("🚀 POST /api/candidate called");
  
  try {
    let body;
    
    // Parse and log the request body
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
    
    // Log each field
    console.log("🔍 Extracted fields:", { 
      name: name || "MISSING", 
      email: email || "MISSING", 
      phone: phone || "MISSING", 
      tier: tier || "MISSING", 
      passWord: passWord ? "PROVIDED" : "MISSING"
    });
    
    if (!name || !email || !phone || !tier || !passWord) {
      const missing = [];
      if (!name) missing.push('name');
      if (!email) missing.push('email');
      if (!phone) missing.push('phone');
      if (!tier) missing.push('tier');
      if (!passWord) missing.push('passWord');
      
      console.log("❌ Missing required fields:", missing);
      
      return NextResponse.json(
        { 
          error: "All fields are required",
          missing: missing,
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

    console.log("✅ User doesn't exist, creating new candidate...");
    
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

    console.log("✅ Candidate created successfully:", response.email);
    
    const token = signToken({id: response.id, email: response.email});

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
