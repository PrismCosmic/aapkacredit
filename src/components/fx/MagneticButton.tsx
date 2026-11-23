"use client";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "primary",
  type,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  }
  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  }

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs font-medium transition-colors duration-150";
  const styles =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700";

  const inner = (
    <span
      ref={ref}
      className="relative z-10 pointer-events-none inline-flex items-center gap-2"
    >
      {children}
    </span>
  );

  const bg = null;

  if (href) {
    return (
      <a
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cn(base, styles, "overflow-hidden", className)}
      >
        {bg}
        {inner}
      </a>
    );
  }
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={disabled ? undefined : onMove}
      onMouseLeave={disabled ? undefined : onLeave}
      className={cn(base, styles, "overflow-hidden", disabled && "opacity-60 cursor-not-allowed pointer-events-none", className)}
    >
      {bg}
      {inner}
    </button>
  );
}
