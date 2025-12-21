import { Worker, Job} from "bullmq";
import redis from "../lib/redis";
import { sendMail } from "../lib/mailer";
import "dotenv/config";

export const emailWorker = new Worker("email-notification-queue", 
    async (job: Job) => {
        const { to, status, itineraryName, tripId } = job.data;

        await sendMail({
            to,
            status,
            itineraryName,
            tripId,
        });
    },
    {   connection: redis,
        limiter: {
            max: 3,
            duration: 10000,
        },
     }

);