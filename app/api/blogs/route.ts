import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { blogSchema } from "@/app/validationSchema";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = blogSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const newBlog = await prisma.issue.create({
    data: { title: body.title, description: body.description },
  });

  return NextResponse.json(newBlog, { status: 201 });
}

function getSererSession(authOptions: any) {
  throw new Error("Function not implemented.");
}
