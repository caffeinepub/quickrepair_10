import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Cog,
  Mail,
  MapPin,
  Phone,
  Settings,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMetaTags } from "../hooks/useMetaTags";

const SERVICES = [
  {
    id: 1,
    name: "Basic Electrician",
    price: "₹299",
    icon: Zap,
    short:
      "House wiring, switchboard repair, MCB fix, fan regulator repair, socket/switch installation.",
    long: "We provide expert basic electrical services across Mahipalpur Extension, Mahipalpur Village, and nearby areas. Our verified electricians handle all standard wiring and repair needs quickly and affordably.",
  },
  {
    id: 2,
    name: "Electrical Appliances",
    price: "₹349",
    icon: Wrench,
    short:
      "Geyser wiring, inverter connection, stabilizer repair, exhaust fan fitting, water pump wiring.",
    long: "Get your electrical appliances installed and repaired by certified technicians in Aerocity, Vasant Kunj, and Rangpuri within 30 minutes of booking.",
  },
  {
    id: 3,
    name: "Electrical Maintenance",
    price: "₹399",
    icon: Settings,
    short:
      "Periodic electrical checkup, voltage stabilization, old wiring upgrade, meter box repair.",
    long: "Regular maintenance prevents costly breakdowns. We serve Nagal Dewat, Mahipalpur Village, and all surrounding areas with scheduled and emergency maintenance visits.",
  },
  {
    id: 4,
    name: "AC & Cooling Services",
    price: "₹499",
    icon: Wind,
    short:
      "AC wiring, dedicated power supply connection, stabilizer setup, voltage check, split AC installation support.",
    long: "Expert AC wiring and power setup for homes and offices in Aerocity, Vasant Kunj, and Mahipalpur Extension.",
  },
  {
    id: 5,
    name: "Electrical Mechanic",
    price: "₹299",
    icon: Cog,
    short:
      "Motor rewinding, generator repair, power tools fixing, industrial wiring, panel board repair.",
    long: "Specialized mechanical and industrial electrical services available across all 6 service areas including Rangpuri and Nagal Dewat.",
  },
];

const FAQS = [
  {
    q: "How fast do you respond?",
    a: "We reach your doorstep within 30 minutes of your booking.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Mahipalpur Extension, Mahipalpur Village, Aerocity, Vasant Kunj, Rangpuri, and Nagal Dewat.",
  },
  {
    q: "Do you charge extra for emergency?",
    a: "No, same fixed prices always. No hidden charges.",
  },
  {
    q: "Are your electricians verified?",
    a: "Yes, all electricians are background-verified, trained, and certified.",
  },
];

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "QuickRepair",
  telephone: "+918004774839",
  email: "amitpanday96149@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mahipalpur",
    addressRegion: "Delhi",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "28.5494",
    longitude: "77.1176",
  },
  openingHours: "Mo-Su 08:00-20:00",
  areaServed: [
    "Mahipalpur Extension",
    "Mahipalpur Village",
    "Aerocity",
    "Vasant Kunj",
    "Rangpuri",
    "Nagal Dewat",
  ],
};

