# API Routing Subsystem

## Overview
Next.js App Router API subsystem powering public conversion actions, guest request tracking, media streaming, and protected administrative CMS management on Cloudflare Workers edge runtime.

## Subdirectories & Boundaries
- [admin](./admin/README.md) - Protected administrative endpoints for content publishing, revisions, inquiry triage, review moderation, and R2 media upload
- [analytics](./analytics/README.md) - Conversion event ingestion endpoint
- [inquiries](./inquiries/README.md) - Public consultation request submission and deletion endpoints
- [media](./media/README.md) - Cloudflare R2 media asset streaming endpoints
- [reviews](./reviews/README.md) - Public customer testimonial and review submission endpoint
