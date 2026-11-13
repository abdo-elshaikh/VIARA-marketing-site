# Cloudflare D1 Database Layer

## Overview
Cloudflare D1 database access layer for the VIARA marketing platform using Drizzle ORM (SQLite dialect). Exports the typed database client factory (`getDb`) binding to Cloudflare Workers runtime `env.DB` and defines typed schemas for inquiries, site settings, content revisions, and customer reviews.

## Interface
- `[index.ts:getDb]` - Database client factory wrapping `env.DB` with Drizzle ORM
- `[schema.ts:inquiries]` - Customer inquiries and consultation requests table
- `[schema.ts:siteSettings]` - Key-value store for published CMS content and site configuration
- `[schema.ts:siteRevisions]` - Historical content revisions archive with optimistic version indexing
- `[schema.ts:reviews]` - Moderated client reviews with approval status and consent flags

## Invariants
- `[index.ts:getDb]` `env.DB` must be present; throws Error if `!env.DB`
- `[schema.ts:inquiries]` `id` is primary key; `userId`, `name`, `email`, `phone`, `organization`, `facility`, `branches`, `interest`, `plan`, `message`, `status` (default 'new'), `locale` (default 'ar'), `offer` (default ''), `createdAt` are notNull; indexed on `(userId, createdAt)`
- `[schema.ts:siteSettings]` `key` is primary key; `value`, `version` (default 1), `updatedBy`, `updatedAt` are notNull
- `[schema.ts:siteRevisions]` `id` is primary key; `version`, `value`, `updatedBy`, `createdAt` are notNull; indexed on `version`
- `[schema.ts:reviews]` `id` is primary key; `userId`, `name`, `role`, `organization`, `quote`, `rating`, `locale` (default 'ar'), `status` (default 'pending'), `consent` (default 1), `createdAt` are notNull; `systemId` is nullable; indexed on `(status, createdAt)`

## Side Effects
- None

## Verification
- Run: `npm test`
