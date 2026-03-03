import { AlertCircle, Loader2, ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";
import { useMetaTags } from "../hooks/useMetaTags";
import { useSubmitApplication } from "../hooks/useQueries";

const SERVICES = [
  "Basic Electrician - ₹299",
  "Electrical Appliances - ₹349",
  "Electrical Maintenance - ₹399",
  "AC & Cooling Services - ₹499",
  "Electrical Mechanic - ₹299",
];

const EXPERIENCES = ["<1 year", "1-3 years", "3-5 years", "5+ years"];

const inputClass =
  "w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow bg-white";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function MechanicRegisterPage() {
  useMetaTags({
    title: "Join as Electrician in Mahipalpur | QuickRepair Careers",
    description:
      "Join QuickRepair as a verified electrician in Mahipalpur. Apply now to work with the fastest electrical service team in Delhi. Aadhar & PAN required.",
  });

  const submitApplication = useSubmitApplication();
  const [backendStatus, setBackendStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const data = new FormData(form);
    setBackendStatus("saving");

    try {
      await submitApplication.mutateAsync({
        name: (data.get("name") as string) || "",
        dateOfBirth: (data.get("dob") as string) || "",
        phone: (data.get("phone") as string) || "",
        serviceType: (data.get("service") as string) || "",
        experience: (data.get("experience") as string) || "",
        address: (data.get("address") as string) || "",
        motivation: (data.get("motivation") as string) || "",
      });
      setBackendStatus("saved");
    } catch {
      setBackendStatus("error");
    }
    // Let form submit to FormSubmit.co
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
            Join Our Team
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Register as a Mechanic
          </h1>
          <p className="text-gray-500 text-base">
            Join Mahipalpur's fastest electrical service team. Flexible hours,
            fixed pay, verified work.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9">
          <form
            action="https://formsubmit.co/amitpanday96149@gmail.com"
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Hidden fields */}
            <input
              type="hidden"
              name="_subject"
              value="New Mechanic Registration - QuickRepair"
            />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_next"
              value="https://quickrepaironline-pip.caffeine.xyz/thankyou"
            />
            <input type="text" name="_honey" style={{ display: "none" }} />

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="mech-name" className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="mech-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className={inputClass}
                  autoComplete="name"
                  data-ocid="mechanic.name_input"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="mech-dob" className={labelClass}>
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="mech-dob"
                  name="dob"
                  type="date"
                  required
                  className={inputClass}
                  autoComplete="bday"
                  data-ocid="mechanic.dob_input"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="mech-phone" className={labelClass}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="mech-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  className={inputClass}
                  autoComplete="tel"
                  data-ocid="mechanic.phone_input"
                />
              </div>

              {/* Service Type */}
              <div>
                <label htmlFor="mech-service" className={labelClass}>
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="mech-service"
                  name="service"
                  required
                  className={inputClass}
                  defaultValue=""
                  data-ocid="mechanic.service_select"
                >
                  <option value="" disabled>
                    Select your service type
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="mech-experience" className={labelClass}>
                  Experience <span className="text-red-500">*</span>
                </label>
                <select
                  id="mech-experience"
                  name="experience"
                  required
                  className={inputClass}
                  defaultValue=""
                  data-ocid="mechanic.experience_select"
                >
                  <option value="" disabled>
                    Select experience level
                  </option>
                  {EXPERIENCES.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="mech-address" className={labelClass}>
                  Address in Mahipalpur <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="mech-address"
                  name="address"
                  required
                  rows={3}
                  placeholder="Enter your complete address"
                  className={inputClass}
                  autoComplete="street-address"
                  data-ocid="mechanic.address_textarea"
                />
              </div>

              {/* Aadhar Upload */}
              <div>
                <label htmlFor="mech-aadhar" className={labelClass}>
                  Aadhar Card Upload <span className="text-red-500">*</span>
                </label>
                <label
                  htmlFor="mech-aadhar"
                  className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                  data-ocid="mechanic.aadhar_upload"
                >
                  <Upload size={18} className="text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Upload Aadhar Card
                    </span>
                    <span className="block text-xs text-gray-400 mt-0.5">
                      JPG, PNG, or PDF · Max 5MB
                    </span>
                  </div>
                </label>
                <input
                  id="mech-aadhar"
                  name="aadhar"
                  type="file"
                  required
                  accept=".jpg,.png,.pdf"
                  className="sr-only"
                />
              </div>

              {/* PAN Upload */}
              <div>
                <label htmlFor="mech-pan" className={labelClass}>
                  PAN Card Upload <span className="text-red-500">*</span>
                </label>
                <label
                  htmlFor="mech-pan"
                  className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                  data-ocid="mechanic.pan_upload"
                >
                  <Upload size={18} className="text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Upload PAN Card
                    </span>
                    <span className="block text-xs text-gray-400 mt-0.5">
                      JPG, PNG, or PDF · Max 5MB
                    </span>
                  </div>
                </label>
                <input
                  id="mech-pan"
                  name="pan"
                  type="file"
                  required
                  accept=".jpg,.png,.pdf"
                  className="sr-only"
                />
              </div>

              {/* Motivation */}
              <div>
                <label htmlFor="mech-motivation" className={labelClass}>
                  Why do you want to join?{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="mech-motivation"
                  name="motivation"
                  rows={3}
                  placeholder="Tell us why you want to join QuickRepair..."
                  className={inputClass}
                  data-ocid="mechanic.motivation_textarea"
                />
              </div>
            </div>

            {/* Backend status indicator */}
            {backendStatus === "saving" && (
              <div
                className="mt-4 flex items-center gap-2 text-xs text-gray-500"
                data-ocid="mechanic.loading_state"
              >
                <Loader2 size={14} className="animate-spin" />
                Saving your application...
              </div>
            )}
            {backendStatus === "error" && (
              <div
                className="mt-4 flex items-center gap-2 text-xs text-amber-600"
                data-ocid="mechanic.error_state"
              >
                <AlertCircle size={14} />
                Local save failed — your application will still be emailed.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="cta-btn mt-6 w-full py-4 text-base font-bold text-white rounded-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: "#ff8c42", borderRadius: "8px" }}
              data-ocid="mechanic.submit_button"
            >
              {backendStatus === "saving" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Register as Mechanic"
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-5 flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <ShieldCheck
              size={18}
              className="text-green-500 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-gray-500 leading-relaxed">
              Aadhar and PAN are mandatory. Max file size: 5MB each. Your
              documents are secure and used only for verification.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
