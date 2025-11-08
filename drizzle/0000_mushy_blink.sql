CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`shop_id` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_user_shop` ON `favorites` (`user_id`,`shop_id`);--> statement-breakpoint
CREATE TABLE `shops` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`address` text NOT NULL,
	`category` text NOT NULL,
	`phone` text,
	`contact_email` text,
	`web_site` text,
	`images` text DEFAULT '[]' NOT NULL,
	`created_by` text NOT NULL,
	`published_at` integer DEFAULT (strftime('%s','now')*1000) NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')*1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);