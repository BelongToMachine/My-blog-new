import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}
