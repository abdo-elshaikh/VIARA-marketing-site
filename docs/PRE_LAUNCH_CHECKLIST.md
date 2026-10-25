# VIARA Marketing Site - Pre-Launch Checklist

## 🎯 Purpose
This checklist ensures the marketing site is production-ready before public deployment.

## ✅ Technical Requirements

### Environment Configuration
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] `VIARA_ADMIN_EMAIL` configured with actual admin email
- [ ] `VIARA_ADMIN_PASSWORD` set to strong password (16+ characters)
- [ ] Cloudflare D1 database created and bound
- [ ] Cloudflare R2 bucket created and bound
- [ ] wrangler.json updated with correct bindings

### Build & Deployment
- [ ] `npm run typecheck` passes with no errors
- [ ] `npm test` passes all 15 tests
- [ ] `npm run build` completes successfully
- [ ] Test deployment to staging environment
- [ ] Verify sitemap.xml loads at `/sitemap.xml`
- [ ] Verify robots.txt loads at `/robots.txt`
- [ ] Check all routes return expected status codes

### Performance & Assets
- [ ] Large images optimized (target < 500KB each)
- [ ] Logo files converted to WebP where appropriate
- [ ] Test site on 3G connection speed
- [ ] Verify Core Web Vitals in production environment
  - LCP < 2.5s
  - FID/INP < 200ms
  - CLS < 0.1

### Security
- [ ] Admin panel requires authentication
- [ ] Admin panel returns 503 if credentials not configured
- [ ] Rate limiting active on login endpoint (5 attempts per 15 min)
- [ ] HTTPS enforced (HSTS header present)
- [ ] CSP headers configured correctly
- [ ] No credentials in source code or committed .env files
- [ ] Session cookies are httpOnly and secure

## 📝 Content Requirements

### Company Information
- [ ] Company name verified in admin panel
- [ ] Logo uploaded (actual company logo, not placeholder)
- [ ] Contact email configured and monitored
- [ ] Contact phone number configured
- [ ] Physical address or service region specified
- [ ] Social media links configured (if applicable)

### Product Information
- [ ] RIS product description accurate and complete
- [ ] PACS product description accurate and complete
- [ ] CMS product description accurate and complete
- [ ] PORTAL product description accurate and complete
- [ ] Feature lists reviewed by product team
- [ ] No fabricated features or capabilities listed
- [ ] Integration claims verified and documented

### Legal & Compliance
- [ ] Privacy policy reviewed and approved
- [ ] Terms of service finalized
- [ ] Cookie consent mechanism implemented (if required)
- [ ] GDPR compliance verified (if serving EU customers)
- [ ] Medical device regulations considered (if applicable)

### Technical Claims
- [ ] DICOM conformance statement available for PACS
- [ ] HL7/FHIR integration capabilities documented
- [ ] System requirements clearly stated
- [ ] SLA commitments backed by service terms
- [ ] Uptime guarantees reflect actual infrastructure
- [ ] Data retention policies documented

## 🎨 Design & UX

### Mobile Responsiveness
- [ ] Test on iPhone (390px width)
- [ ] Test on Android phone (360px width)
- [ ] Test on tablet (768px width)
- [ ] Test on small laptop (1024px width)
- [ ] Test on desktop (1440px width)
- [ ] No horizontal scroll on any viewport
- [ ] Touch targets minimum 44x44px
- [ ] Text readable without zoom on mobile

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible
- [ ] Reduced motion preference respected
- [ ] Screen reader tested on key flows
- [ ] ARIA labels present where needed

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 🔍 Content Quality

### Language & Localization
- [ ] Arabic content reviewed by native speaker
- [ ] English content reviewed for grammar and clarity
- [ ] Technical terminology consistent in both languages
- [ ] RTL layout correct for Arabic
- [ ] Date formats appropriate for target regions
- [ ] Phone number formats support target countries

### SEO Optimization
- [ ] Page titles unique and descriptive (< 60 chars)
- [ ] Meta descriptions compelling (< 160 chars)
- [ ] H1 tags present on all pages
- [ ] Heading hierarchy logical (H1 → H2 → H3)
- [ ] Canonical URLs set correctly
- [ ] hreflang tags for Arabic/English alternates
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Schema.org structured data valid

