import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Vercel handles Next.js deployment natively — no explicit `output: 'export'`
  // needed. Every page in this project uses generateStaticParams() so the
  // pages still get prerendered at build time and served from Vercel's edge.
  pageExtensions: ["ts", "tsx", "mdx"],
  images: { unoptimized: true },
  trailingSlash: false,
};

// Turbopack requires string-form plugin specs (not function references)
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-frontmatter"],
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
      ["remark-gfm"],
    ],
    rehypePlugins: [
      ["rehype-slug"],
      [
        "rehype-autolink-headings",
        { behavior: "wrap", properties: { className: ["heading-anchor"] } },
      ],
    ],
  },
});

export default withMDX(nextConfig);
