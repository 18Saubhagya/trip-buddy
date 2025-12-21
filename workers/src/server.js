import express from "express";
import "dotenv/config";

export function startServer() {
  const app = express();

  app.get("/", (_req, res) => {
    res.json({ status: "ok", service: "workers" });
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "healthy" });
  });

  const port = process.env.WORKERS_PORT ? Number(process.env.WORKERS_PORT) : 4001;
  const server = app.listen(port, () => {
    console.log(`workers: HTTP server listening on http://localhost:${port}`);
  });

  // Return server to allow graceful shutdown in index.js
  return server;
}

export default startServer;
