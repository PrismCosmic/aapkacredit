"use client";

import { useState } from "react";
import { Calendar, ArrowRight, X } from "lucide-react";

export interface PressReleaseItem {
  title: string;
  date: string;
  summary: string;
  fullText: string[];
  category: string;
}

export function PressReleasesClient({ releases }: { releases: PressReleaseItem[] }) {
  const [selected, setSelected] = useState<PressReleaseItem | null>(null);

  return (
    <>
      <div className="mt-20 space-y-8">
        {releases.map((release, i) => (
          <article
            key={i}
            className="glass p-8 rounded-3xl border border-border group transition-all hover:bg-foreground/[0.03]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Calendar className="h-4 w-4" />
                {release.date}
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                {release.category}
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
              {release.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{release.summary}</p>
            <button
              type="button"
              onClick={() => setSelected(release)}
              className="text-sm font-semibold text-foreground flex items-center gap-1 group-hover:gap-2 transition-all hover:text-primary"
            >
              Read Full Release <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="press-modal-title"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-background border border-border p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close press release"
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>{selected.date}</span>
              <span>•</span>
              <span>{selected.category}</span>
            </div>
            <h3 id="press-modal-title" className="text-2xl font-display font-bold text-foreground mb-4 pr-8">
              {selected.title}
            </h3>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {selected.fullText.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
