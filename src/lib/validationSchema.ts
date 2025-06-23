
import {z} from "zod";

export const stepCitiesSchema = z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    cities: z.array(z.string()).min(1, "At least one city is required"),
});

export const stepDatesSchema = z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
});

export const stepInterestsSchema = z.object({
    interests: z.array(z.string()),
});

export const stepBudgetSchema = z.object({
    minBudget: z.coerce.number().min(0, "Min Budget must be a positive number"),
    maxBudget: z.coerce.number().min(0, "Max Budget must be a positive number"),
}).refine(data => data.maxBudget > data.minBudget, {
    message: "Max Budget must be greater than Min Budget",
    path: ["maxBudget"],
});