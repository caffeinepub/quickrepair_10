import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  Info,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ContactInquiry } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMetaTags } from "../hooks/useMetaTags";
import { type BookingRecord, getAllBookings } from "../utils/bookingStorage";

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

export default function MyBookingsPage() {
  useMetaTags({
    title: "My Bookings | QuickRepair Mahipalpur",
    description:
      "View your complete QuickRepair booking history and live status.",
  });

  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [liveStatuses, setLiveStatuses] = useState<Record<string, string>>({});
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(false);

  // Load from localStorage whenever logged in status changes
  useEffect(() => {
    if (isLoggedIn) {
      setBookings(getAllBookings());
    }
  }, [isLoggedIn]);

  // Fetch live statuses from backend for all bookings with internalIds
  useEffect(() => {
    if (!isLoggedIn || !actor || actorFetching || bookings.length === 0) return;

    const internalIds = bookings.map((b) => b.internalId).filter(Boolean);
    if (internalIds.length === 0) return;

    setStatusLoading(true);
    setStatusError(false);

    actor
      .getAllInquiries()
      .then((all: ContactInquiry[]) => {
        const map: Record<string, string> = {};
        for (const inq of all) {
          map[inq.id] = inq.status;
        }
        setLiveStatuses(map);
        setStatusLoading(false);
      })
      .catch(() => {
        setStatusError(true);
        setStatusLoading(false);
      });
  }, [isLoggedIn, actor, actorFetching, bookings]);

  if (isInitializing) {
    return (
      <main
        className="page-fade-in pt-20 pb-20 px-4 min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F8F9FA" }}
      >
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
            style={{ color: "#ff8c42" }}
          />
          <span className="text-sm">Loading...</span>
        </div>
      </main>
    );
  }

  return (
    <main
      className="page-fade-in pt-20 pb-20 px-4 sm:px-6 min-h-screen"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: "rgba(255,140,66,0.12)",
              color: "#ff8c42",
            }}
          >
            <BookOpen size={13} />
            My Bookings
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Booking History
          </h1>
          <p className="text-gray-500 text-base">
            View all your bookings and their live status.
          </p>
        </div>

        {/* Not logged in — show sign in prompt */}
        {!isLoggedIn && (
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center"
            data-ocid="mybookings.login_panel"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "rgba(255,140,66,0.1)" }}
            >
              <LogIn size={28} style={{ color: "#ff8c42" }} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Sign In Required
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Sign in to view your complete booking history and live status
              updates.
            </p>
            <button
              type="button"
              onClick={login}
              disabled={isLoggingIn}
              className="cta-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-white font-bold text-sm"
              style={{ backgroundColor: "#ff8c42", borderRadius: "8px" }}
              data-ocid="mybookings.login_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In with Internet Identity
                </>
              )}
            </button>
          </div>
        )}

        {/* Logged in */}
        {isLoggedIn && (
          <>
            {/* User bar */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-3 mb-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ backgroundColor: "#ff8c42" }}
                >
                  {identity?.getPrincipal().toString().charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p
                    className="text-xs font-mono text-gray-600 max-w-[180px] truncate"
                    title={identity?.getPrincipal().toString()}
                  >
                    {identity?.getPrincipal().toString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-gray-50"
                style={{ color: "#888" }}
                data-ocid="mybookings.logout_button"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>

            {/* localStorage note */}
            <div
              className="flex items-start gap-2 px-4 py-3 rounded-lg mb-5 text-xs"
              style={{
                backgroundColor: "#fffbeb",
                color: "#92400e",
                border: "1px solid #fde68a",
              }}
            >
              <Info size={14} className="mt-0.5 shrink-0" />
              <p>
                Bookings are saved in your browser. Clearing browser data may
                delete your history. Save your Booking ID for future reference.
              </p>
            </div>

            {/* Status loading */}
            {statusLoading && (
              <div
                className="flex items-center gap-2 text-xs text-gray-400 mb-4"
                data-ocid="mybookings.loading_state"
              >
                <Loader2
                  size={13}
                  className="animate-spin"
                  style={{ color: "#ff8c42" }}
                />
                Fetching live status...
              </div>
            )}

            {statusError && (
              <div
                className="flex items-center gap-2 text-xs text-amber-600 mb-4 px-4 py-2 rounded-lg"
                style={{ backgroundColor: "rgba(251,191,36,0.1)" }}
                data-ocid="mybookings.error_state"
              >
                <AlertCircle size={13} />
                Could not fetch live status. Showing last saved status.
              </div>
            )}

            {/* Empty state */}
            {bookings.length === 0 && (
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-14 text-center"
                data-ocid="mybookings.empty_state"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "rgba(255,140,66,0.1)" }}
                >
                  <BookOpen size={24} style={{ color: "#ff8c42" }} />
                </div>
                <p className="text-gray-700 font-bold text-base mb-1">
                  No bookings found
                </p>
                <p className="text-gray-400 text-sm mb-5">
                  No bookings yet? Make your first booking now!
                </p>
                <Link
                  to="/book"
                  search={{ service: "" }}
                  className="cta-btn inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold text-sm"
                  style={{ backgroundColor: "#ff8c42", borderRadius: "8px" }}
                  data-ocid="mybookings.book_now_link"
                >
                  Book Now
                </Link>
              </div>
            )}

            {/* Bookings list */}
            {bookings.length > 0 && (
              <div className="space-y-4" data-ocid="mybookings.list">
                {bookings.map((record, idx) => {
                  const liveStatus =
                    record.internalId && liveStatuses[record.internalId]
                      ? liveStatuses[record.internalId]
                      : record.status;

                  return (
                    <div
                      key={record.bookingId}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                      data-ocid={`mybookings.item.${idx + 1}`}
                    >
                      {/* Card header */}
                      <div
                        className="px-5 py-4 flex items-center justify-between"
                        style={{
                          backgroundColor: "rgba(255,140,66,0.04)",
                          borderBottom: "1px solid #F5F5F5",
                        }}
                      >
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
                            Booking ID
                          </p>
                          <p
                            className="text-base font-black tracking-widest"
                            style={{
                              fontFamily:
                                "'Geist Mono', 'JetBrains Mono', monospace",
                              color: "#1a1a1a",
                            }}
                          >
                            {record.bookingId}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={statusBadgeStyle(liveStatus)}
                          >
                            {liveStatus}
                          </span>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
                            Service
                          </p>
                          <p className="text-gray-800 font-medium text-xs leading-relaxed">
                            {record.serviceType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
                            Phone
                          </p>
                          <p className="text-gray-800 font-medium text-xs">
                            {record.phone}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
                            Address
                          </p>
                          <p className="text-gray-800 font-medium text-xs leading-relaxed">
                            {record.address}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">
                            Submitted On
                          </p>
                          <p className="text-gray-500 text-xs">
                            {formatDate(record.submittedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Card footer */}
                      <div
                        className="px-5 py-3 flex items-center gap-3"
                        style={{ borderTop: "1px solid #F5F5F5" }}
                      >
                        <Link
                          to="/tracking"
                          search={{ id: record.bookingId }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                          style={{ color: "#ff8c42" }}
                          data-ocid={`mybookings.track_link.${idx + 1}`}
                        >
                          <MapPin size={12} />
                          Track Booking
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
