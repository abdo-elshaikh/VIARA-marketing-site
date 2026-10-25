# VIARA Marketing Site - Improvement Tasks

## Priority Matrix

### 🔴 Critical (Before Launch)

#### 1. Image Optimization
**Status**: Identified, not implemented  
**Impact**: High (Performance, UX)  
**Effort**: Medium

**Current Issue**:
- 18 images exceed 500KB
- Total: 16.81 MB in large images
- Largest: viara-brand-hero-v3.png (2.2 MB)

**Required Actions**:
1. Convert all PNG logos to WebP format
   - `viara-brand-logo-only.png` (1.5MB) → WebP
   - `viara-brand.png` (725KB) → WebP  
   - `viara-symbol.png` (689KB) → Use existing 4.8KB WebP version

2. Optimize hero images
   - `viara-brand-hero-v3.png` (2.2MB) → WebP with quality 85-90
   - Create mobile-optimized versions (max 768px width)

3. Compress system screenshots
   - portal-*.png files (1.2-1.3MB each) → WebP
   - viara-system-*.png files (664KB-926KB each) → WebP
   - Target: < 300KB per screenshot

4. Compress scene JPGs
   - diagnostic-pacs.jpg, healthcare-command.jpg, hospital-inpatient.jpg
   - Target quality: 85-90

**Tools**:
- [Squoosh.app](https://squoosh.app) for manual conversion
- ImageMagick for batch processing:
  ```bash
  # Convert PNG to WebP
  magick input.png -quality 90 output.webp
  
  # Resize and convert
  magick input.png -resize 1440x output.webp
  ```

**Expected Outcome**:
- Total asset size: 16.81 MB → ~4-5 MB (70-75% reduction)
- LCP improvement: ~30-50% faster on slow connections
- Better mobile experience

**Files to Update After Optimization**:
- `app/care-hero.tsx` - Update image paths
- `app/site-header.tsx` - Update logo references
- `app/system-*.tsx` - Update screenshot paths

---

#### 2. Environment Variables Configuration
**Status**: Example file created  
**Impact**: High (Security, Functionality)  
**Effort**: Low

**Current Status**:
- `.env.example` created ✅
- `.env.local` needs creation for local dev
- Production secrets need configuration

**Required Actions**:
1. Local Development
   ```bash
   cp .env.example .env.local
   # Edit with actual credentials
   ```

2. Production Setup (Cloudflare)
   ```bash
   wrangler pages secret put VIARA_ADMIN_EMAIL
   wrangler pages secret put VIARA_ADMIN_PASSWORD
   wrangler pages secret put NEXT_PUBLIC_SITE_URL
   ```

3. Verify Configuration
   - Test admin login works
   - Verify sitemap URLs correct
   - Check canonical URLs

**Security Checklist**:
- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] Strong admin password (16+ characters)
- [ ] Production secrets set via Wrangler
- [ ] No credentials in source code

---

#### 3. Content Review & Real Data
**Status**: Needs review  
**Impact**: High (Trust, Conversion)  
**Effort**: High (requires stakeholder input)

**Required Content**:

**Company Information** (in admin panel):
- [ ] Real company name verified
- [ ] Actual company logo uploaded
- [ ] Contact email (monitored)
- [ ] Contact phone (with staff to respond)
- [ ] Physical address or service regions
- [ ] Social media links (if active)

**Product Descriptions**:
- [ ] RIS features accurate and complete
- [ ] PACS capabilities verified
- [ ] CMS functionality documented
- [ ] PORTAL features confirmed
- [ ] All claims backed by documentation

**Technical Claims**:
- [ ] DICOM conformance statement prepared
- [ ] HL7/FHIR integrations documented
- [ ] System requirements specified
- [ ] Performance metrics from actual tests
- [ ] Integration examples verified

**Social Proof**:
- [ ] Real customer testimonials (with consent)
- [ ] Case studies (if available)
- [ ] Implementation statistics (verified)
- [ ] Remove placeholder testimonials

**Legal Documents**:
- [ ] Privacy policy reviewed by legal
- [ ] Terms of service finalized
- [ ] Cookie policy (if needed)
- [ ] Data retention policy documented

---

### 🟡 High Priority (Launch Week)

#### 4. Performance Testing
**Status**: Not tested in production  
**Impact**: High (UX, SEO)  
**Effort**: Medium

**Required Tests**:

**Core Web Vitals** (target values):
- [ ] LCP < 2.5 seconds (75th percentile)
- [ ] FID/INP < 200ms
- [ ] CLS < 0.1

**Test Environments**:
- [ ] Desktop (Fast 3G)
- [ ] Mobile (Slow 3G)
- [ ] Desktop (WiFi)
- [ ] Mobile (4G)

