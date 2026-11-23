"use client";
import type { ReactNode } from "react";
import { Reveal } from "@/components/fx/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <Reveal className={`max-w-3xl ${a}`}>
      {eyebrow && (
        <div
          className={`mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-foreground/60 sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
