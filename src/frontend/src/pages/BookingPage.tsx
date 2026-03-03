import { useNavigate, useSearch } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMetaTags } from "../hooks/useMetaTags";
import { useSubmitInquiry } from "../hooks/useQueries";

// Play a soft confirmation chime using Web Audio API
function playConfirmSound() {
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 — major chord arpeggio
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
      osc.start(start);
      osc.stop(start + 0.5);
    });
  } catch {
    // Silently ignore if AudioContext not available
  }
}

const SERVICES = [
  "Basic Electrician - ₹299",
  "Electrical Appliances - ₹349",
  "Electrical Maintenance - ₹399",
  "AC & Cooling Services - ₹499",
  "Electrical Mechanic - ₹299",
];

const TIMES = ["Within 30 Minutes", "Within 1 Hour"];

const inputClass =
  "w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow bg-white";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function BookingPage() {
  useMetaTags({
    title: "Book Electrician in Mahipalpur | 30 Min Service | QuickRepair",
    description:
      "Book a verified electrician in Mahipalpur online. 30-minute service guarantee. Basic electrician, appliances, AC, maintenance and more. QuickRepair.",
  });

  const { service: preselectedService } = useSearch({ from: "/book" });
  const submitInquiry = useSubmitInquiry();
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBackendStatus("saving");

    // Submit to FormSubmit.co via fetch (AJAX) so we control the redirect
    try {
      await fetch("https://formsubmit.co/ajax/amitpanday96149@gmail.com", {
        method: "POST",
        body: data,
      });
    } catch {
      // Non-blocking — continue even if email fails
    }

    // Save to backend (non-blocking)
    try {
      await submitInquiry.mutateAsync({
        name: (data.get("name") as string) || "",
        phone: (data.get("phone") as string) || "",
        email: (data.get("email") as string) || "",
        serviceType: (data.get("service") as string) || "",
        address: (data.get("address") as string) || "",
        description: (data.get("problem") as string) || "",
        preferredTime: (data.get("time") as string) || "",
      });
      setBackendStatus("saved");
    } catch {
      setBackendStatus("error");
    }

    // Play sound and redirect to thank you page
    playConfirmSound();
    navigate({ to: "/thankyou" });
  };

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
            Book a Service
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Book an Electrician
          </h1>
          <p className="text-gray-500 text-base">
            Fill in the details below. We'll be at your doorstep within{" "}
            <span className="font-bold text-gray-700">30 minutes</span>.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9">
          <form
            action="https://formsubmit.co/amitpanday96149@gmail.com"
            method="POST"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Hidden fields */}
            <input
              type="hidden"
              name="_subject"
              value="New Customer Booking - QuickRepair"
            />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" style={{ display: "none" }} />

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="booking-name" className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="booking-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className={inputClass}
                  autoComplete="name"
                  data-ocid="booking.name_input"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="booking-phone" className={labelClass}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="booking-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  className={inputClass}
                  autoComplete="tel"
                  data-ocid="booking.phone_input"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="booking-email" className={labelClass}>
                  Email{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="booking-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className={inputClass}
                  autoComplete="email"
                  data-ocid="booking.email_input"
                />
              </div>

              {/* Service */}
              <div>
                <label htmlFor="booking-service" className={labelClass}>
                  Service Required <span className="text-red-500">*</span>
                </label>
                <select
                  id="booking-service"
                  name="service"
                  required
                  className={inputClass}
                  defaultValue={preselectedService || ""}
                  data-ocid="booking.service_select"
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="booking-address" className={labelClass}>
                  Address in Mahipalpur <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="booking-address"
                  name="address"
                  required
                  rows={3}
                  placeholder="Enter your complete address"
                  className={inputClass}
                  autoComplete="street-address"
                  data-ocid="booking.address_textarea"
                />
              </div>

              {/* Problem */}
              <div>
                <label htmlFor="booking-problem" className={labelClass}>
                  Problem Description{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="booking-problem"
                  name="problem"
                  rows={3}
                  placeholder="Describe the problem in detail (optional)"
                  className={inputClass}
                  data-ocid="booking.problem_textarea"
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label htmlFor="booking-time" className={labelClass}>
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <select
                  id="booking-time"
                  name="time"
                  required
                  className={inputClass}
                  defaultValue=""
                  data-ocid="booking.time_select"
                >
                  <option value="" disabled>
                    Select preferred time
                  </option>
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Backend status indicator */}
            {backendStatus === "saving" && (
              <div
                className="mt-4 flex items-center gap-2 text-xs text-gray-500"
                data-ocid="booking.loading_state"
              >
                <Loader2 size={14} className="animate-spin" />
                Saving your request...
              </div>
            )}
            {backendStatus === "error" && (
              <div
                className="mt-4 flex items-center gap-2 text-xs text-amber-600"
                data-ocid="booking.error_state"
              >
                <AlertCircle size={14} />
                Local save failed — your form will still be emailed.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="cta-btn mt-6 w-full py-4 text-base font-bold text-white rounded-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: "#ff8c42", borderRadius: "8px" }}
              data-ocid="booking.submit_button"
            >
              {backendStatus === "saving" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              No hidden charges · Cash on delivery · 30-minute service guarantee
            </p>
          </form>
        </div>

        {/* Contact strip */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Prefer to call?{" "}
          <a
            href="tel:+918004774839"
            className="font-bold hover:underline"
            style={{ color: "#ff8c42" }}
          >
            +91 8004774839
          </a>{" "}
          · 8 AM – 8 PM, All 7 Days
        </div>
      </div>
    </main>
  );
}
