"use client";

import { Star, CheckCircle, Quote } from "lucide-react";

const reviews = [
  {
    name: "Aman Verma",
    location: "Bengaluru, Karnataka",
    role: "Senior Software Engineer",
    amount: "₹3,50,000 Sanctioned",
    purpose: "Home Renovation",
    rating: 5,
    text: "Needed emergency funds for house renovation before Diwali. Bank branches asked for 10 days of paperwork, but Aapka Credit credited ₹3.5 Lakhs directly to my HDFC account in under 7 minutes. Outstanding service!",
  },
  {
    name: "Sunita Deshmukh",
    location: "Pune, Maharashtra",
    role: "Boutique Owner",
    amount: "₹5,00,000 Sanctioned",
    purpose: "Business Inventory",
    rating: 5,
    text: "As a small business owner, getting working capital without property collateral was impossible until I used Aapka Credit. The DigiLocker e-KYC was completely seamless. Highly recommended for MSMEs!",
  },
  {
    name: "Rahul Sharma",
    location: "Jaipur, Rajasthan",
    role: "Sales Executive",
    amount: "₹1,20,000 Sanctioned",
    purpose: "Medical Emergency",
    rating: 5,
    text: "When my father had a sudden hospital admission, Aapka Credit was a lifesaver. Completed KYC from my phone sitting at the hospital, and funds reached within minutes. Zero hidden charges.",
  },
  {
    name: "Pooja Hegde",
    location: "Hyderabad, Telangana",
    role: "Marketing Specialist",
    amount: "₹2,00,000 Sanctioned",
    purpose: "Two-Wheeler Purchase",
    rating: 5,
    text: "Clear interest rates, zero pre-closure fees, and automated monthly UPI repayments. Finally a fintech lending app that treats borrowers respectfully without aggressive calls.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-50/70 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-3">
            Borrower experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted By Over 50 Lakh+ Borrowers Across India
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Read how everyday Indians use Aapka Credit to fund their dreams and overcome emergencies.
          </p>
        </div>

        {/* Testimonials 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Rating & Sanction Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 tabular-nums">
                    {rev.amount}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{rev.name}</h4>
                    <p className="text-[11px] text-slate-500">{rev.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
