import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { contributeToNeed, ContributionError } from "@/lib/domain/contribute-to-need";
import type { ContributionType } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const needLineItemId = body?.needLineItemId as string | undefined;
  const type = body?.type as ContributionType | undefined;

  if (!needLineItemId || !type) {
    return NextResponse.json({ error: "اطلاعات مشارکت ناقص است." }, { status: 400 });
  }

  try {
    const contribution = await contributeToNeed({
      userId: session.user.id as string,
      needLineItemId,
      type,
      qty: body?.qty,
      amountToman: body?.amountToman,
    });
    return NextResponse.json({ contribution });
  } catch (error) {
    if (error instanceof ContributionError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 409 });
    }
    throw error;
  }
}