### Content Accuracy
- [ ] No lorem ipsum or placeholder text
- [ ] Statistics and numbers verified
- [ ] Customer testimonials genuine and approved
- [ ] Case studies accurate and authorized
- [ ] Pricing information current (if displayed)
- [ ] Contact information leads to monitored channels
- [ ] No broken internal links
- [ ] No broken external links

## 📊 Analytics & Monitoring

### Analytics Setup
- [ ] Analytics platform configured (if using)
- [ ] Goal tracking implemented for:
  - Demo request submissions
  - Contact form views
  - Package calculator usage
  - Solution page visits
- [ ] Custom events tracked (no PII)
- [ ] Privacy policy updated to reflect analytics

### Error Monitoring
- [ ] Error tracking service configured
- [ ] Alert thresholds set for:
  - Form submission failures
  - API errors
  - Database connection issues
- [ ] Error notification recipients configured
- [ ] Test error alerts working

### Performance Monitoring
- [ ] Real User Monitoring (RUM) enabled
- [ ] Core Web Vitals tracked
- [ ] API response time monitoring
- [ ] Database query performance tracked

## 🚀 Pre-Launch Testing

### Critical User Flows
- [ ] Homepage loads correctly (AR + EN)
- [ ] Contact form submission works
- [ ] Form validation shows appropriate errors
- [ ] Success message displays after submission
- [ ] Request appears in admin inbox
- [ ] Request appears in user's "My Requests" page
- [ ] Calculator works and attaches estimate
- [ ] System selection carries to contact form
- [ ] Package selection carries to contact form
- [ ] Language switcher works
- [ ] Mobile menu opens and closes
- [ ] Admin login works
- [ ] Admin content editing works
- [ ] Admin can publish content changes
- [ ] Review moderation works

### Edge Cases
- [ ] Form submission with network failure
- [ ] Form submission when database unavailable
- [ ] Admin login with wrong credentials (rate limited)
- [ ] Accessing admin panel without credentials (503)
- [ ] Very long input in text fields
- [ ] Special characters in form inputs
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized

## 📞 Operational Readiness

### Support & Maintenance
- [ ] Sales team trained on responding to inquiries
- [ ] Admin panel training completed
- [ ] Content update procedures documented
- [ ] Escalation path defined for urgent issues
- [ ] Backup and recovery procedures tested
- [ ] Incident response plan documented

### Launch Communications
- [ ] Internal stakeholders notified of launch date
- [ ] Marketing materials prepared
- [ ] Social media posts scheduled
- [ ] Email announcement drafted (if applicable)
- [ ] Press release prepared (if applicable)

### Post-Launch Monitoring
- [ ] First 24 hours: hourly monitoring
- [ ] First week: daily monitoring
- [ ] Performance benchmarks recorded
- [ ] User feedback collection mechanism
- [ ] A/B testing plan (if applicable)

## 🔄 Final Verification

### Day Before Launch
- [ ] Run full test suite one final time
- [ ] Verify all production environment variables
- [ ] Test admin panel access
- [ ] Submit test inquiry and verify receipt
- [ ] Clear any test data from production database
- [ ] DNS records configured for domain
- [ ] SSL certificate installed and valid
- [ ] CDN/proxy configured (if using)

### Launch Day
- [ ] Deploy to production
- [ ] Verify site loads at production URL
- [ ] Submit test inquiry from external network
- [ ] Check analytics receiving data
- [ ] Monitor error logs for first hour
- [ ] Announce launch internally
- [ ] Begin external promotion

### Within 24 Hours
- [ ] Review inquiry submissions
- [ ] Check error rates
- [ ] Review performance metrics
- [ ] Respond to any urgent issues
- [ ] Gather initial user feedback

---

## 📋 Sign-Off

**Technical Review**
- [ ] Reviewed by: _______________  Date: _______
- [ ] Approved by: _______________  Date: _______

**Content Review**
- [ ] Reviewed by: _______________  Date: _______
- [ ] Approved by: _______________  Date: _______

**Legal Review**
- [ ] Reviewed by: _______________  Date: _______
- [ ] Approved by: _______________  Date: _______

**Final Approval**
- [ ] Approved by: _______________  Date: _______

---

**Launch Date**: _________________
**Launch Time**: _________________
**Launched By**: _________________
