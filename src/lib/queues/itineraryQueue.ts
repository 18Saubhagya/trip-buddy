import { Queue } from "bullmq";
import redis from "../redis";

export const itineraryQueue = new Queue("itinerary-generation-queue", {
    connection: redis,
    defaultJobOptions: {
        removeOnComplete: true,
        attempts: 1,
    },
})
