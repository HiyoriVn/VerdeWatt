import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const baseUrl = process.env.VISUAL_AUDIT_BASE_URL || "http://localhost:5173";
const outputDir = path.resolve(process.cwd(), "audit-screenshots");

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "desktop", width: 1600, height: 900 },
];

const routes = [
  { label: "landing", route: "/" },
  { label: "portal", route: "/portal" },
  { label: "login", route: "/login" },
  { label: "dashboard", route: "/dashboard" },
  { label: "dashboard-analytics", route: "/dashboard/analytics" },
  { label: "dashboard-security", route: "/dashboard/security" },
];

const sessionPayload = {
  email: "admin@verdewatt.vn",
  buildingCode: "DEMO",
  role: "Building Manager",
};

async function captureRoute(page, label, route, viewportName, dashboardSession) {
  const targetUrl = new URL(route, baseUrl).toString();
  await page.goto(targetUrl, { waitUntil: "networkidle" });

  const currentPath = new URL(page.url()).pathname;
  if (
    route.startsWith("/dashboard") &&
    !dashboardSession.seeded &&
    currentPath.startsWith("/login")
  ) {
    await page.evaluate(
      ({ key, payload }) => {
        localStorage.setItem(key, JSON.stringify(payload));
      },
      { key: "verdewatt_staff_session", payload: sessionPayload }
    );
    dashboardSession.seeded = true;
    await page.goto(targetUrl, { waitUntil: "networkidle" });
  }

  const fileName = `${label}-${viewportName}.png`;
  const outputPath = path.join(outputDir, fileName);
  await page.screenshot({ path: outputPath, fullPage: true });
  return outputPath;
}

async function run() {
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const generated = [];

  try {
    for (const viewport of viewports) {
      const dashboardSession = { seeded: false };
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();
      for (const item of routes) {
        const filePath = await captureRoute(
          page,
          item.label,
          item.route,
          viewport.name,
          dashboardSession
        );
        generated.push(filePath);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`Base URL: ${baseUrl}`);
  console.log("Generated screenshots:");
  generated.forEach((filePath) => {
    console.log(`- ${path.relative(process.cwd(), filePath)}`);
  });
}

run().catch((error) => {
  console.error("Visual audit failed:");
  console.error(error);
  process.exitCode = 1;
});
