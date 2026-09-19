import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const needs = await prisma.need.findMany({
    include: { lineItems: true, school: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ needs });
}