function ServiceCard({
  service,
  index,
  onNavigate,
}: {
  service: (typeof SERVICES)[0];
  index: number;
  onNavigate: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = service.icon;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <button
      ref={cardRef}
      type="button"
      className={`service-card card-reveal w-full text-left bg-white rounded-xl p-6 border border-gray-200 shadow-sm cursor-pointer group ${visible ? "visible" : ""}`}
      style={{ borderWidth: "1.5px" }}
      onClick={onNavigate}
      aria-label={`Book ${service.name} - ${service.price}`}
      data-ocid={`service.card.${service.id}`}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: "rgba(255,140,66,0.1)" }}
      >
        <Icon size={22} style={{ color: "#ff8c42" }} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
      <div className="text-2xl font-black mb-3" style={{ color: "#ff8c42" }}>
        {service.price}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {service.short} {service.long}
      </p>

      {/* Book Now indicator */}
      <div
        className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold"
        style={{ color: "#ff8c42", opacity: 0.6 }}
      >
        <span>Book Now</span>
        <ArrowRight
          size={13}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </button>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gray-200 rounded-xl overflow-hidden"
      data-ocid={`faq.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full text-left px-5 py-4 font-semibold text-gray-800 flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-ocid={`faq.toggle.${index + 1}`}
      >
        <span>{q}</span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      <div className={`faq-answer ${open ? "open" : ""}`}>
        <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  useMetaTags({
    title: "QuickRepair Mahipalpur | 30 Minute Electrical Service",
    description:
      "Need an electrician in Mahipalpur? QuickRepair provides 30-minute electrical services including wiring, appliance repair, AC services & more. Call now! +918004774839",
  });

  const navigate = useNavigate();

  // Inject JSON-LD schema
  useEffect(() => {
    const existing = document.getElementById("local-business-schema");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "local-business-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(LOCAL_BUSINESS_SCHEMA);
      document.head.appendChild(script);
    }
    return () => {
      document.getElementById("local-business-schema")?.remove();
    };
  }, []);

  return (
    <main className="page-fade-in" id="top">
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">
        QuickRepair Mahipalpur – 30 Minute Electrical Service
      </h1>

      {/* Hero Section */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
        aria-label="Hero"
      >
        {/* Decorative background elements */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #FFD700 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ff8c42 0%, transparent 40%)",
          }}
        />
        {/* Diagonal transition */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background:
              "linear-gradient(to bottom right, transparent 49.9%, #F8F9FA 50%)",
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available Now · 8 AM – 8 PM
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            🔧 <span style={{ color: "#FFD700" }}>Quick</span>
            <span style={{ color: "#ff8c42" }}>Repair</span>{" "}
            <span className="block mt-1 text-white/95">Mahipalpur</span>
          </h2>

          <p className="text-xl sm:text-2xl text-white/80 font-medium mb-3">
            30 Minute Electrical Service at Your Doorstep
          </p>

          <p className="text-base text-white/60 mb-8">
            7 Days &nbsp;|&nbsp; 8 AM – 8 PM
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              search={{ service: "" }}
              className="cta-btn inline-flex items-center gap-2 text-white font-bold text-base rounded-lg shadow-lg"
              style={{
                backgroundColor: "#ff8c42",
                borderRadius: "8px",
                padding: "14px 28px",
              }}
              data-ocid="hero.primary_button"
            >
              📅 Book Online Now
            </Link>
            <a
              href="tel:+918004774839"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold text-base px-7 py-4 rounded-lg border border-white/30 hover:bg-white/20 transition-colors"
              data-ocid="hero.phone_button"
            >
              <Phone size={18} />
              +91 8004774839
            </a>
          </div>

          {/* Service area chips */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {[
              "Mahipalpur Extension",
              "Mahipalpur Village",
              "Aerocity",
              "Vasant Kunj",
              "Rangpuri",
              "Nagal Dewat",
            ].map((area) => (
              <span
                key={area}
                className="text-xs bg-white/10 text-white/70 border border-white/15 px-3 py-1 rounded-full"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6"
        style={{ backgroundColor: "#F8F9FA" }}
        aria-labelledby="services-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              id="services-heading"
              className="text-3xl sm:text-4xl font-black text-gray-900 mb-3"
            >
              Our Electrical Services
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Fast, reliable, and affordable electrical services across
              Mahipalpur and surrounding areas.
            </p>
          </div>

          <p className="text-gray-400 text-sm text-center mt-2 mb-8">
            Click any service card to book instantly
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                onNavigate={() =>
                  navigate({
                    to: "/book",
                    search: { service: `${service.name} - ${service.price}` },
                  })
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        className="py-20 px-4 sm:px-6 bg-white"
        aria-labelledby="about-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                id="about-heading"
                className="text-3xl sm:text-4xl font-black text-gray-900 mb-5"
              >
                About <span style={{ color: "#FFD700" }}>Quick</span>
                <span style={{ color: "#ff8c42" }}>Repair</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                QuickRepair is Mahipalpur's fastest electrical service provider.
                From basic wiring to appliance installation and maintenance — we
                do it all in 30 minutes. All our electricians are verified,
                background-checked, and trained. We offer transparent pricing,
                cash on delivery, and a 30-minute service guarantee. We provide
                fast electrical services across Mahipalpur Extension, Mahipalpur
                Village, Aerocity, Vasant Kunj, Rangpuri, and Nagal Dewat.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Service Guarantee", value: "30 Min" },
                { label: "Days Available", value: "7 Days" },
                { label: "Verified Pros", value: "100%" },
                { label: "Fixed Price", value: "Always" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100"
                >
                  <div
                    className="text-3xl font-black mb-1"
                    style={{ color: "#ff8c42" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-20 px-4 sm:px-6"
        style={{ backgroundColor: "#F8F9FA" }}
        aria-labelledby="faq-heading"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2
              id="faq-heading"
              className="text-3xl font-black text-gray-900 mb-3"
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 bg-white"
        aria-labelledby="contact-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              id="contact-heading"
              className="text-3xl sm:text-4xl font-black text-gray-900 mb-3"
            >
              Contact Us
            </h2>
            <p className="text-gray-500 text-base">
              Electrician in Mahipalpur — fast, affordable, verified. Call or
              book online.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <a
              href="tel:+918004774839"
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all group"
              data-ocid="contact.phone_link"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: "rgba(255,140,66,0.12)" }}
              >
                <Phone size={22} style={{ color: "#ff8c42" }} />
              </div>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Phone
              </span>
              <span className="font-bold text-gray-800 group-hover:text-orange-500 transition-colors text-sm">
                +91 8004774839
              </span>
            </a>

            <a
              href="mailto:amitpanday96149@gmail.com"
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all group"
              data-ocid="contact.email_link"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: "rgba(255,140,66,0.12)" }}
              >
                <Mail size={22} style={{ color: "#ff8c42" }} />
              </div>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Email
              </span>
              <span className="font-bold text-gray-800 group-hover:text-orange-500 transition-colors text-xs break-all">
                amitpanday96149@gmail.com
              </span>
            </a>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: "rgba(255,140,66,0.12)" }}
              >
                <MapPin size={22} style={{ color: "#ff8c42" }} />
              </div>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Service Areas
              </span>
              <span className="font-medium text-gray-700 text-xs leading-relaxed">
                Mahipalpur Ext, Village, Aerocity, Vasant Kunj, Rangpuri, Nagal
                Dewat
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: "rgba(255,140,66,0.12)" }}
              >
                <Clock size={22} style={{ color: "#ff8c42" }} />
              </div>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Hours
              </span>
              <span className="font-bold text-gray-800 text-sm">
                8 AM – 8 PM
              </span>
              <span className="text-xs text-gray-500 mt-1">All 7 Days</span>
            </div>
          </div>

          {/* CTA strip */}
          <div
            className="mt-10 rounded-2xl p-8 text-center text-white"
            style={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            }}
          >
            <p className="text-lg font-bold mb-1">
              Best electrician near Mahipalpur Village &amp; Aerocity
            </p>
            <p className="text-white/60 text-sm mb-5">
              Affordable AC repair Vasant Kunj · Geyser wiring Aerocity ·
              Emergency electrician Mahipalpur Extension
            </p>
            <Link
              to="/book"
              search={{ service: "" }}
              className="cta-btn inline-flex items-center gap-2 font-bold text-white px-8 py-3 rounded-lg"
              style={{ backgroundColor: "#ff8c42", borderRadius: "8px" }}
              data-ocid="contact.book_button"
            >
              Book a Service Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
