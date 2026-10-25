CREATE TABLE `site_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer NOT NULL,
	`value` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `site_revisions_version_idx` ON `site_revisions` (`version`);