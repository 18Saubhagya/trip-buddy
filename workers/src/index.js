import "./jobs/emailWorker.js";
import "./jobs/itineraryWorker.js";
import { startServer } from "./server.js";

console.log("workers: started");

// Start lightweight HTTP server (status / health endpoint)
const server = startServer();

process.on("SIGINT", async () => {
  console.log("workers: shutting down");
  if (server && server.close) {
    try { await new Promise((res) => server.close(res)); } catch (e) {}
  }
  process.exit(0);
});
