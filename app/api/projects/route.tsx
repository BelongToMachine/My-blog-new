import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const projects = await prisma.project.findMany();
  console.log(projects);
  return NextResponse.json(projects);
}
