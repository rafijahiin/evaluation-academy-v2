/**
 * Next.js looks for a top-level mdx-components.tsx so MDX content can
 * pick up site-wide component overrides (typography, custom blocks).
 */
import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/lesson/mdx/MDXComponents";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, ...mdxComponents };
}
