import { prisma } from "@/lib/prisma";
import { BeneficiaryType, NeedStatus } from "@prisma/client";

// Turns an admin-approved SchoolNeedRequest into a published Need, matching the flow
// documented in docs/02-data-model.md: "SchoolNeedRequest ... APPROVED→تبدیل به Need".
// If the request isn't already linked to a SchoolProfile (the common case — most schools
// submit this form before ever creating an account), we look one up by schoolCode, or by
// name+city as a fallback, or create a lightweight unverified SchoolProfile so the resulting
// Need has somewhere to point.
export async function approveSchoolNeedRequest(requestId: string, reviewerNote?: string) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.schoolNeedRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new Error("درخواست پیدا نشد.");
    if (request.status === "APPROVED") return request;

    let schoolId = request.schoolId;

    if (!schoolId) {
      const existing = request.schoolCode
        ? await tx.schoolProfile.findUnique({ where: { code: request.schoolCode } })
        : await tx.schoolProfile.findFirst({ where: { name: request.schoolName, city: request.city } });

      if (existing) {
        schoolId = existing.id;
      } else {
        const placeholderUser = await tx.user.create({
          data: {
            phone: `pending-${request.id}`.slice(0, 32),
            firstName: request.schoolName,
            lastName: "",
            role: "SCHOOL",
          },
        });
        const created = await tx.schoolProfile.create({
          data: {
            userId: placeholderUser.id,
            name: request.schoolName,
            code: request.schoolCode || `AUTO-${request.code}`,
            province: request.province,
            city: request.city,
            address: `${request.city}، ${request.schoolName}`,
            level: "نامشخص",
            contactName: request.contactName,
            contactPhone: request.contactPhone,
            verified: false,
          },
        });
        schoolId = created.id;
      }
    }

    await tx.need.create({
      data: {
        title: request.itemTitle,
        beneficiaryType: BeneficiaryType.SCHOOL,
        studentGroupLabel: request.schoolName,
        schoolId,
        needType: request.needType,
        province: request.province,
        city: request.city,
        description: request.description,
        status: NeedStatus.NEW,
        images: [],
        lineItems: {
          create: [{ itemLabel: request.itemTitle, qtyNeeded: request.itemQty, qtyFulfilled: 0, unit: "عدد" }],
        },
      },
    });

    return tx.schoolNeedRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED", reviewerNote, schoolId },
    });
  });
}

export async function rejectSchoolNeedRequest(requestId: string, reviewerNote?: string) {
  return prisma.schoolNeedRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", reviewerNote },
  });
}

export async function markUnderReview(requestId: string) {
  return prisma.schoolNeedRequest.update({
    where: { id: requestId },
    data: { status: "UNDER_REVIEW" },
  });
}
