import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";
import { setupStatic } from "../server/static";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// register API routes
registerRoutes(app);

// serve frontend (after routes)
setupStatic(app);

export { app, server };
