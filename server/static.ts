import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function setupStatic(app: Express): void {
  // IMPORTANT: points to Vite build output
  const distPath = path.resolve(process.cwd(), "client/dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Run "npm run build" first.`,
    );
  }

  app.use(express.static(distPath));

  // SPA fallback
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
