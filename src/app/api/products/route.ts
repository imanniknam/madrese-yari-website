import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category") ?? undefined;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: categorySlug ? { slug: categorySlug } : undefined,
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}
