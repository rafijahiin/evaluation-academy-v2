"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CHAPTERS } from "@/content/chapters";

/**
 * Always-visible breadcrumb derived from pathname.
 * Hidden on the home page itself.
 */
export function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  // Build human-readable trail
  const trail = [{ label: "Home", href: "/" }, ...segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    let label = seg.replace(/-/g, " ");
    // Replace chapter slugs with their titles
    const chapter = CHAPTERS.find((c) => c.slug === seg);
    if (chapter) label = `${String(chapter.number).padStart(2, "0")}. ${chapter.title}`;
    // Capitalize first letter
    label = label.charAt(0).toUpperCase() + label.slice(1);
    return { label, href };
  })];

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-3">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  className="w-3 h-3 text-ink-4"
                  aria-hidden
                />
              )}
              {isLast ? (
                <span className="text-ink-2 font-medium">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-un-700 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
