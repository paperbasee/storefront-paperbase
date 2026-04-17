"use client";

import { useState } from "react";

import { formatPaperbaseError, PaperbaseApiError } from "@/lib/api/paperbase-errors";
import { apiFetch, apiFetchJson } from "@/lib/client/api";

export function SupportTicketForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("attachments");

    setLoading(true);
    setStatus(null);
    try {
      if (file instanceof File && file.size > 0) {
        const res = await apiFetch("/support/tickets", { method: "POST", body: data });
        const payload = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        if (!res.ok) {
          throw new PaperbaseApiError("Support ticket failed", res.status, payload);
        }
      } else {
        await apiFetchJson("/support/tickets", {
          method: "POST",
          body: JSON.stringify({
            name: String(data.get("name") || ""),
            email: String(data.get("email") || ""),
            phone: String(data.get("phone") || "") || undefined,
            subject: String(data.get("subject") || "") || undefined,
            message: String(data.get("message") || ""),
            order_number: String(data.get("order_number") || "") || undefined,
            category:
              (String(data.get("category") || "general") as
                | "general"
                | "order"
                | "payment"
                | "shipping"
                | "product"
                | "technical"
                | "other") || "general",
            priority:
              (String(data.get("priority") || "medium") as "low" | "medium" | "high" | "urgent") ||
              "medium",
          }),
        });
      }
      setStatus("Support ticket submitted successfully.");
      form.reset();
    } catch (error) {
      setStatus(formatPaperbaseError(error));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-text outline-none placeholder:text-neutral-400 focus:border-neutral-400";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required className={inputClass} placeholder="Name" />
        <input name="email" type="email" required className={inputClass} placeholder="Email" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="phone" className={inputClass} placeholder="Phone" />
        <input name="order_number" className={inputClass} placeholder="Order number" />
      </div>
      <input name="subject" className={inputClass} placeholder="Subject" />
      <textarea name="message" required rows={4} className={inputClass} placeholder="Message" />
      <div className="grid gap-4 sm:grid-cols-2">
        <select name="category" defaultValue="general" className={inputClass}>
          <option value="general">General</option>
          <option value="order">Order</option>
          <option value="payment">Payment</option>
          <option value="shipping">Shipping</option>
          <option value="product">Product</option>
          <option value="technical">Technical</option>
          <option value="other">Other</option>
        </select>
        <select name="priority" defaultValue="medium" className={inputClass}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <input name="attachments" type="file" className={inputClass} />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit ticket"}
      </button>
      {status ? <p className="text-sm text-neutral-700">{status}</p> : null}
    </form>
  );
}
