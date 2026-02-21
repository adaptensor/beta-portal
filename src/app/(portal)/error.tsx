"use client";

import { useEffect } from "react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Portal Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-400 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-400 mb-4">
          An unexpected error occurred in the portal. Our team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-yellow-500 text-black rounded font-medium hover:bg-yellow-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
