# VIARA Marketing Site - Deployment Guide

## Overview

This guide covers deploying the VIARA marketing site to Cloudflare Pages with D1 database and R2 storage.

## Prerequisites

- Node.js 22.13.0 or higher
- pnpm 11.25.0 (installed via `npm run install:ci`)
- Cloudflare account with Pages, D1, and R2 access
- Wrangler CLI installed globally or via project dependencies
- Git repository access

## Environment Setup

### 1. Install Dependencies

```bash
cd marketing-site
npm run install:ci  # Installs pnpm if needed
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local` for local development:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:5173
VIARA_ADMIN_EMAIL=your-admin@email.com
VIARA_ADMIN_PASSWORD=your-secure-password
SALES_WEBHOOK_URL=https://your-approved-sales-webhook.example/events
ANALYTICS_WEBHOOK_URL=https://your-approved-analytics-collector.example/events
```

**Production secrets are set via Wrangler CLI (see Production Deployment section).**

### 3. Create Cloudflare Resources

#### D1 Database

```bash
# Create production database
wrangler d1 create viara-marketing-db

# Note the database_id from output, update wrangler.json
```

#### R2 Bucket

```bash
# Create production bucket
wrangler r2 bucket create viara-marketing-assets

# Bucket name should match binding in wrangler.json
```

### 4. Run Database Migrations

```bash
# Apply migrations to production database
wrangler d1 migrations apply viara-marketing-db --remote
```

## Local Development

### Start Development Server

```bash
npm run dev
```

Site runs at `http://localhost:5173`

### Run Tests

```bash
# TypeScript check
npm run typecheck

# Unit tests
npm test

# All checks
npm run typecheck && npm test
```

### Local Database

Development uses `.wrangler/state` for local D1 database:

```bash
# Apply migrations locally
wrangler d1 migrations apply viara-marketing-db --local

# Execute SQL locally
wrangler d1 execute viara-marketing-db --local --command="SELECT * FROM site_content"
```

## Production Deployment

### Option 1: Cloudflare Pages (Recommended)

#### Initial Setup

1. **Create Pages Project**

```bash
# Via Wrangler
wrangler pages project create viara-marketing

# Or via Cloudflare Dashboard:
# Pages > Create a project > Connect to Git
```

2. **Configure Build Settings**

- **Build command**: `npm run build`
- **Build output directory**: `dist/client`
- **Root directory**: `/marketing-site`
- **Environment variables**: Set in Pages dashboard

3. **Set Production Secrets**

```bash
# Via Wrangler
wrangler pages secret put VIARA_ADMIN_EMAIL --project-name=viara-marketing
wrangler pages secret put VIARA_ADMIN_PASSWORD --project-name=viara-marketing

# Via Dashboard:
# Pages > viara-marketing > Settings > Environment variables
```

4. **Bind D1 and R2**

```bash
# Update wrangler.json with your database and bucket IDs
# Then bind via Dashboard:
# Pages > viara-marketing > Settings > Functions
# Add D1 binding: DB -> your-database-id
# Add R2 binding: BUCKET -> your-bucket-name
```

#### Deploy

```bash
# Build and deploy
npm run build
wrangler pages deploy dist/client --project-name=viara-marketing

# Or connect to Git for automatic deployments
# Every push to main branch triggers deployment
```

### Option 2: Wrangler Dev (Testing)

```bash
# Build first
npm run build

# Start production-like server
npm start

# Runs at http://127.0.0.1:8787
```

### Option 3: Manual Deployment

```bash
# 1. Build the site
npm run build

# 2. Deploy to Cloudflare Pages
cd dist/client
wrangler pages deploy . --project-name=viara-marketing

# 3. Verify deployment
curl https://your-site.pages.dev
```

## Post-Deployment Verification

### 1. Smoke Tests

```bash
# Homepage loads
curl -I https://your-site.pages.dev

# Sitemap accessible
curl https://your-site.pages.dev/sitemap.xml

# Robots.txt accessible
curl https://your-site.pages.dev/robots.txt

# API health (should return 401 without auth)
curl https://your-site.pages.dev/api/admin/content
```

### 2. Admin Panel Access

1. Navigate to `https://your-site.pages.dev/admin`
2. Login with configured credentials
3. Verify content editing works
4. Test publishing changes
5. Verify changes appear on public site

### 3. Form Submission

1. Navigate to homepage
2. Fill contact form
3. Submit request
4. Verify success message
5. Check request appears in admin inbox
6. Check request appears in "My Requests"

### 4. Responsive Design

Test on:
- Mobile (360px, 390px)
- Tablet (768px)
- Desktop (1024px, 1440px)

### 5. Performance Metrics

Use Chrome DevTools Lighthouse:
- Performance score > 90
- Accessibility score > 90
- Best Practices score > 90
- SEO score > 90

Check Core Web Vitals:
- LCP < 2.5s
- FID/INP < 200ms
- CLS < 0.1

## Domain Configuration

### Custom Domain Setup

1. **Add Domain in Cloudflare Pages**

