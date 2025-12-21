import "./jobs/emailWorker.js";
import "./jobs/itineraryWorker.js";

console.log("workers: started");

process.on("SIGINT", () => {
  console.log("workers: shutting down");
  process.exit(0);
});
