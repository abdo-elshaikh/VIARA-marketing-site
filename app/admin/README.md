# Administration Portal Route

## Overview
Administrative workspace providing authentication, live CMS content editing with real-time preview, company profile management, consultation inquiry inbox, customer review moderation, and historical content revision restore.

## Interface
- `[page.tsx:AdminPage]` - Server page enforcing admin authentication and rendering management interface
- `[page.tsx:metadata]` - Administration portal title and viewport configuration
- `[admin-client.tsx:AdminClient]` - Interactive client shell managing active tabs, dirty state, and drafts
- `[admin-login-form.tsx:AdminLoginForm]` - Secure credentials form with lockout and error handling
- `[company-editor.tsx:CompanyEditor]` - Bilingual editor for leadership, principles, milestones, and credentials
- `[copy-editor.tsx:CopyEditor]` - Visual editor for hero copy, pricing tiers, FAQs, and special offers
- `[settings-preview.tsx:SettingsSummary]` - Live layout previews for brand colors, social links, and SEO

## Invariants
- `[page.tsx:AdminPage]` Enforces authentication via `getAdmin()`; unauthenticated sessions strictly render `AdminLoginForm` without exposing CMS tools or data
- `[admin-client.tsx:beforeunload]` Prompts confirmation warning if unsaved content modifications exist
- `[company-editor.tsx:CompanyEditor]` Additions are disabled when collection limits are reached (12 principles, 30 team/milestones, 20 offices/credentials)

## Side Effects
- `[admin-login-form.tsx:handleLogin]` Dispatches POST to `/api/admin/login` and triggers page reload
- `[admin-client.tsx:save]` Dispatches PUT to `/api/admin/content` and writes draft backups to localStorage/sessionStorage

## Verification
- Run: `npm test`
