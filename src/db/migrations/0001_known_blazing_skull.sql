-- Create enum for generation status
CREATE TYPE "public"."itinerary_generation_status_enum" 
    AS ENUM ('pending', 'running', 'completed', 'failed');
--> statement-breakpoint

-- Create itinerary_generations table
CREATE TABLE "itinerary_generations" (
    "id" serial PRIMARY KEY NOT NULL,
    "itinerary_id" integer NOT NULL,
    "status" "itinerary_generation_status_enum" DEFAULT 'pending' NOT NULL,
    "started_at" timestamp DEFAULT now() NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "completed_at" timestamp,
    "attempt_number" integer DEFAULT 1 NOT NULL,
    "generated_plan" jsonb,
    "error_message" text,
    "generated_meta" jsonb,
    "generation_key" text NOT NULL
);
--> statement-breakpoint

-- Alter itineraries: allow generated_plan to be NULL
ALTER TABLE "itineraries" 
    ALTER COLUMN "generated_plan" DROP NOT NULL;
--> statement-breakpoint

-- Add generation_attempts column
ALTER TABLE "itineraries" 
    ADD COLUMN "generation_attempts" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint

-- Add generation_completed_at column
ALTER TABLE "itineraries" 
    ADD COLUMN "generation_completed_at" timestamp;
--> statement-breakpoint

-- Add generation_meta column
ALTER TABLE "itineraries" 
    ADD COLUMN "generation_meta" jsonb;
--> statement-breakpoint

UPDATE "itineraries" SET "generation_attempts" = 0 WHERE "generation_attempts" IS NULL;
--> statement-breakpoint

-- Add FK constraint
ALTER TABLE "itinerary_generations" 
    ADD CONSTRAINT "itinerary_generations_itinerary_id_itineraries_id_fk"
    FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id")
    ON DELETE CASCADE ON UPDATE NO ACTION;
--> statement-breakpoint

-- Add indexes
CREATE INDEX "itinerary_generations_itinerary_id_idx" 
    ON "itinerary_generations" USING btree ("itinerary_id");
--> statement-breakpoint

CREATE INDEX "itinerary_generations_status_idx" 
    ON "itinerary_generations" USING btree ("status");
