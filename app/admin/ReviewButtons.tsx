"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewButtons({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<null | "APPROVED" | "DECLINED">(null);

  async function review(status: "APPROVED" | "DECLINED") {
    setLoading(status);
    const res = await fetch(`/api/submissions/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      router.refresh(); // re-run the server page; this row leaves the pending list
    } else {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => review("APPROVED")}
        disabled={loading !== null}
        className="rounded-md bg-emerald-500 text-black text-sm font-medium px-3 py-1 disabled:opacity-50"
      >
        {loading === "APPROVED" ? "Approving..." : "Approve"}
      </button>
      <button
        onClick={() => review("DECLINED")}
        disabled={loading !== null}
        className="rounded-md border border-red-500 text-red-400 text-sm font-medium px-3 py-1 disabled:opacity-50"
      >
        {loading === "DECLINED" ? "Declining..." : "Decline"}
      </button>
    </div>
  );
}