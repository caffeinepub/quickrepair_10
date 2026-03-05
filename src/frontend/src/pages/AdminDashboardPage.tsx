import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContactInquiry, MechanicApplication } from "../backend.d";
import {
  useGetAllApplications,
  useGetAllInquiries,
  useUpdateApplicationStatus,
  useUpdateInquiryStatus,
} from "../hooks/useQueries";

type TabType = "bookings" | "mechanics";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"];

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

function formatTimestamp(ts: bigint): string {
  try {
    // ICP timestamps are in nanoseconds
    const ms = Number(ts / BigInt(1_000_000));
    return new Date(ms).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("bookings");

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") !== "true") {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  function handleLogout() {
    sessionStorage.removeItem("adminAuth");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm"
        style={{ borderColor: "#E0E0E0" }}
      >
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "'Cabinet Grotesk', 'Figtree', sans-serif" }}
        >
          <span style={{ color: "#FFD700" }}>Quick</span>
          <span style={{ color: "#ff8c42" }}>Repair</span>
          <span
            className="ml-2 text-base font-semibold"
            style={{ color: "#555" }}
          >
            Admin
          </span>
        </span>
        <button
          type="button"
          onClick={handleLogout}
          data-ocid="admin.dashboard.logout_button"
          className="px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all hover:scale-103"
          style={{
            borderColor: "#ff8c42",
            color: "#ff8c42",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#ff8c42";
            (e.target as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor =
              "transparent";
            (e.target as HTMLButtonElement).style.color = "#ff8c42";
          }}
        >
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            data-ocid="admin.dashboard.bookings_tab"
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === "bookings" ? "#ff8c42" : "#fff",
              color: activeTab === "bookings" ? "#fff" : "#555",
              border: `1.5px solid ${activeTab === "bookings" ? "#ff8c42" : "#E0E0E0"}`,
            }}
          >
            Customer Bookings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mechanics")}
            data-ocid="admin.dashboard.mechanics_tab"
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === "mechanics" ? "#ff8c42" : "#fff",
              color: activeTab === "mechanics" ? "#fff" : "#555",
              border: `1.5px solid ${activeTab === "mechanics" ? "#ff8c42" : "#E0E0E0"}`,
            }}
          >
            Mechanic Registrations
          </button>
        </div>

        {activeTab === "bookings" ? <BookingsTab /> : <MechanicsTab />}
      </main>
    </div>
  );
}

// ─── Bookings Tab ──────────────────────────────────────────────────────────

