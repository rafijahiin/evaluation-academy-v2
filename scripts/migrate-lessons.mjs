#!/usr/bin/env node
/**
 * Migrate v1 lessons (window.MODULES in content.js) into MDX files
 * under content/lessons/<chapter-slug>/<NN>-<lesson-slug>.mdx
 *
 * Run: node scripts/migrate-lessons.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const V1_CONTENT_PATH = "C:/Users/HP/.claude/projects/evaluation-academy/content.js";

// chapter number → slug (matches content/chapters.ts)
const CHAPTER_SLUGS = {
  1: "preparation",
  2: "design",
  3: "fieldwork",
  4: "reporting",
  5: "dissemination",
};

// ----------------------------------------------------------------------
// Load v1 content
// ----------------------------------------------------------------------
async function loadModules() {
  const raw = await fs.readFile(V1_CONTENT_PATH, "utf-8");
  // The file contains window.MODULES, window.STAGE_QUIZ, etc.
  // Extract just MODULES — non-greedy match from `[` to the closing `];`
  // on its own line.
  const match = raw.match(/window\.MODULES\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!match) throw new Error("Could not locate window.MODULES array");
  return new Function(`return (${match[1]});`)();
}

// ----------------------------------------------------------------------
// Slugify helper
// ----------------------------------------------------------------------
function slugify(s) {
  return s
    .toLowerCase()
    .replace(/^\d+\.\d+\s*/, "") // strip "1.1 " prefix
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

// ----------------------------------------------------------------------
// HTML → MDX transformations
// ----------------------------------------------------------------------
function escapeJsxText(s) {
  // MDX is permissive but { and } need escaping in text
  return s.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
}

function transformBody(html) {
  let s = html;

  // Normalise CR and strip per-line leading whitespace (HTML doesn't care
  // and MDX is cleaner without it)
  s = s.replace(/\r/g, "");
  s = s.replace(/^[ \t]+/gm, "");

  // ---- kvgrid: wraps one or more <div class="kv"> ----
  // Capture the inner sequence of kv items + the kvgrid closing </div>
  s = s.replace(
    /<div\s+class="kvgrid">\s*((?:<div\s+class="kv">\s*<b>[\s\S]*?<\/b>\s*<span>[\s\S]*?<\/span>\s*<\/div>\s*)+)<\/div>/g,
    (_full, items) => {
      const transformed = items.replace(
        /<div\s+class="kv">\s*<b>([\s\S]*?)<\/b>\s*<span>([\s\S]*?)<\/span>\s*<\/div>/g,
        (_m, title, body) =>
          `  <KV title=${JSON.stringify(stripTags(title).trim())}>${body.trim()}</KV>\n`,
      );
      return `\n<KVGrid>\n${transformed}</KVGrid>\n`;
    },
  );

  // ---- callout key|tip|warn ----
  s = s.replace(
    /<div\s+class="callout\s+(key|tip|warn)">\s*<span\s+class="ic">[^<]*<\/span>\s*<div\s+class="body">\s*<strong>([\s\S]*?)<\/strong>([\s\S]*?)<\/div>\s*<\/div>/g,
    (_m, variant, title, body) => {
      const cleanTitle = stripTags(title).trim();
      return `\n<Callout variant="${variant}" title=${JSON.stringify(cleanTitle)}>\n${body.trim()}\n</Callout>\n`;
    },
  );

  // ---- decode common HTML entities (MDX is fine with literal characters) ----
  s = s
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’");

  // Collapse runs of blank lines
  s = s.replace(/\n{3,}/g, "\n\n");

  return s.trim();
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "");
}

// ----------------------------------------------------------------------
// Build frontmatter + MDX
// ----------------------------------------------------------------------
function lessonToMdx(lesson, idx, totalInChapter, estChapterMinutes) {
  // strip "1.1 " prefix from title for the heading
  const rawTitle = lesson.title;
  const titleNoNumber = rawTitle.replace(/^\d+\.\d+\s*/, "");
  const estimatedMinutes = Math.max(4, Math.round(estChapterMinutes / totalInChapter));

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(titleNoNumber)}`,
    `order: ${idx + 1}`,
    `originalTitle: ${JSON.stringify(rawTitle)}`,
    `lede: ${JSON.stringify(lesson.lede || "")}`,
    `estimatedMinutes: ${estimatedMinutes}`,
    "---",
  ].join("\n");

  const transformed = transformBody(lesson.body || "");

  return `${frontmatter}\n\n${transformed}\n`;
}

// ----------------------------------------------------------------------
// Run
// ----------------------------------------------------------------------
async function main() {
  console.log("Loading v1 content from", V1_CONTENT_PATH);
  const modules = await loadModules();
  console.log(`Found ${modules.length} chapters`);

  let totalWritten = 0;
  for (const chapter of modules) {
    const slug = CHAPTER_SLUGS[chapter.number];
    if (!slug) {
      console.warn(`Unknown chapter number ${chapter.number}, skipping`);
      continue;
    }
    const chapterDir = path.join(ROOT, "content", "lessons", slug);
    await fs.mkdir(chapterDir, { recursive: true });

    const lessons = chapter.lessons || [];
    console.log(`\n[Chapter ${chapter.number}: ${chapter.title}] ${lessons.length} lessons`);

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const lessonSlug = slugify(lesson.title);
      const num = String(i + 1).padStart(2, "0");
      const filename = `${num}-${lessonSlug}.mdx`;
      const filepath = path.join(chapterDir, filename);
      const mdx = lessonToMdx(lesson, i, lessons.length, chapter.estMinutes || 60);
      await fs.writeFile(filepath, mdx, "utf-8");
      console.log(`  → ${slug}/${filename}`);
      totalWritten++;
    }
  }

  console.log(`\n✓ Wrote ${totalWritten} lessons.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
