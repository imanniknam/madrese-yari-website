import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { formatNumber } from "@/lib/utils";
import { getAllProductsForAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import type { StockStatus } from "@prisma/client";

export const metadata: Metadata = { title: "مدیریت کالاها" };

const STOCK_LABEL: Record<StockStatus, string> = {
  IN_STOCK: "موجود",
  LIMITED: "موجودی محدود",
  BACKORDER: "قابل پیش‌سفارش",
  OUT_OF_STOCK: "ناموجود",
};

const STOCK_OPTIONS: StockStatus[] = ["IN_STOCK", "LIMITED", "BACKORDER", "OUT_OF_STOCK"];

async function updateProductAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const priceToman = Number(formData.get("priceToman"));
  const stockQty = Number(formData.get("stockQty"));
  const stockStatus = formData.get("stockStatus") as StockStatus;
  const isActive = formData.get("isActive") === "on";

  await prisma.product.update({
    where: { id },
    data: { priceToman, stockQty, stockStatus, isActive },
  });
  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extrabold text-ink-900">مدیریت کالاها</h1>
        <p className="mt-1 text-sm text-ink-500">{formatNumber(products.length)} کالا</p>
      </div>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="rounded-card border border-brand-100 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-ink-900">{p.name}</p>
              <span className="text-xs text-ink-500">{p.category.name}</span>
            </div>
            <form action={updateProductAction} className="mt-3 flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={p.id} />
              <Input name="priceToman" type="number" defaultValue={p.priceToman} className="h-9 w-32 text-xs" placeholder="قیمت (تومان)" />
              <Input name="stockQty" type="number" defaultValue={p.stockQty} className="h-9 w-24 text-xs" placeholder="موجودی" />
              <Select name="stockStatus" defaultValue={p.stockStatus} className="h-9 w-40 text-xs">
                {STOCK_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STOCK_LABEL[s]}
                  </option>
                ))}
              </Select>
              <label className="flex items-center gap-1.5 text-xs text-ink-700">
                <input type="checkbox" name="isActive" defaultChecked={p.isActive} className="accent-brand-600" />
                فعال
              </label>
              <Button type="submit" size="sm" variant="secondary">
                ذخیره
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
