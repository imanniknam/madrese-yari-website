import type { Metadata } from "next";
import { formatDate, formatNumber } from "@/lib/utils";
import { getContactMessages } from "@/lib/data";

export const metadata: Metadata = { title: "پیام‌های تماس با ما" };

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extrabold text-ink-900">پیام‌های تماس با ما</h1>
        <p className="mt-1 text-sm text-ink-500">{formatNumber(messages.length)} پیام دریافت‌شده</p>
      </div>

      {messages.length === 0 && (
        <div className="rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
          هنوز پیامی دریافت نشده است.
        </div>
      )}

      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="rounded-card border border-brand-100 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-ink-900">{m.subject}</h2>
                <p className="mt-1 text-xs text-ink-500">
                  {m.name} · {m.phone} · {formatDate(m.createdAt)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-ink-700">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