function BookingsTab() {
  const { data: inquiries, isLoading, isError } = useGetAllInquiries();
  const updateStatus = useUpdateInquiryStatus();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-20 gap-3"
        data-ocid="admin.bookings.loading_state"
      >
        <Loader2
          className="h-5 w-5 animate-spin"
          style={{ color: "#ff8c42" }}
        />
        <span className="text-sm" style={{ color: "#666" }}>
          Loading bookings...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="py-12 text-center text-sm"
        style={{ color: "#ef4444" }}
        data-ocid="admin.bookings.error_state"
      >
        Failed to load bookings. Please refresh.
      </div>
    );
  }

  const list: ContactInquiry[] = inquiries ?? [];

  return (
    <div>
      <div
        className="mb-4 text-xs px-3 py-2 rounded-lg"
        style={{
          backgroundColor: "#fff7ed",
          color: "#9a3412",
          border: "1px solid #fed7aa",
        }}
      >
        Aadhar/PAN documents are sent to your email (amitpanday96149@gmail.com)
        via FormSubmit.
      </div>

      {list.length === 0 ? (
        <div
          className="py-16 text-center bg-white rounded-xl border"
          style={{ borderColor: "#E0E0E0", color: "#999" }}
          data-ocid="admin.bookings.empty_state"
        >
          <p className="text-base font-medium mb-1">No bookings yet</p>
          <p className="text-sm">
            Customer bookings will appear here once submitted.
          </p>
        </div>
      ) : (
        <div
          className="bg-white rounded-xl border overflow-hidden"
          style={{ borderColor: "#E0E0E0" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    backgroundColor: "#F8F9FA",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  {[
                    "#",
                    "Booking Ref",
                    "Name",
                    "Phone",
                    "Email",
                    "Service",
                    "Address",
                    "Problem",
                    "Time Pref",
                    "Submitted At",
                    "Status",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#F0F0F0" }}
                    data-ocid="admin.booking.row"
                  >
                    <td
                      className="px-4 py-3 text-center font-medium"
                      style={{ color: "#888", minWidth: "36px" }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap text-xs font-mono font-semibold"
                      style={{ color: "#ff8c42", minWidth: "80px" }}
                    >
                      {item.id}
                    </td>
                    <td
                      className="px-4 py-3 font-medium whitespace-nowrap"
                      style={{ color: "#222" }}
                    >
                      {item.name}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {item.phone}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {item.email || "—"}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {item.serviceType}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "#444", maxWidth: "160px" }}
                    >
                      <span className="block truncate" title={item.address}>
                        {item.address}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "#444", maxWidth: "140px" }}
                    >
                      <span className="block truncate" title={item.description}>
                        {item.description || "—"}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {item.preferredTime}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap text-xs"
                      style={{ color: "#666" }}
                    >
                      {formatTimestamp(item.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusSelect
                        index={idx + 1}
                        id={item.id}
                        currentStatus={item.status}
                        onUpdate={(newStatus) =>
                          updateStatus.mutate({
                            id: item.id,
                            status: newStatus,
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingStatusSelect({
  index,
  currentStatus,
  onUpdate,
}: {
  index: number;
  id?: string;
  currentStatus: string;
  onUpdate: (s: string) => void;
}) {
  const [value, setValue] = useState(currentStatus || "Pending");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setValue(next);
    onUpdate(next);
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      data-ocid={`admin.booking.status_select.${index}`}
      className="px-2 py-1 rounded-md text-xs font-semibold border outline-none cursor-pointer"
      style={{
        ...statusBadgeStyle(value),
        borderColor: "transparent",
        minWidth: "110px",
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

// ─── Mechanics Tab ─────────────────────────────────────────────────────────

function MechanicsTab() {
  const { data: applications, isLoading, isError } = useGetAllApplications();
  const updateStatus = useUpdateApplicationStatus();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-20 gap-3"
        data-ocid="admin.mechanics.loading_state"
      >
        <Loader2
          className="h-5 w-5 animate-spin"
          style={{ color: "#ff8c42" }}
        />
        <span className="text-sm" style={{ color: "#666" }}>
          Loading registrations...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="py-12 text-center text-sm"
        style={{ color: "#ef4444" }}
        data-ocid="admin.mechanics.error_state"
      >
        Failed to load registrations. Please refresh.
      </div>
    );
  }

  const list: MechanicApplication[] = applications ?? [];

  return (
    <div>
      <div
        className="mb-4 text-xs px-3 py-2 rounded-lg"
        style={{
          backgroundColor: "#fff7ed",
          color: "#9a3412",
          border: "1px solid #fed7aa",
        }}
      >
        Aadhar/PAN documents are sent to your email (amitpanday96149@gmail.com)
        via FormSubmit.
      </div>

      {list.length === 0 ? (
        <div
          className="py-16 text-center bg-white rounded-xl border"
          style={{ borderColor: "#E0E0E0", color: "#999" }}
          data-ocid="admin.mechanics.empty_state"
        >
          <p className="text-base font-medium mb-1">No registrations yet</p>
          <p className="text-sm">
            Mechanic registrations will appear here once submitted.
          </p>
        </div>
      ) : (
        <div
          className="bg-white rounded-xl border overflow-hidden"
          style={{ borderColor: "#E0E0E0" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    backgroundColor: "#F8F9FA",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  {[
                    "#",
                    "Name",
                    "DOB",
                    "Phone",
                    "Service",
                    "Experience",
                    "Address",
                    "Why Join",
                    "Submitted At",
                    "Status",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#F0F0F0" }}
                    data-ocid="admin.mechanic.row"
                  >
                    <td
                      className="px-4 py-3 text-center font-medium"
                      style={{ color: "#888", minWidth: "36px" }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      className="px-4 py-3 font-medium whitespace-nowrap"
                      style={{ color: "#222" }}
                    >
                      {item.name}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {item.dateOfBirth}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {item.phone}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {item.serviceType}
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "#444" }}
                    >
                      {item.experience}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "#444", maxWidth: "160px" }}
                    >
                      <span className="block truncate" title={item.address}>
                        {item.address}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "#444", maxWidth: "140px" }}
                    >
                      <span className="block truncate" title={item.motivation}>
                        {item.motivation || "—"}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap text-xs"
                      style={{ color: "#666" }}
                    >
                      {formatTimestamp(item.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <MechanicStatusSelect
                        index={idx + 1}
                        id={item.id}
                        currentStatus={item.status}
                        onUpdate={(newStatus) =>
                          updateStatus.mutate({
                            id: item.id,
                            status: newStatus,
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MechanicStatusSelect({
  index,
  currentStatus,
  onUpdate,
}: {
  index: number;
  id?: string;
  currentStatus: string;
  onUpdate: (s: string) => void;
}) {
  const [value, setValue] = useState(currentStatus || "Pending");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setValue(next);
    onUpdate(next);
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      data-ocid={`admin.mechanic.status_select.${index}`}
      className="px-2 py-1 rounded-md text-xs font-semibold border outline-none cursor-pointer"
      style={{
        ...statusBadgeStyle(value),
        borderColor: "transparent",
        minWidth: "110px",
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
