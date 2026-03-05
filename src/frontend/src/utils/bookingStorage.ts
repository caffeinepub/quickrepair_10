/**
 * bookingStorage.ts
 * Client-side localStorage utility for QuickRepair booking history.
 * Data is stored locally — if the user clears browser data, history is gone.
 */

export interface BookingRecord {
  bookingId: string; // 10-digit numeric string (frontend-generated)
  internalId: string; // INQ-1, INQ-2 etc from backend
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  address: string;
  description: string;
  preferredTime: string;
  submittedAt: string; // ISO date string
  status: string; // last known status (Pending by default)
}

const STORAGE_KEY = "qr_booking_history";

/**
 * Generates a 10-digit numeric Booking ID.
 * Combines timestamp (7 digits) + random (3 digits) with overflow protection.
 */
export function generate10DigitId(): string {
  const ts = Date.now() % 10_000_000; // 7 digits from timestamp
  const rand = Math.floor(Math.random() * 1000); // 3 random digits
  const combined = ts * 1000 + rand;
  const withLeading = (combined % 9_000_000_000) + 1_000_000_000;
  return String(withLeading);
}

/**
 * Reads all bookings from localStorage.
 */
export function getAllBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Looks up a single booking by its 10-digit bookingId.
 */
export function getBookingById(bookingId: string): BookingRecord | null {
  const all = getAllBookings();
  return all.find((b) => b.bookingId === bookingId) ?? null;
}

/**
 * Appends a new booking to the localStorage history.
 * Keeps the most recent 100 bookings to prevent unbounded growth.
 */
export function saveBooking(record: BookingRecord): void {
  try {
    const all = getAllBookings();
    all.unshift(record); // newest first
    const trimmed = all.slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Silently ignore if localStorage is unavailable
  }
}
