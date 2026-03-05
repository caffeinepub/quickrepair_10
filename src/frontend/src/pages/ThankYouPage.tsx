import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Copy, Home, MapPin } from "lucide-react";
import { useState } from "react";
import { useMetaTags } from "../hooks/useMetaTags";

export default function ThankYouPage() {
  useMetaTags({
    title: "Thank You | QuickRepair Mahipalpur",
    description:
      "Your request has been received. QuickRepair will contact you shortly.",
  });

  const { bookingId } = useSearch({ from: "/thankyou" });
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!bookingId) return;
    navigator.clipboard.writeText(bookingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main
      className="page-fade-in min-h-screen flex items-center justify-center px-4 sm:px-6"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          {/* Check icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(34,197,94,0.12)" }}
            >
              <CheckCircle2 size={44} className="text-green-500" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-3">Thank You!</h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            Your request has been received. Our team will contact you shortly.
            We'll be at your doorstep within{" "}
            <span className="font-bold text-gray-800">30 minutes!</span>
          </p>

          {/* Booking ID Box — shown only when bookingId is present */}
          {bookingId && (
            <div
              className="rounded-xl p-5 mb-6 text-left"
              style={{
                border: "2px solid #ff8c42",
                backgroundColor: "rgba(255,140,66,0.06)",
              }}
              data-ocid="thankyou.booking_id_panel"
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "#ff8c42" }}
              >
                Aapki Booking ID
              </p>

              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-2xl font-black tracking-widest select-all"
                  style={{
                    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                    color: "#1a1a1a",
                    letterSpacing: "0.12em",
                  }}
                  data-ocid="thankyou.booking_id_panel"
                >
                  {bookingId}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    backgroundColor: copied
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(255,140,66,0.12)",
                    color: copied ? "#15803d" : "#ff8c42",
                    border: `1px solid ${copied ? "#bbf7d0" : "rgba(255,140,66,0.3)"}`,
                  }}
                  data-ocid="thankyou.copy_button"
                  aria-label="Copy booking ID"
                >
                  <Copy size={12} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Yeh ID save kar lijiye — status track karne ke liye zaruri hai.
              </p>

              {/* Track booking link */}
              <Link
                to="/tracking"
                search={{ id: bookingId }}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                style={{ color: "#ff8c42" }}
                data-ocid="thankyou.track_booking_link"
              >
                <MapPin size={13} />
                Track My Booking
              </Link>
            </div>
          )}

          {/* Quick info */}
          <div
            className="rounded-xl p-4 mb-7 text-sm"
            style={{ backgroundColor: "rgba(255,140,66,0.08)" }}
          >
            <p className="font-semibold text-gray-700">
              Need immediate assistance?
            </p>
            <a
              href="tel:+918004774839"
              className="font-black text-xl mt-1 block hover:underline"
              style={{ color: "#ff8c42" }}
            >
              +91 8004774839
            </a>
            <p className="text-xs text-gray-400 mt-1">
              8 AM – 8 PM · All 7 Days
            </p>
          </div>

          <Link
            to="/"
            className="cta-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-white font-bold text-sm"
            style={{ backgroundColor: "#ff8c42", borderRadius: "8px" }}
            data-ocid="thankyou.home_button"
          >
            <Home size={17} />
            Back to Home
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-5">
          QuickRepair Mahipalpur · Fastest electrical service in Delhi
        </p>
      </div>
    </main>
  );
}
