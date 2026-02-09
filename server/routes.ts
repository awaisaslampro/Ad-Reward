import type { Express } from "express";

export function registerRoutes(app: Express): void {
  // Example API route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // add more routes here
}
