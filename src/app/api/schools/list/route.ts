import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const schools = await prisma.schoolProfile.findMany({
    where: { verified: true },
    select: { id: true, name: true, city: true, province: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ schools });
}
