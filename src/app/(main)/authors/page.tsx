import type { Metadata } from "next";
import { authors } from "@/lib/authors";
import { blogPosts } from "@/lib/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";
import { Linkedin, Twitter, BookOpen, Award, CheckCircle2, Briefcase, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Authors – Finance Experts at Aapka Credit",
  description:
    "Meet the certified financial analysts, former bankers, and FinTech specialists behind Aapka Credit's editorial content. All articles are fact-checked against RBI guidelines.",
  alternates: {
    canonical: "https://aapkacredit.com/authors",
  },
};

export default function AuthorsPage() {
  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Aapka Credit Editorial Team",
    description: "Certified financial analysts and FinTech specialists who write Aapka Credit's content.",
    itemListElement: authors.map((author, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: author.name,
        jobTitle: author.role,
        description: author.bio,
        worksFor: {
          "@type": "Organization",
          name: "Aapka Credit",
          url: "https://aapkacredit.com",
        },
        knowsAbout: author.expertise,
        sameAs: [author.linkedIn, author.twitter].filter(Boolean),
        url: `https://aapkacredit.com/authors`,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <JsonLd data={teamSchema} id="authors-schema" />
      <BreadcrumbSchema items={[{ name: "Authors", url: "https://aapkacredit.com/authors" }]} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-5">
            Editorial Team
          </span>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight sm:text-5xl mb-4">
            Written by Finance Experts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every article on Aapka Credit is researched and written by financial professionals with deep
            expertise in Indian lending, credit assessment, and FinTech. Our content is fact-checked
            against Money Lending License guidelines before publication.
          </p>
        </div>

        {/* Trust bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: Award, label: "50+ Years", desc: "Combined finance experience" },
            { icon: CheckCircle2, label: "RBI Compliant", desc: "Content fact-checked vs regulations" },
            { icon: BookOpen, label: "15+ Guides", desc: "Published finance articles" },
          ].map((item) => (
            <div key={item.label} className="glass rounded-2xl p-5 border border-foreground/10 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Author cards */}
        <div className="space-y-8">
          {authors.map((author) => {
            const authorPosts = blogPosts.filter(() => true); // All posts by team
            return (
              <div
                key={author.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Avatar placeholder */}
                  <div className="h-16 w-16 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 text-blue-600">
                    {author.name === "Aapka Credit Finance Team" ? (
                      <Briefcase className="w-8 h-8" />
                    ) : (
                      <GraduationCap className="w-8 h-8" />
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">{author.name}</h2>
                        <p className="text-sm text-primary font-medium mt-1">{author.role}</p>
                      </div>
                      {/* Social links */}
                      <div className="flex gap-2">
                        {author.linkedIn && (
                          <a
                            href={author.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${author.name} on LinkedIn`}
                            className="h-9 w-9 rounded-full glass border border-foreground/10 flex items-center justify-center text-foreground/60 hover:text-primary transition"
                          >
                            <Linkedin className="h-4 w-4" aria-hidden="true" />
                          </a>
                        )}
                        {author.twitter && (
                          <a
                            href={author.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${author.name} on X/Twitter`}
                            className="h-9 w-9 rounded-full glass border border-foreground/10 flex items-center justify-center text-foreground/60 hover:text-primary transition"
                          >
                            <Twitter className="h-4 w-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                      {author.bio}
                    </p>

                    {/* Expertise tags */}
                    <div className="mb-6">
                      <p className="text-xs font-medium text-slate-500 mb-3">Areas of Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {author.expertise.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1 text-xs text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Article count */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                      <span className="font-mono tabular-nums">{author.articleCount}</span>
                      <span>articles published</span>
                      <span className="mx-1">·</span>
                      <Link href="/blog" className="text-blue-600 hover:underline">
                        View all articles →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial policy */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Our Editorial Policy</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            All content published on Aapka Credit is original, independently researched, and reviewed for
            accuracy against current RBI regulations, SEBI guidelines, and IRDAI notifications before
            going live. We do not accept sponsored articles or allow advertisers to influence editorial
            content. If you spot an error, please email{" "}
            <a href="mailto:support@aapkacredit.com" className="text-blue-600 hover:underline">
              support@aapkacredit.com
            </a>
            .
          </p>
        </div>

        {/* Internal links */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm text-foreground/70 hover:text-foreground hover:border-primary transition"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Browse all finance articles
          </Link>
        </div>
      </div>
    </main>
  );
}
