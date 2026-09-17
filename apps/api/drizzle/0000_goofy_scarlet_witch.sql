CREATE TYPE "public"."ingredient_type" AS ENUM('base', 'syrup', 'topping');--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "ingredient_type" NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sizes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sizes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ingredients_type_name_unique" ON "ingredients" USING btree ("type","name");