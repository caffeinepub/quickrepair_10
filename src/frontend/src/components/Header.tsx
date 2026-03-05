import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to close menu on path change
  useEffect(() => {
    setMenuOpen(false);
  }, [router.state.location.pathname]);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const currentPath = router.state.location.pathname;
    if (currentPath !== "/") {
      navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 120);
      });
    } else {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tight select-none"
          data-ocid="nav.home_link"
          aria-label="QuickRepair home"
        >
          <span style={{ color: "#FFD700" }}>Quick</span>
          <span style={{ color: "#ff8c42" }}>Repair</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          <button
            type="button"
            onClick={() => scrollToSection("top")}
            className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 rounded-md transition-colors cursor-pointer"
            data-ocid="nav.home_button"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("services")}
            className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 rounded-md transition-colors cursor-pointer"
            data-ocid="nav.services_button"
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 rounded-md transition-colors cursor-pointer"
            data-ocid="nav.contact_button"
          >
            Contact
          </button>
          <Link
            to="/book"
            search={{ service: "" }}
            className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 rounded-md transition-colors"
            data-ocid="nav.book_link"
          >
            Book Now
          </Link>

          <Link
            to="/mechanic-register"
            className="ml-1 px-4 py-2 text-sm font-bold text-white rounded-lg cta-btn"
            style={{ backgroundColor: "#ff8c42" }}
            data-ocid="nav.mechanic_link"
          >
            Join as Mechanic
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          data-ocid="nav.mobile_toggle"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav
            className="flex flex-col px-4 py-3 gap-1"
            aria-label="Mobile navigation"
          >
            <button
              type="button"
              onClick={() => scrollToSection("top")}
              className="text-left px-3 py-3 text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors"
              data-ocid="nav.mobile_home_button"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("services")}
              className="text-left px-3 py-3 text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors"
              data-ocid="nav.mobile_services_button"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="text-left px-3 py-3 text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors"
              data-ocid="nav.mobile_contact_button"
            >
              Contact
            </button>
            <Link
              to="/book"
              search={{ service: "" }}
              className="block px-3 py-3 text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.mobile_book_link"
            >
              Book Now
            </Link>

            <Link
              to="/mechanic-register"
              className="mt-1 px-4 py-3 text-sm font-bold text-white rounded-lg text-center cta-btn block"
              style={{ backgroundColor: "#ff8c42" }}
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.mobile_mechanic_link"
            >
              Join as Mechanic
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
