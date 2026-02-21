"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-400 mb-2">
          Admin Error
        </h2>
        <p className="text-gray-400 mb-4">
          Something went wrong in the admin panel.
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
