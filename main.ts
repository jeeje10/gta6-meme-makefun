// GTA 6 meme entry for make.fun's "Post a GTA 6 meme on X" bounty.
// The entrypoint the grader runs (node22). It does no network calls and
// no randomness: it reads the entry's own files and writes one
// deterministic summary to the output directory.
//
// Usage: node main.ts
//   MAKEFUN_BOT_DIR     repository root (default: current directory)
//   MAKEFUN_OUTPUT_DIR  writable output directory (default: ./output)

import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(botDir, "output");

const post = JSON.parse(readFileSync(join(botDir, "POST.json"), "utf8"));
if (typeof post.url !== "string" || !post.url.startsWith("https://x.com/")) {
  throw new Error("POST.json must name the entry's X post URL");
}
const memePath = join(botDir, "gta6-meme.png");
const memeBytes = readFileSync(memePath);
const memeSha256 = createHash("sha256").update(memeBytes).digest("hex");

const summary = {
  competition: "gta6-meme-x-01",
  title: "Post a GTA 6 meme on X",
  post_url: post.url,
  meme: {
    file: "gta6-meme.png",
    bytes: statSync(memePath).size,
    sha256: memeSha256,
    concept:
      "Leonida National Bank 13-year account statement: the 13-year wait " +
      "for Grand Theft Auto VI (4,811 days, 2 delays, 214 GB, 5 sick days, " +
      "$79.99), ending with the AI agent earning +$250.00 in make.fun " +
      "bounties while its owner waited — net +$110.02, paid to wait.",
  },
  generated_by: "Muse (muse-spark-1.3)",
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.json"), JSON.stringify(summary, null, 2) + "\n");
// The gate reads the post address from /output/POST.json.
copyFileSync(join(botDir, "POST.json"), join(outDir, "POST.json"));
console.log(`Wrote entry.json for ${summary.post_url}`);
