"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Clock, Phone, User, Check, X, CheckCheck, Loader2, CalendarClock } from "lucide-react";
import { fetchReceivedVisits, updateVisitStatus, type ApiVisit, type VisitStatus } from "@/lib/visit-api";

const STATUS_STYLE: Record<VisitStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-[#C9A24B]/15 text-[#9A7B23]" },
  confirmed: { label: "Confirmed", cls: "bg-[#157A74]/12 text-[#157A74]" },
  cancelled: { label: "Cancelled", cls: "bg-red-500/10 text-red-500" },
  completed: { label: "Completed", cls: "bg-[#342417]/10 text-[#342417]" },
};

/** Owner-only panel: the visit requests for a single property, with status controls. */
export function OwnerVisitRequests({ propertyId }: { propertyId: string }) {
  const [visits, setVisits] = useState<ApiVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const all = await fetchReceivedVisits();
        const forThis = all.filter((v) => {
          const pid = typeof v.property === "object" ? v.property._id : v.property;
          return pid === propertyId;
        });
        if (active) setVisits(forThis);
      } catch {
        /* silent */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [propertyId]);

  const setStatus = async (id: string, status: VisitStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateVisitStatus(id, status);
      setVisits((prev) => prev.map((v) => (v._id === id ? { ...v, status: updated.status } : v)));
      toast.success(`Visit ${status}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update visit.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center px-5 py-10">
        <Loader2 className="h-5 w-5 animate-spin text-[#B05B33]" />
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="flex flex-col items-center px-5 py-8 text-center">
        <CalendarClock className="mb-2.5 h-8 w-8 text-[#C9B79F]" />
        <p className="text-sm font-bold text-[#342417]">No visit requests yet</p>
        <p className="mt-1 text-[11px] text-[#5C4D3C]/60">Requests to visit this property will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[26rem] space-y-3 overflow-y-auto px-5 py-5 [scrollbar-gutter:stable]">
      {visits.map((v) => {
        const busy = updatingId === v._id;
        const s = STATUS_STYLE[v.status];
        return (
          <div key={v._id} className="rounded-xl border border-mist bg-white p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#342417]"><User className="h-3.5 w-3.5" /> {v.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${s.cls}`}>{s.label}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-[#5C4D3C]/75">
              <a href={`tel:${v.phone}`} className="inline-flex items-center gap-1 hover:text-[#B05B33]"><Phone className="h-3 w-3" /> {v.phone}</a>
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {v.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {v.slot}</span>
            </div>
            {v.message && <p className="mt-1.5 text-[11.5px] italic text-[#5C4D3C]/70">“{v.message}”</p>}

            <div className="mt-3 flex gap-2">
              {busy ? (
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5C4D3C]/60"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</span>
              ) : v.status === "pending" ? (
                <>
                  <button onClick={() => setStatus(v._id, "confirmed")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#157A74] px-2 py-1.5 text-[11px] font-bold text-white transition hover:brightness-110">
                    <Check className="h-3.5 w-3.5" /> Confirm
                  </button>
                  <button onClick={() => setStatus(v._id, "cancelled")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-mist bg-white px-2 py-1.5 text-[11px] font-bold text-red-500 transition hover:bg-red-50">
                    <X className="h-3.5 w-3.5" /> Decline
                  </button>
                </>
              ) : v.status === "confirmed" ? (
                <>
                  <button onClick={() => setStatus(v._id, "completed")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#342417] px-2 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#251910]">
                    <CheckCheck className="h-3.5 w-3.5" /> Complete
                  </button>
                  <button onClick={() => setStatus(v._id, "cancelled")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-mist bg-white px-2 py-1.5 text-[11px] font-bold text-red-500 transition hover:bg-red-50">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
