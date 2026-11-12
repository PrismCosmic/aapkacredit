/**
 * Author data for Aapka Credit Finance Team.
 * Used for E-E-A-T signals on blog posts and the /authors page.
 */
export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  avatar: string; // path relative to /public
  linkedIn?: string;
  twitter?: string;
  articleCount?: number;
}

export const authors: Author[] = [
  {
    id: "aapka-credit-finance-team",
    name: "Aapka Credit Finance Team",
    role: "Editorial Team",
    bio: "The Aapka Credit Finance Team consists of certified financial analysts, former bankers, and FinTech product specialists with a combined 50+ years of experience in Indian lending markets. Our editorial content is fact-checked against Money Lending License guidelines, SEBI regulations, and current lending practices before publication.",
    expertise: [
      "Personal Finance",
      "Credit Assessment",
      "Digital Lending",
      "MSME Finance",
      "Education Finance",
      "Tax Planning",
      "Debt Management",
    ],
    avatar: "/team/finance-team.svg",
    linkedIn: "https://www.linkedin.com/showcase/aapkacredit/",
    articleCount: 15,
  },
  {
    id: "prism-cosmic",
    name: "Prism Cosmic Research",
    role: "Technology & Research",
    bio: "The Prism Cosmic Research team focuses on FinTech innovation, AI-driven credit assessment, and India's evolving digital lending landscape. Their research informs Aapka Credit's product decisions and educational content, drawing on data from regulatory bodies, SIDBI, and global fintech benchmarks.",
    expertise: [
      "FinTech Research",
      "AI in Lending",
      "Credit Bureau Analytics",
      "Digital Lending Regulatory Framework",
      "Account Aggregator Framework",
    ],
    avatar: "/team/research-team.svg",
    linkedIn: "https://www.linkedin.com/company/prismcosmic/",
    articleCount: 4,
  },
];

export function getAuthorById(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}
