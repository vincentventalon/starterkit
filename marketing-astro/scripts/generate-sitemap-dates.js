#!/usr/bin/env node
/**
 * Generate sitemap dates from git history.
 *
 * Scans src/pages/**\/*.astro and writes lastmod ISO dates to
 * generated/sitemap-dates.json. The output is committed to git so that
 * shallow-clone CI builds get accurate dates without re-running git log.
 * astro.config.ts reads the JSON in its sitemap serialize() hook.
 *
 * Run: node scripts/generate-sitemap-dates.js
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";

const BASE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_FILE = path.join(BASE_DIR, "generated/sitemap-dates.json");

function getGitDate(filePath) {
  try {
    // --follow tracks files through renames (monorepo restructures).
    // --diff-filter=M only picks up actual content modifications, not moves.
    const result = execSync(
      `git log --follow --diff-filter=M -1 --format=%cI -- "${filePath}"`,
      { encoding: "utf-8", cwd: BASE_DIR, stdio: ["pipe", "pipe", "pipe"] }
    ).trim();
    if (result) {
      return new Date(result).toISOString();
    }
    // Fallback: file was only ever created/moved, use earliest commit.
    const fallback = execSync(
      `git log --follow --diff-filter=A -1 --format=%cI -- "${filePath}"`,
      { encoding: "utf-8", cwd: BASE_DIR, stdio: ["pipe", "pipe", "pipe"] }
    ).trim();
    return fallback ? new Date(fallback).toISOString() : null;
  } catch {
    return null;
  }
}

function pageToUrl(filePath) {
  let urlPath = filePath.replace(/^src\/pages\//, "").replace(/\.astro$/, "");

  // Skip dynamic routes and the 404 page.
  if (/^\[|\/\[|^404$/.test(urlPath)) {
    return null;
  }

  if (urlPath === "index") return "/";
  return "/" + urlPath.replace(/\/index$/, "");
}

function main() {
  console.log("Generating sitemap dates from git history...\n");

  const dates = {};
  let count = 0;

  const pages = fg.sync("src/pages/**/*.astro", { cwd: BASE_DIR });
  for (const filePath of pages) {
    const url = pageToUrl(filePath);
    if (url) {
      const date = getGitDate(filePath);
      if (date) {
        dates[url] = date;
        count++;
      }
    }
  }

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dates, null, 2) + "\n");

  console.log(`Generated ${count} URL dates`);
  console.log(`Output: ${OUTPUT_FILE}\n`);

  const sampleUrls = ["/", "/about", "/privacy-policy", "/tos"];
  console.log("Sample dates:");
  for (const url of sampleUrls) {
    console.log(`  ${url}: ${dates[url] || "not found"}`);
  }
}

main();