**Pages to Test**:
- Homepage (AR + EN)
- Solutions pages (RIS, PACS, CMS)
- Systems directory
- Contact form submission

**Tools**:
- Chrome DevTools Lighthouse
- PageSpeed Insights
- WebPageTest
- Cloudflare Analytics (after launch)

**If Metrics Don't Meet Targets**:
1. Prioritize image optimization
2. Enable Cloudflare caching
3. Review JavaScript bundle size
4. Implement lazy loading for below-fold images

---

#### 5. Accessibility Audit
**Status**: Partial (design includes a11y features)  
**Impact**: High (Legal, Inclusivity)  
**Effort**: Medium

**Automated Testing**:
- [ ] Run axe DevTools on all pages
- [ ] Run WAVE on all pages
- [ ] Check color contrast ratios (WCAG AA)
- [ ] Validate ARIA attributes

**Manual Testing**:
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Screen reader (NVDA/VoiceOver)
  - [ ] Form labels announced
  - [ ] Error messages announced
  - [ ] Modals trapped focus
  - [ ] Language switcher clear
- [ ] Zoom to 200% (no loss of functionality)
- [ ] Touch targets ≥ 44x44px

**Common Issues to Check**:
- Missing alt text on images
- Form inputs without labels
- Low contrast text
- Non-semantic HTML
- Missing skip links
- Unclear focus order

---

#### 6. Cross-Browser Testing
**Status**: Not tested  
**Impact**: Medium (UX)  
**Effort**: Medium

**Desktop Browsers**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Mobile Browsers**:
- [ ] Safari iOS
- [ ] Chrome Android
- [ ] Samsung Internet
- [ ] Firefox Mobile

**Test Scenarios Per Browser**:
1. Homepage loads correctly
2. Contact form submits successfully
3. Language switcher works
4. Modal dialogs function
5. Responsive layouts correct
6. No JavaScript errors in console
7. CSS renders correctly (no broken layouts)

**Known Browser Quirks to Test**:
- Safari: WebP support (fallback to PNG)
- iOS Safari: Fixed positioning in modals
- Old Android: CSS grid support
- Samsung Internet: Form validation

---

### 🟢 Medium Priority (Post-Launch)

#### 7. Analytics Implementation
**Status**: Not configured  
**Impact**: Medium (Insights)  
**Effort**: Low

**Recommended Setup**:
- Cloudflare Web Analytics (privacy-friendly, no cookies)
- OR Google Analytics 4 (with consent)
- OR Plausible/Fathom (privacy-focused alternatives)

**Events to Track** (no PII):
- Form views
- Form submissions (success/failure)
- Calculator usage
- Package selection
- Solution page views
- System directory searches
- Language switches
- External link clicks (WhatsApp, social)

**Implementation**:
1. Add tracking script to layout.tsx
2. Implement event tracking functions
3. Test in preview environment
4. Update privacy policy to reflect tracking
5. Add consent mechanism (if required by regulations)

---

#### 8. SEO Enhancements
**Status**: Partial implementation  
**Impact**: Medium (Discovery)  
**Effort**: Low

**Current State**:
- ✅ Sitemap.xml dynamic
- ✅ Robots.txt configured
- ✅ Meta titles and descriptions
- ✅ Canonical URLs
- ✅ hreflang for AR/EN
- ✅ Open Graph tags
- ✅ Schema.org structured data

**Additional Enhancements**:
- [ ] Internal linking strategy
  - Link from homepage to solution pages
  - Cross-link related solutions
  - Breadcrumbs on deep pages
- [ ] Image alt text review
  - Descriptive, keyword-aware
  - Not keyword-stuffed
  - Unique per image
- [ ] URL structure review
  - Consistent naming
  - No unnecessary parameters
  - Clean slugs
- [ ] Submit sitemap to:
  - Google Search Console
  - Bing Webmaster Tools

**Content SEO**:
- Target keywords per page documented
- H1/H2/H3 structure optimized
- Meta descriptions compelling (not just keyword lists)
- No thin content pages

---

#### 9. Form Optimization
**Status**: Implemented, needs A/B testing  
**Impact**: Medium (Conversion)  
**Effort**: Low

**Current Implementation**:
- Contact form uses collapsible "Additional details"
- 4 required fields + 1 consent
- Optional: branches, system, package, message

**Suggested A/B Tests** (post-launch):
1. **Field Order**
   - Test A: Name, Org, Email, Phone
   - Test B: Email, Name, Phone, Org

2. **CTA Wording**
   - Test A: "Request a demonstration"
   - Test B: "Get your proposal"
   - Test C: "Book a demo"

3. **Field Requirements**
   - Test A: 4 required fields
   - Test B: 3 required (make phone optional)

4. **Social Proof**
   - Test A: No badge
   - Test B: "Join 50+ radiology centers" badge
   - (Only if number is real and verifiable)

