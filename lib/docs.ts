import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";
import type { Root, Heading as MarkdownHeading } from "mdast";
import type { Plugin } from "unified";

export type DocMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  updated: string;
  order: number;
};

export type Heading = { id: string; text: string; level: number };

const docsDirectory = path.join(process.cwd(), "content", "docs");

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-");
}

const headingAnchors: Plugin<[], Root> = () => {
  return (tree) => {
    for (const node of tree.children) {
      if (node.type !== "heading") continue;
      const heading = node as MarkdownHeading;
      const text = heading.children.map((child) => ("value" in child ? String(child.value) : "")).join("");
      heading.data = { ...(heading.data || {}), hProperties: { id: toSlug(text) } };
    }
  };
};

export function getAllDocs(): DocMeta[] {
  return fs
    .readdirSync(docsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data } = matter(fs.readFileSync(path.join(docsDirectory, file), "utf8"));
      return { slug, ...data } as DocMeta;
    })
    .sort((a, b) => a.order - b.order);
}

export async function getDoc(slugValue: string) {
  const filePath = path.join(docsDirectory, `${slugValue}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  const processed = await remark().use(gfm).use(headingAnchors).use(html, { sanitize: false }).process(content);
  const headings: Heading[] = [];
  const matches = content.matchAll(/^(#{2,3})\s+(.+)$/gm);

  for (const match of matches) {
    const text = match[2].replace(/[`*_]/g, "");
    const id = toSlug(text);
    headings.push({ id, text, level: match[1].length });
  }

  return {
    meta: { slug: slugValue, ...data } as DocMeta,
    contentHtml: processed.toString(),
    headings,
  };
}
