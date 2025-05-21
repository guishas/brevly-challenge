CREATE TABLE "uploads" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"remote_key" text NOT NULL,
	"remote_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uploads_remote_key_unique" UNIQUE("remote_key")
);
--> statement-breakpoint
CREATE TABLE "urls" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"shortened_url" text NOT NULL,
	"visits" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
