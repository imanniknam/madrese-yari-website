"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { Timeline, type TimelineStep } from "@/components/domain/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input } from "@/components/ui/field";

type SchoolNeedRequest = {
  code: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  schoolName: string;
  itemTitle: string;
  itemQty: number;
  reviewerNote: string | null;
};

const STATUS_LABEL: Record<SchoolNeedRequest["status"], string> = {
  SUBMITTED: "ثبت شده",
  UNDER_REVIEW: "در حال بررسی",
  APPROVED: "تأیید شده",
  REJECTED: "رد شده",
};

function buildSteps(status: SchoolNeedRequest["status"]): TimelineStep[] {
  if (status === "REJECTED") {
    return [
      { label: "ثبت درخواست", description: "درخواست شما با موفقیت ثبت شد.", state: "done" },
      { label: "بررسی کارشناسی", description: "درخواست شما بررسی و متأسفانه رد شد.", state: "done" },
    ];
  }

  const order: SchoolNeedRequest["status"][] = ["SUBMITTED", "UNDER_REVIEW", "APPROVED"];
  const currentIndex = order.indexOf(status);

  const labels: { label: string; description: string }[] = [
    { label: "ثبت درخواست", description: "درخواست شما با موفقیت ثبت شد." },
    { label: "بررسی کارشناسی", description: "درخواست شما در حال بررسی توسط تیم مدرسه‌یاری است." },
    { label: "انتشار نیاز", description: "پس از تأیید، نیاز شما در سایت منتشر می‌شود." },
    { label: "تأمین", description: "مشارکت‌کنندگان در تأمین نیاز شما سهیم می‌شوند." },
  ];

  return labels.map((step, i) => ({
    ...step,
    state: i < currentIndex + 1 ? "done" : i === currentIndex + 1 ? "active" : "upcoming",
  }));
}

function TrackRequestContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";

  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<SchoolNeedRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(searchCode: string) {
    if (!searchCode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/school-need-requests?code=${encodeURIComponent(searchCode)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "درخواستی پیدا نشد.");
        setResult(null);
        return;
      }
      setResult(data.request);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch triggered by the ?code= query param, not a render-loop concern
    if (initialCode) lookup(initialCode);
  }, [initialCode]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    lookup(code);
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-xl rounded-card border border-brand-100 bg-white p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <FieldGroup label="کد درخواست" className="flex-1">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثلاً ۱۲۵۴۸"
              inputMode="numeric"
            />
          </FieldGroup>
          <Button type="submit" disabled={loading}>
            {loading ? "در حال جست‌وجو..." : "پیگیری"}
          </Button>
        </form>

        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

        {result && (
          <>
            <div className="mt-8 flex items-center justify-between border-t border-brand-100 pt-6">
              <div>
                <p className="text-xs text-ink-500">کد درخواست</p>
                <p className="text-lg font-extrabold text-ink-900">#{result.code}</p>
                <p className="mt-1 text-xs text-ink-500">
                  {result.schoolName} — {result.itemTitle} ({result.itemQty})
                </p>
              </div>
              <Badge variant={result.status === "APPROVED" ? "brand" : result.status === "REJECTED" ? "neutral" : "gold"}>
                {STATUS_LABEL[result.status]}
              </Badge>
            </div>

            {result.reviewerNote && (
              <p className="mt-4 rounded-xl bg-sand-50 p-3 text-xs text-ink-700">{result.reviewerNote}</p>
            )}

            <div className="mt-8">
              <Timeline steps={buildSteps(result.status)} />
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default function TrackRequestPage() {
  return (
    <>
      <PageHeader
        eyebrow="پیگیری درخواست"
        title="وضعیت درخواست ثبت‌شده."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "مدارس", href: "/schools" }, { label: "پیگیری درخواست" }]}
      />
      <Suspense>
        <TrackRequestContent />
      </Suspense>
    </>
  );
}
