import { blogPosts } from "@/lib/blog";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Personal Finance Blog – Credit & Loan Guides | Aapka Credit",
  description: "Expert guides on improving your CIBIL score, personal loan eligibility, EMI calculation, home loan tax benefits, and smart debt management strategies.",
  keywords: ["finance blog", "personal loan tips", "credit score guide", "loan advice india", "improve cibil score", "emi planning"],
  alternates: {
    canonical: "https://aapkacredit.com/blog",
  },
};

export default function BlogIndexPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Aapka Credit Financial Insights & Guides",
    "description": "Expert guides on personal loans, credit scores, EMI planning, and smart borrowing in India.",
    "url": "https://aapkacredit.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Aapka Credit",
      "url": "https://aapkacredit.com"
    },
    "blogPost": blogPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "url": `https://aapkacredit.com/blog/${post.slug}`,
      "datePublished": post.date,
      "keywords": post.keywords.join(", "),
    }))
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <JsonLd data={blogSchema} id="blog-schema" />
      <BreadcrumbSchema items={[{ name: "Blog", url: "https://aapkacredit.com/blog" }]} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Financial Insights &amp; Guides
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master your personal finances with expert guides on credit scores, loan eligibility, EMI planning, and smart debt management — written by the Aapka Credit team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
              <article className="bg-white rounded-2xl p-6 h-full flex flex-col border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3 text-xs font-medium text-blue-600 mb-4">
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-md">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-mono tabular-nums">
                    <BookOpen className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors font-display leading-snug">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                  {post.description}
                </p>
                <div className="flex items-center text-primary text-sm font-semibold mt-auto">
                  Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