**Metrics to Track**:
- Form view → form start rate
- Form start → form submit rate
- Field abandonment points
- Error rates per field
- Time to complete

---

#### 10. Mobile Menu Enhancement
**Status**: Works, could be improved  
**Impact**: Low (UX)  
**Effort**: Low

**Current Implementation**:
- Mobile menu opens on tap
- Includes navigation links
- Language and theme toggles inside
- Closes on route change
- Closes on Escape key

**Suggested Enhancements**:
1. Add animation on open/close (if reduced motion not preferred)
2. Show "active" state for current page
3. Include search box in menu (if search feature added)
4. Add "Quick Actions" section:
   - Request demo (jump to form)
   - Calculate storage (open calculator)
   - View solutions (jump to section)

**Implementation**:
- Update `app/site-header.tsx`
- Test on various mobile devices
- Ensure accessibility maintained

---

### 🔵 Low Priority (Future Roadmap)

#### 11. Multilingual Expansion
**Status**: Currently AR + EN  
**Impact**: Low (depends on market expansion)  
**Effort**: High

**Potential Languages**:
- French (North Africa market)
- Turkish (if expanding to Turkey)
- Spanish (if targeting LatAm)

**Requirements Per Language**:
- Native speaker translation
- RTL considerations (Arabic only)
- Date/number formatting
- Currency display
- Contact hours (time zones)
- Legal compliance per region

---

#### 12. Chat/Support Widget
**Status**: Not implemented  
**Impact**: Low (could improve engagement)  
**Effort**: Medium

**Options**:
1. **Live Chat** (requires staffing)
   - Crisp, Intercom, Tawk.to
   - Requires staff availability
   - Multilingual support needed

2. **Chatbot** (automated)
   - Answer common questions
   - Collect contact info
   - Hand off to human for complex queries

3. **WhatsApp Widget**
   - Link directly to WhatsApp Business
   - Uses existing contact number
   - No additional software needed

**Recommendation**: Start with WhatsApp widget (already in footer), evaluate live chat after 3 months of launch data.

---

#### 13. Video Content
**Status**: Not implemented  
**Impact**: Low (could improve engagement)  
**Effort**: High

**Video Ideas**:
1. Product overview (2-3 minutes)
   - Show actual UI
   - Narrated workflow
   - Professional production

2. Customer testimonial videos
   - Real customer interview
   - Show their facility (with permission)
   - Discuss benefits achieved

3. Implementation process
   - What to expect
   - Timeline visualization
   - Training approach

**Requirements**:
- Professional videographer
- Script and storyboard
- Customer consent (if featuring customers)
- Hosting (Vimeo, YouTube, or Cloudflare Stream)
- Subtitles (AR + EN)
- Accessible video player

**Recommendation**: Defer until after launch, focus on screenshots and written content first.

---

## Implementation Roadmap

### Week -2 (Before Launch)
- [ ] Complete image optimization
- [ ] Configure production environment variables
- [ ] Content review and real data entry
- [ ] Performance testing
- [ ] Accessibility audit

### Week -1 (Launch Preparation)
- [ ] Cross-browser testing
- [ ] Final content approval
- [ ] Legal review complete
- [ ] Staging environment deployment
- [ ] User acceptance testing
- [ ] Pre-launch checklist completed

### Week 0 (Launch)
- [ ] Production deployment
- [ ] DNS configuration
- [ ] SSL verification
- [ ] Smoke tests
- [ ] Monitor for first 24 hours

### Week 1 (Post-Launch)
- [ ] Analytics setup
- [ ] SEO enhancements
- [ ] Gather initial feedback
- [ ] Address any urgent issues
- [ ] Baseline performance metrics

### Month 2-3 (Optimization)
- [ ] A/B testing setup
- [ ] Form optimization experiments
- [ ] Mobile menu enhancements
- [ ] Content updates based on feedback

### Month 4+ (Future Enhancements)
- [ ] Multilingual expansion (if needed)
- [ ] Chat widget (if justified by data)
- [ ] Video content (if budget available)
- [ ] Advanced analytics

---

## Success Metrics

### Technical Performance
- **Target**: 90+ Lighthouse scores across all categories
- **Target**: < 3 second page load on 3G
- **Target**: Zero critical accessibility violations

### Business Metrics
- **Target**: 10%+ form view → submission rate
- **Target**: < 30 second average form completion time
- **Target**: 50%+ returning visitors engage with calculator

### User Experience
- **Target**: < 5% form abandonment due to errors
- **Target**: < 2% bounce rate on homepage
- **Target**: 60%+ mobile traffic has positive experience

---

**Maintained by**: Development & Marketing Teams  
**Created**: 2026-10-20  
**Last Updated**: 2026-10-20
