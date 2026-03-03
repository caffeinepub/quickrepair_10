import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      navigate({ to: "/admin/dashboard" });
    }
  }, [navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (password === "admin@123") {
        sessionStorage.setItem("adminAuth", "true");
        navigate({ to: "/admin/dashboard" });
      } else {
        setError("Incorrect password");
        setLoading(false);
      }
    }, 300);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg border p-8"
        style={{ borderColor: "#E0E0E0" }}
      >
        {/* Logo */}
        <div className="text-center mb-2">
          <span
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', 'Figtree', sans-serif" }}
          >
            <span style={{ color: "#FFD700" }}>Quick</span>
            <span style={{ color: "#ff8c42" }}>Repair</span>
          </span>
        </div>

        <p
          className="text-center text-sm font-medium mb-8"
          style={{ color: "#666" }}
        >
          Admin Panel
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium"
              style={{ color: "#333" }}
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter admin password"
              required
              data-ocid="admin.login.password_input"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
              style={{
                borderColor: error ? "#ef4444" : "#E0E0E0",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ff8c42";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? "#ef4444" : "#E0E0E0";
              }}
            />
          </div>

          {error && (
            <p
              className="text-sm font-medium"
              style={{ color: "#ef4444" }}
              data-ocid="admin.login.error_state"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            data-ocid="admin.login.submit_button"
            className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all cta-btn disabled:opacity-60"
            style={{ backgroundColor: "#ff8c42" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
