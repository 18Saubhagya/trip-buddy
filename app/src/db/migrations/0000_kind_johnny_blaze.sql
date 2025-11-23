CREATE TYPE "public"."generate_status_enum" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."trip_status_enum" AS ENUM('new', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "itineraries" (
	"id" serial PRIMARY KEY NOT NULL,
	"cities" text[] NOT NULL,
	"interests" text NOT NULL,
	"max_budget" integer NOT NULL,
	"min_budget" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'Rupees' NOT NULL,
	"generated_plan" jsonb NOT NULL,
	"generate_status" "generate_status_enum" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"itinerary_id" integer NOT NULL,
	"trip_name" text NOT NULL,
	"country" varchar(100),
	"state" varchar(100),
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "trip_status_enum" DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true,
	"verify_token" text,
	"verify_token_expiry" timestamp,
	"reset_password_token" text,
	"reset_password_token_expiry" timestamp,
	"is_verified" boolean DEFAULT false,
	"last_login_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_itinerary_id_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "itineraries_generate_status_idx" ON "itineraries" USING btree ("generate_status");--> statement-breakpoint
CREATE INDEX "itineraries_max_budget_idx" ON "itineraries" USING btree ("min_budget","max_budget");--> statement-breakpoint
CREATE INDEX "trips_user_id_idx" ON "trips" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trips_status_idx" ON "trips" USING btree ("status");--> statement-breakpoint
CREATE INDEX "trips_start_date_idx" ON "trips" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "users_is_verified_idx" ON "users" USING btree ("is_verified");