```bash
# Via CLI
wrangler pages domain add your-domain.com --project-name=viara-marketing

# Or via Dashboard:
# Pages > viara-marketing > Custom domains > Set up a custom domain
```

2. **DNS Configuration**

Add CNAME record:
```
your-domain.com CNAME viara-marketing.pages.dev
```

Or for apex domain, use Cloudflare DNS:
```
your-domain.com CNAME viara-marketing.pages.dev (with proxy enabled)
```

3. **Update Environment Variable**

```bash
wrangler pages secret put NEXT_PUBLIC_SITE_URL --project-name=viara-marketing
# Enter: https://your-domain.com
```

4. **Verify SSL Certificate**

Cloudflare provides automatic SSL. Verify:
```bash
curl -I https://your-domain.com
# Look for "strict-transport-security" header
```

## Monitoring & Maintenance

### View Logs

```bash
# Tail production logs
wrangler pages deployment tail --project-name=viara-marketing

# View specific deployment logs via Dashboard:
# Pages > viara-marketing > Deployments > [deployment] > Logs
```

### Database Management

```bash
# View tables
wrangler d1 execute viara-marketing-db --remote --command="SELECT name FROM sqlite_master WHERE type='table'"

# Export data
wrangler d1 export viara-marketing-db --remote --output=backup.sql

# Import data
wrangler d1 execute viara-marketing-db --remote --file=backup.sql
```

### Content Backup

The site stores up to 20 content versions in `site_revisions` table. To export:

```bash
wrangler d1 execute viara-marketing-db --remote \
  --command="SELECT * FROM site_revisions ORDER BY created_at DESC LIMIT 20" \
  --json > content-backup.json
```

### Rollback Deployment

```bash
# List deployments
wrangler pages deployment list --project-name=viara-marketing

# Rollback to specific deployment (via Dashboard only)
# Pages > viara-marketing > Deployments > [deployment] > Rollback
```

## Troubleshooting

### Build Failures

**Error: EBUSY resource locked**
```bash
# Close all dev servers and Node processes
taskkill /F /IM node.exe  # Windows
# Or killall node  # Linux/Mac

# Clean and rebuild
rm -rf dist .next node_modules/.cache
npm run build
```

**TypeScript Errors**
```bash
npm run typecheck
# Fix errors before deploying
```

### Database Issues

**Migrations not applied**
```bash
# Check migration status
wrangler d1 migrations list viara-marketing-db --remote

# Apply pending migrations
wrangler d1 migrations apply viara-marketing-db --remote
```

**Connection errors**
- Verify D1 binding name matches wrangler.json
- Check database ID is correct
- Ensure migrations applied successfully

### Admin Access Issues

**503 Service Unavailable**
- Admin credentials not configured
- Set `VIARA_ADMIN_EMAIL` and `VIARA_ADMIN_PASSWORD`

**429 Rate Limited**
- Too many failed login attempts
- Wait 15 minutes or clear rate limit cache

**Session expired**
- Sessions expire after 7 days
- Login again with valid credentials

### Performance Issues

**Slow page loads**
- Check image optimization (see image-inventory.json)
- Verify CDN cache working
- Review Core Web Vitals in production

**High database latency**
- Check query performance
- Consider indexing frequently queried columns
- Review N+1 query patterns

## Staging Environment

Recommended setup: create separate staging project

```bash
# Create staging database
wrangler d1 create viara-marketing-db-staging

# Create staging bucket
wrangler r2 bucket create viara-marketing-assets-staging

# Create staging Pages project
wrangler pages project create viara-marketing-staging

# Deploy to staging
npm run build
wrangler pages deploy dist/client --project-name=viara-marketing-staging
```

Use separate wrangler.json or environment-specific bindings.

## Security Considerations

### Secrets Management

- Never commit `.env` or `.env.local` to Git
- Use Cloudflare secrets for production credentials
- Rotate admin passwords regularly
- Use strong passwords (16+ characters)

### Rate Limiting

Built-in rate limits:
- Admin login: 5 attempts per 15 minutes per email/IP
- Form submissions: Configurable via application logic

### Headers

Security headers automatically applied:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HTTPS only)

### Database Security

- No direct database access from client
- All queries server-side only
- Admin authentication required for modifications
- Guest users identified by HMAC-signed cookies

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '22.13.0'
      
      - name: Install pnpm
        run: npm run install:ci
      
      - name: Install dependencies
        run: cd marketing-site && pnpm install
      
      - name: Run tests
        run: cd marketing-site && npm test
      
      - name: Build
        run: cd marketing-site && npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy marketing-site/dist/client --project-name=viara-marketing
```

## Support

For deployment issues:
1. Check Cloudflare Pages logs
2. Review [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
3. Check [Wrangler documentation](https://developers.cloudflare.com/workers/wrangler/)
4. Review this project's README.md and PRE_LAUNCH_CHECKLIST.md

---

**Last Updated**: 2026-10-20
**Wrangler Version**: 4.92.0
**Node Version**: 22.13.0
