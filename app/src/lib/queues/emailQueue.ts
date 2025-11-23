import {Queue} from "bullmq";
import redis from "../redis";
import "dotenv/config";

export const emailQueue = new Queue("email-notification-queue", {
    connection: redis,
    defaultJobOptions: {
        removeOnComplete: true,
        attempts: 1,
    },
});