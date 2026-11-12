import React from 'react';

export default function PortalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-950/60" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Loading AapkaCredit secure services...
      </p>
    </div>
  );
}

