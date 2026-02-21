"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error Boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0a0a0a", color: "#e5e5e5", fontFamily: "system-ui, sans-serif" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}>
          <div style={{
            background: "rgba(127, 29, 29, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "28rem",
            textAlign: "center",
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#f87171", marginBottom: "0.5rem" }}>
              Something went wrong
            </h2>
            <p style={{ color: "#9ca3af", marginBottom: "1rem" }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#F4D225",
                color: "#000",
                border: "none",
                borderRadius: "6px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
