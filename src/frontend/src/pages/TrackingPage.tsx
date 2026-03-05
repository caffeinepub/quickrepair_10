import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContactInquiry } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useMetaTags } from "../hooks/useMetaTags";
import { type BookingRecord, getBookingById } from "../utils/bookingStorage";

function statusBadgeStyle(status: string): React.CSSProperties {
  switch (status) {
    case "Confirmed":
      return { backgroundColor: "#dbeafe", color: "#1d4ed8" };
    case "Completed":
      return { backgroundColor: "#dcfce7", color: "#15803d" };
    case "Cancelled":
      return { backgroundColor: "#fee2e2", color: "#b91c1c" };
    default:
      return { backgroundColor: "#fef9c3", color: "#a16207" };
  }
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

const inputClass =
  "w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow bg-white";

export default function TrackingPage() {
  useMetaTags({
    title: "Track Your Booking | QuickRepair Mahipalpur",
    description:
      "Track your QuickRepair electrician booking status using your 10-digit Booking ID.",
  });

  const { id: prefilledId } = useSearch({ from: "/tracking" });
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();

  const [inputId, setInputId] = useState(prefilledId || "");
  const [localRecord, setLocalRecord] = useState<BookingRecord | null>(null);
  const [liveInquiry, setLiveInquiry] = useState<ContactInquiry | null>(null);
  const [trackStatus, setTrackStatus] = useState<
    "idle" | "loading" | "found" | "not_found" | "error"
  >("idle");

  // Auto-search if prefilled
  useEffect(() => {
    if (prefilledId && prefilledId.length === 10) {
      handleSearch(prefilledId);
    }
    // handleSearch is defined in the same render scope; omitting it to prevent infinite loops
  }, [prefilledId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSearch(idOverride?: string) {
    const searchId = (idOverride ?? inputId).trim();
    if (!searchId || searchId.length !== 10) return;

    setTrackStatus("loading");
    setLocalRecord(null);
    setLiveInquiry(null);

    // Look up in localStorage
    const record = getBookingById(searchId);
    if (!record) {
      setTrackStatus("not_found");
      return;
    }

    setLocalRecord(record);

    // Fetch live status from backend if we have an internalId
    if (record.internalId && actor && !actorFetching) {
      try {
        const inquiry = await actor.getInquiryById(record.internalId);
        setLiveInquiry(inquiry);
        setTrackStatus("found");
      } catch {
        // Backend call failed — show stored data with stored status
        setTrackStatus("found");
      }
    } else {
      setTrackStatus("found");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/tracking", search: { id: inputId.trim() } });
    handleSearch(inputId.trim());
  }

  const displayStatus = liveInquiry?.status || localRecord?.status || "Pending";

  return (
    <main
      className="page-fade-in pt-20 pb-20 px-4 sm:px-6 min-h-screen"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: "rgba(255,140,66,0.12)",
              color: "#ff8c42",
            }}
          >
            <MapPin size={13} />
            Track Booking
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Track Your Booking
          </h1>
          <p className="text-gray-500 text-base">
            Apna 10-digit Booking ID daalein aur status check karein.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9 mb-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1">
              <label htmlFor="tracking-id" className="sr-only">
                Booking ID
              </label>
              <input
                id="tracking-id"
                type="text"
                value={inputId}
                onChange={(e) =>
                  setInputId(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="Enter 10-digit Booking ID"
                maxLength={10}
                pattern="\d{10}"
                className={inputClass}
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  letterSpacing: "0.1em",
                  fontSize: "1rem",
                }}
                data-ocid="tracking.search_input"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={inputId.length !== 10 || trackStatus === "loading"}
              className="cta-btn px-6 py-3 text-sm font-bold text-white rounded-lg flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: inputId.length !== 10 ? "#ccc" : "#ff8c42",
                borderRadius: "8px",
                minWidth: "120px",
              }}
              data-ocid="tracking.submit_button"
            >
              {trackStatus === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {trackStatus === "loading" ? "Searching..." : "Track"}
            </button>
          </form>
        </div>

        {/* Results */}
        {trackStatus === "loading" && (
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex items-center justify-center gap-3"
            data-ocid="tracking.loading_state"
          >
            <Loader2
              size={22}
              className="animate-spin"
              style={{ color: "#ff8c42" }}
            />
            <span className="text-gray-500 text-sm">
              Booking details dhundhe ja rahe hain...
            </span>
          </div>
        )}

        {trackStatus === "not_found" && (
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center"
            data-ocid="tracking.error_state"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
            >
              <Search size={26} className="text-red-400" />
            </div>
            <p className="text-gray-800 font-bold text-base mb-1">
              Booking ID nahi mili
            </p>
            <p className="text-gray-500 text-sm">
              Apna correct 10-digit Booking ID check karein. Yeh Thank You page
              pe diya gaya tha.
            </p>
          </div>
        )}

        {trackStatus === "found" && localRecord && (
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            data-ocid="tracking.result_card"
          >
            {/* Status banner */}
            <div
              className="px-7 py-4 flex items-center justify-between"
              style={{
                backgroundColor: "rgba(255,140,66,0.06)",
                borderBottom: "1px solid #F0F0F0",
              }}
            >
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
                  Booking ID
                </p>
                <p
                  className="text-xl font-black tracking-widest"
                  style={{
                    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                    color: "#1a1a1a",
                  }}
                >
                  {localRecord.bookingId}
                </p>
              </div>
              <span
                className="px-4 py-1.5 rounded-full text-sm font-bold"
                style={statusBadgeStyle(displayStatus)}
              >
                {displayStatus}
              </span>
            </div>

            {/* Details grid */}
            <div className="p-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Detail label="Customer Name" value={localRecord.name} />
              <Detail label="Phone" value={localRecord.phone} />
              <Detail label="Service" value={localRecord.serviceType} />
              <Detail
                label="Preferred Time"
                value={localRecord.preferredTime}
              />
              <Detail label="Address" value={localRecord.address} fullWidth />
              {localRecord.description && (
                <Detail
                  label="Problem Description"
                  value={localRecord.description}
                  fullWidth
                />
              )}
              <Detail
                label="Submitted On"
                value={formatDate(localRecord.submittedAt)}
                fullWidth
              />
            </div>

            {/* Status info */}
            <div
              className="px-7 py-4 text-xs text-gray-400"
              style={{ borderTop: "1px solid #F0F0F0" }}
            >
              Status live backend se fetch kiya gaya hai. Koi sawaal? Call
              karein:{" "}
              <a
                href="tel:+918004774839"
                className="font-bold hover:underline"
                style={{ color: "#ff8c42" }}
              >
                +91 8004774839
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 leading-relaxed">
        {value || "—"}
      </p>
    </div>
  );
}
