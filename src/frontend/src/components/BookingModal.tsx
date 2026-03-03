import { AlertCircle, ArrowRight, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSubmitInquiry } from "../hooks/useQueries";

const SERVICES = [
  "Basic Electrician - ₹299",
  "Electrical Appliances - ₹349",
  "Electrical Maintenance - ₹399",
  "AC & Cooling Services - ₹499",
  "Electrical Mechanic - ₹299",
];

const TIMES = ["ASAP", "Within 1 Hour", "Today", "Schedule"];

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow bg-white";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

interface BookingModalProps {
  open: boolean;
  service: string;
  onClose: () => void;
}

export default function BookingModal({
  open,
  service,
  onClose,
}: BookingModalProps) {
  const submitInquiry = useSubmitInquiry();
  const [backendStatus, setBackendStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  // Handle open/close animations
  useEffect(() => {
    if (open) {
      setAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBackendStatus("saving");

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
      // Non-blocking — form still submits to FormSubmit.co
      setBackendStatus("error");
    }

    // Submit form to FormSubmit.co after backend save attempt
    form.submit();
  };

  if (!animating) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{
          backgroundColor: visible ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)",
          backdropFilter: visible ? "blur(3px)" : "blur(0px)",
          transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
        }}
        data-ocid="booking_modal.dialog"
      />

      {/* Centering container — backdrop click handled via backdrop div + button */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        {/* Invisible backdrop click button — placed behind the modal panel */}
        <button
          type="button"
          aria-label="Close booking modal backdrop"
          onClick={onClose}
          className="absolute inset-0 w-full h-full pointer-events-auto"
          style={{
            background: "transparent",
            border: "none",
            cursor: "default",
          }}
          tabIndex={-1}
        />

        {/* Modal panel */}
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full pointer-events-auto"
          style={{
            maxWidth: "560px",
            maxHeight: "90vh",
            overflowY: "auto",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "scale(1) translateY(0)"
              : "scale(0.95) translateY(16px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {/* Modal Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white rounded-t-2xl">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Book a Service
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                We'll be there within{" "}
                <span className="font-bold text-gray-700">30 minutes</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0 ml-4"
              aria-label="Close booking modal"
              data-ocid="booking_modal.close_button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Selected Service Banner */}
          {service && (
            <div
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold"
              style={{
                backgroundColor: "rgba(255,140,66,0.08)",
                color: "#ff8c42",
                borderBottom: "1px solid rgba(255,140,66,0.15)",
              }}
            >
              <ArrowRight size={14} />
              <span>{service}</span>
            </div>
          )}

          {/* Form */}
          <div className="px-6 py-5">
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
              <input
                type="hidden"
                name="_next"
                value="https://quickrepaironline-pip.caffeine.xyz/thankyou"
              />
              <input type="text" name="_honey" style={{ display: "none" }} />

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="modal-name" className={labelClass}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className={inputClass}
                    autoComplete="name"
                    data-ocid="booking_modal.name_input"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="modal-phone" className={labelClass}>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Enter your phone number"
                    className={inputClass}
                    autoComplete="tel"
                    data-ocid="booking_modal.phone_input"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="modal-email" className={labelClass}>
                    Email{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="modal-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="modal-service" className={labelClass}>
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="modal-service"
                    name="service"
                    required
                    className={inputClass}
                    defaultValue={service || ""}
                    key={service} // re-mount when service changes to reset defaultValue
                    data-ocid="booking_modal.service_select"
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
                  <label htmlFor="modal-address" className={labelClass}>
                    Address in Mahipalpur{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="modal-address"
                    name="address"
                    required
                    rows={2}
                    placeholder="Enter your complete address"
                    className={inputClass}
                    autoComplete="street-address"
                    data-ocid="booking_modal.address_textarea"
                  />
                </div>

                {/* Problem */}
                <div>
                  <label htmlFor="modal-problem" className={labelClass}>
                    Problem Description{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="modal-problem"
                    name="problem"
                    rows={2}
                    placeholder="Describe the problem (optional)"
                    className={inputClass}
                  />
                </div>

                {/* Preferred Time */}
                <div>
                  <label htmlFor="modal-time" className={labelClass}>
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="modal-time"
                    name="time"
                    required
                    className={inputClass}
                    defaultValue=""
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

              {/* Backend status */}
              {backendStatus === "saving" && (
                <div
                  className="mt-3 flex items-center gap-2 text-xs text-gray-500"
                  data-ocid="booking_modal.loading_state"
                >
                  <Loader2 size={13} className="animate-spin" />
                  Saving your request...
                </div>
              )}
              {backendStatus === "error" && (
                <div
                  className="mt-3 flex items-center gap-2 text-xs text-amber-600"
                  data-ocid="booking_modal.error_state"
                >
                  <AlertCircle size={13} />
                  Local save failed — your form will still be emailed.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="cta-btn mt-5 w-full py-3.5 text-sm font-bold text-white rounded-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: "#ff8c42", borderRadius: "8px" }}
                data-ocid="booking_modal.submit_button"
              >
                {backendStatus === "saving" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-2.5">
                No hidden charges · Cash on delivery · 30-min guarantee
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
