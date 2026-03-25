import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dokument-Form */}
          <rect x="3" y="2" width="11" height="14" rx="1.5" fill="white" fillOpacity="0.95" />
          <rect x="3" y="2" width="11" height="14" rx="1.5" fill="white" fillOpacity="0.1" />
          {/* Linien im Dokument */}
          <rect x="5.5" y="5.5" width="6" height="1.2" rx="0.6" fill="#4f46e5" />
          <rect x="5.5" y="8" width="6" height="1.2" rx="0.6" fill="#4f46e5" />
          <rect x="5.5" y="10.5" width="4" height="1.2" rx="0.6" fill="#4f46e5" />
          {/* KI-Blitz unten rechts */}
          <circle cx="14.5" cy="14.5" r="4" fill="#6366f1" />
          <circle cx="14.5" cy="14.5" r="4" fill="url(#bolt-bg)" />
          <polygon
            points="14.5,11.5 12.5,14.8 14.2,14.8 13.5,17.5 16.5,13.8 14.6,13.8"
            fill="white"
          />
          <defs>
            <linearGradient id="bolt-bg" x1="10.5" y1="10.5" x2="18.5" y2="18.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4338ca" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
    { ...size }
  );
}
