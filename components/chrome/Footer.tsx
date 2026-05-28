import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-1 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {/* brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--un-blue) 0%, var(--un-blue-700) 100%)",
                }}
              >
                <Compass className="w-5 h-5 text-white" strokeWidth={2.2} />
              </span>
              <span className="font-display text-[18px] font-semibold tracking-tight text-ink-1">
                Evaluation{" "}
                <span className="italic" style={{ color: "var(--un-blue)" }}>
                  Academy
                </span>
              </span>
            </div>
            <p className="mt-4 text-[14px] text-ink-2 max-w-sm leading-relaxed">
              An immersive course on evaluation craft. Built on the{" "}
              <a
                href="https://www.unfpa.org/sites/default/files/admin-resource/Final_Eval%20Handbook%202024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-un-700 underline underline-offset-2 hover:text-un-800"
              >
                UNFPA Evaluation Handbook 2024
              </a>
              .
            </p>
          </div>

          {/* learn */}
          <FooterCol
            title="Learn"
            links={[
              { label: "Course dashboard", href: "/learn" },
              { label: "Preparation", href: "/learn/preparation" },
              { label: "Design", href: "/learn/design" },
              { label: "Fieldwork", href: "/learn/fieldwork" },
              { label: "Reporting", href: "/learn/reporting" },
              { label: "Dissemination", href: "/learn/dissemination" },
            ]}
          />

          {/* tools */}
          <FooterCol
            title="Tools"
            links={[
              { label: "ToC Builder", href: "/toc-builder" },
              { label: "Final exam", href: "/exam" },
              { label: "Certificate", href: "/certificate" },
            ]}
          />
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-[12px] text-ink-3">
          <span>
            © {new Date().getFullYear()} Evaluation Academy. Educational use of UNFPA handbook content.
          </span>
          <span>
            Source: UNFPA Evaluation Handbook 2024. Not affiliated with UNFPA.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[14px] text-ink-2 hover:text-un-700 transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
