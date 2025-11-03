import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const candidates = await prisma.cANDIDATE.findMany({
      include: { answers: true } 
    });

    return new Response(JSON.stringify(candidates), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
