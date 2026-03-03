export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold">
            <span style={{ color: "#FFD700" }}>Quick</span>
            <span style={{ color: "#ff8c42" }}>Repair</span>
          </span>
          . All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          30-Minute Electrical Service | Mahipalpur, Delhi | +918004774839
        </p>
        <p className="text-xs text-gray-600 mt-3">
          Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-400 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
