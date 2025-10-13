#!/usr/bin/env node

import fs from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { launch } from "chrome-launcher";
import desktopConfig from "lighthouse/lighthouse-core/config/desktop-config.js";
import lighthouse from "lighthouse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_URL = process.env.LIGHTHOUSE_URL ?? "http://localhost:3000";
const DEFAULT_OUTPUT_DIR =
  process.env.LIGHTHOUSE_OUTPUT_DIR ?? resolve(__dirname, "..", "reports", "lighthouse");

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: DEFAULT_URL,
    outputDir: DEFAULT_OUTPUT_DIR,
  };

  for (const arg of args) {
    if (arg.startsWith("--url=")) {
      options.url = arg.slice("--url=".length);
    } else if (arg.startsWith("--out=")) {
      options.outputDir = resolve(process.cwd(), arg.slice("--out=".length));
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(
    `
Usage: npm run lighthouse [-- --url=http://localhost:3000 --out=./reports/lighthouse]

Options:
  --url=<url>       Target URL to audit (defaults to ${DEFAULT_URL})
  --out=<dir>       Output directory for Lighthouse reports (defaults to ${DEFAULT_OUTPUT_DIR})

Environment variables:
  LIGHTHOUSE_URL         Overrides the default URL.
  LIGHTHOUSE_OUTPUT_DIR  Overrides the default output directory.
`.trim(),
  );
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function runAudit({ url, formFactor, config, name, outputDir }) {
  const chrome = await launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
  });

  const options = {
    logLevel: "info",
    output: ["html", "json"],
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    port: chrome.port,
    formFactor,
    screenEmulation:
      formFactor === "desktop"
        ? {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
          }
        : {
            mobile: true,
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            disabled: false,
          },
  };

  try {
    const runnerResult = await lighthouse(url, options, config);
    const reports = Array.isArray(runnerResult.report)
      ? runnerResult.report
      : [runnerResult.report];

    const [htmlReport, jsonReport] = reports;
    const baseName = `${name}-${timestamp()}`;
    const htmlPath = resolve(outputDir, `${baseName}.html`);
    const jsonPath = resolve(outputDir, `${baseName}.json`);

    await fs.writeFile(htmlPath, htmlReport, "utf8");

    if (typeof jsonReport === "string") {
      await fs.writeFile(jsonPath, jsonReport, "utf8");
    } else {
      await fs.writeFile(jsonPath, JSON.stringify(runnerResult.lhr, null, 2), "utf8");
    }

    console.log(
      `✅ Lighthouse ${name} report generated:\n  HTML: ${htmlPath}\n  JSON: ${jsonPath}`,
    );
  } finally {
    await chrome.kill();
  }
}

async function main() {
  const { url, outputDir } = parseArgs();
  await mkdir(outputDir, { recursive: true });

  console.log(`Running Lighthouse audits for ${url}`);

  await runAudit({
    url,
    name: "mobile",
    formFactor: "mobile",
    config: undefined,
    outputDir,
  });

  await runAudit({
    url,
    name: "desktop",
    formFactor: "desktop",
    config: desktopConfig,
    outputDir,
  });
}

main().catch((error) => {
  console.error("Lighthouse audit failed:", error);
  process.exitCode = 1;
});
