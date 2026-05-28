import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Static export for Vercel CDN
  output: "export",
  // Allow .mdx files as pages
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
