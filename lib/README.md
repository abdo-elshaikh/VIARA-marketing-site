# Core Domain Logic & Infrastructure Library

## Overview
Core domain logic, validation schemas, and data-access layer for the VIARA bilingual marketing platform. Comprises Zod validation schemas for site content, company profiles, revisions, and consultation inquiries; Cloudflare D1/R2 integration and in-isolate caching for content and reviews; HMAC authentication and rate-limiting safeguards for admin sessions and guest request identities; and clinical catalog and media capture definitions for 24 healthcare systems.

## Interface
- `[access.ts:matchesAdmin]` - Case-insensitive trimmed administrator email verification
- `[admin-auth.ts:getAdmin]` - Authenticates session token from cookie against configured admin secret
- `[admin-auth.ts:verifyAdminSession]` - Constant-time HMAC-SHA256 session signature and age verification
- `[admin-auth.ts:sameOrigin]` - CSRF guard validating Origin and Referer headers against request origin
- `[company-content.ts:companySchema]` - Validation schema for bilingual company profile and governance
- `[guest-identity.ts:signGuestId]` - Issues signed guest identity cookies with base64url HMAC-SHA256
- `[guest-identity.ts:verifyGuestId]` - Verifies signed guest identity cookie with constant-time equality
- `[healthcare-catalog.mjs:healthcareSystems]` - Definitions for 24 clinical, operational, and diagnostic systems
- `[healthcare-catalog.mjs:facilityProfiles]` - Healthcare facility profiles and system bundles
- `[home-hero-visuals.ts:heroVisuals]` - Medical imaging scene definitions and diagnostic chassis configuration
- `[inquiry.ts:inquirySchema]` - Validation schema for demo consultation requests with phone normalization
- `[inquiry.ts:estimateArchive]` - Storage capacity and bandwidth calculation engine for DICOM modalities
- `[marketing-analytics.ts:trackMarketingEvent]` - Beacon dispatcher for whitelisted marketing conversion events
- `[publish-content.ts:publishContentSchema]` - Comprehensive validation schema for CMS content publishing
- `[site-content.ts:siteContentSchema]` - Structural schema for packages, metrics, FAQs, and offers
- `[site-content.ts:isOfferActive]` - Validates offer activation and Cairo timezone calendar date expiry
- `[site-revisions.ts:restoreRevision]` - Restores archived content revision with optimistic concurrency checks
- `[site-server.ts:readPublicContent]` - In-isolate cached reader for published site settings (30s TTL)
- `[site-server.ts:readPublishedReviews]` - Retrieves approved customer reviews for public display
- `[system-captures.ts:getSystemCaptures]` - Authentic diagnostic software captures with locale resolution

## Invariants
- `[admin-auth.ts:getAdminSecret]` Throws AdminSecretNotConfiguredError if VIARA_ADMIN_PASSWORD or VIARA_ADMIN_KEY is unset or under 8 chars
- `[admin-auth.ts:verifyAdminSession]` Rejects sessions older than 7 days (SESSION_MAX_AGE_MS = 604,800,000 ms); validates SHA-256 HMAC signature using constant-time timingSafeEqualHex
- `[admin-auth.ts:sameOrigin]` Fails closed by verifying Origin or Referer matches request.url origin; returns false if neither header is present or origins mismatch
- `[guest-identity.ts:verifyGuestId]` Requires valid HMAC-SHA256 signature verified via constant-time comparison; rejects unsigned cookies in production
- `[inquiry.ts:requestedSystemsSchema]` Enforces max 6 unique systems, all matching known IDs in healthcareSystems
- `[inquiry.ts:scopeEstimateSchema]` Enforces 1-5 unique modalities ('MR', 'CT', 'DX', 'US', 'MG'), dailyScans 1-10000, branches 1-100, operatingDays 1-366, averageMiB 1-10000, retentionYears 1-20, backupCopies 0-5
- `[site-content.ts:cairoDay]` Returns ISO YYYY-MM-DD date formatted strictly in Africa/Cairo timezone
- `[site-revisions.ts:MAX_REVISIONS]` Revisions history is bounded to 20 entries; older revisions are pruned automatically
- `[site-revisions.ts:restoreRevision]` Parses revision JSON with publishContentSchema; performs optimistic concurrency check on siteSettings.version; archives current live content before updating
- `[site-url.ts:isSecureUrl]` Rejects URLs containing control characters or whitespace, URLs with non-https protocol, missing hostnames, or embedded credentials

## Side Effects
- `[admin-auth.ts:getAdmin]` Reads HTTP request cookies via cookies() from next/headers
- `[guest-identity.ts:readGuestId]` Reads HTTP request cookies via cookies() from next/headers
- `[marketing-analytics.ts:trackMarketingEvent]` Dispatches HTTP POST fetch beacon with keepalive: true to analytics endpoint
- `[site-revisions.ts:archiveRevision]` Executes INSERT into siteRevisions and DELETE of stale rows in Cloudflare D1 database
- `[site-server.ts:invalidatePublicContent]` Mutates in-memory isolate variable contentCache to null
- `[site-server.ts:readPublicContent]` Mutates in-memory isolate variable contentCache and executes SELECT query against Cloudflare D1 database

## Verification
- Run: `npm test`
