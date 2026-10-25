# VIARA Marketing Site - Accessibility Audit Checklist

**WCAG 2.1 Level AA Compliance Checklist**

This checklist helps verify the marketing site meets WCAG 2.1 Level AA accessibility standards.

---

## 🎯 Audit Overview

**Target Level**: WCAG 2.1 AA  
**Primary Languages**: Arabic (RTL) + English (LTR)  
**Key User Groups**: 
- Healthcare administrators
- Medical professionals
- Procurement teams
- Arabic-speaking users
- Users with disabilities

---

## 1. Perceivable

### 1.1 Text Alternatives

#### 1.1.1 Non-text Content (Level A)

- [ ] **All images have alt text**
  - Check: `<img>` elements have meaningful `alt` attributes
  - Decorative images use `alt=""` or `aria-hidden="true"`
  - Icons have accessible labels
  
  **Test**:
  ```bash
  # Find images without alt
  grep -r "<img" app/ --include="*.tsx" | grep -v "alt="
  ```

- [ ] **Form controls have labels**
  - All `<input>` have associated `<label>`
  - Labels properly linked via `for` attribute or wrapping
  - Placeholder is not sole label
  
  **Test**: Use browser DevTools Accessibility panel

- [ ] **Buttons have accessible names**
  - Text content or `aria-label`
  - Icon-only buttons have labels
  
  Files to check:
  - `app/lead-form.tsx` - Contact form
  - `app/site-header.tsx` - Navigation buttons
  - `app/care-home.tsx` - CTA buttons

---

### 1.2 Time-based Media

#### 1.2.1 Audio-only and Video-only (Level A)

- [x] **No audio/video content currently**
  - If added: provide transcripts for audio
  - If added: provide audio descriptions or full-text alternatives for video

---

### 1.3 Adaptable

#### 1.3.1 Info and Relationships (Level A)

- [ ] **Semantic HTML structure**
  - Headings: `<h1>` → `<h2>` → `<h3>` hierarchy
  - Lists use `<ul>`, `<ol>`, `<li>`
  - Tables use `<table>`, `<th>`, `<td>`
  - Forms use fieldsets where appropriate
  
  **Test**:
  - Use HeadingsMap browser extension
  - Check outline in DevTools

- [ ] **Programmatic associations**
  - Form labels correctly associated
  - ARIA roles match semantic meaning
  - Relationships clear to screen readers

#### 1.3.2 Meaningful Sequence (Level A)

- [ ] **Reading order matches visual order**
  - Tab order logical
  - Screen reader reads content in correct order
  - RTL order correct for Arabic
  
  **Test**: 
  - Tab through page with keyboard
  - Use screen reader (NVDA/VoiceOver)

#### 1.3.3 Sensory Characteristics (Level A)

- [ ] **Instructions don't rely solely on sensory characteristics**
  - Avoid "Click the green button" (also say button name)
  - Don't rely only on position ("button on right")
  - Don't rely only on shape
  
  **Check**: Review all instructional text

#### 1.3.4 Orientation (Level AA)

- [ ] **Content works in both portrait and landscape**
  - No orientation lock
  - Layout adapts to orientation
  
  **Test**: Rotate device, resize browser

#### 1.3.5 Identify Input Purpose (Level AA)

- [ ] **Autocomplete attributes on form fields**
  - Name field: `autocomplete="name"`
  - Email: `autocomplete="email"`
  - Phone: `autocomplete="tel"`
  - Organization: `autocomplete="organization"`
  
  **Check**: `app/lead-form.tsx`

---

### 1.4 Distinguishable

#### 1.4.1 Use of Color (Level A)

- [ ] **Information not conveyed by color alone**
  - Links distinguishable from text (underline/bold)
  - Error states use icons + text, not just red color
  - Required fields marked with asterisk, not just color
  
  **Test**: Use grayscale filter, check if meaning preserved

#### 1.4.2 Audio Control (Level A)

- [x] **No auto-playing audio** ✅

#### 1.4.3 Contrast (Minimum) (Level AA)

- [ ] **Text contrast ratio ≥ 4.5:1 (normal text)**
- [ ] **Text contrast ratio ≥ 3:1 (large text ≥ 18pt or bold 14pt)**
- [ ] **UI component contrast ≥ 3:1**

**Colors to test**:
| Element | Foreground | Background | Required | Status |
|---------|-----------|------------|----------|--------|
| Body text | #1e293b | #ffffff | 4.5:1 | ⏳ |
| Headings | #0f172a | #ffffff | 4.5:1 | ⏳ |
| Links | #10b981 | #ffffff | 4.5:1 | ⏳ |
| Buttons (green) | #ffffff | #10b981 | 4.5:1 | ⏳ |
| Error text | #ef4444 | #ffffff | 4.5:1 | ⏳ |
| Gray text | #64748b | #ffffff | 4.5:1 | ⏳ |

**Tools**:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools Lighthouse
- axe DevTools browser extension

**Command**:
```bash
# Find CSS color definitions
grep -r "color:" app/*.css --include="*.css" | sort | uniq
```

#### 1.4.4 Resize Text (Level AA)

- [ ] **Text can be resized to 200% without loss of content or functionality**
  
  **Test**:
  1. Browser zoom to 200%
  2. Check all text visible
  3. Check no overlapping
  4. Check all functionality works
  
  **Pages to test**:
  - Homepage (AR + EN)
  - Contact form
  - Solutions pages
  - Systems directory

#### 1.4.5 Images of Text (Level AA)

- [ ] **No images of text (except logos)**
  - Text rendered as actual text, not images
  - Logos acceptable
  
  **Current status**: ✅ All text is HTML text

#### 1.4.10 Reflow (Level AA)

- [ ] **Content reflows without horizontal scrolling at 320px width**
  - No horizontal scroll on mobile
  - Content adapts to viewport
  
  **Test**: Resize browser to 320px width, check all pages

#### 1.4.11 Non-text Contrast (Level AA)

- [ ] **UI components have contrast ≥ 3:1**
  - Form inputs borders
  - Button borders (if not filled)
  - Focus indicators
  
  **Test**: Check form fields, buttons, interactive elements

#### 1.4.12 Text Spacing (Level AA)

- [ ] **Content still readable with adjusted text spacing**
  - Line height ≥ 1.5× font size
  - Paragraph spacing ≥ 2× font size
  - Letter spacing ≥ 0.12× font size
  - Word spacing ≥ 0.16× font size
  
  **Test**: Apply CSS:
  ```css
  * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
  }
  p {
    margin-bottom: 2em !important;
  }
  ```

#### 1.4.13 Content on Hover or Focus (Level AA)

- [ ] **Tooltip/popover content is:**
  - Dismissible (Esc key)
  - Hoverable (can move pointer over it)
  - Persistent (doesn't disappear on small movements)
  
  **Check**: Modals, dropdowns, tooltips

---

## 2. Operable

### 2.1 Keyboard Accessible

#### 2.1.1 Keyboard (Level A)

- [ ] **All functionality available via keyboard**
  - Tab through all interactive elements
  - Enter/Space activates buttons
  - Arrow keys work in menus/tabs
  - Escape closes modals
  
  **Test**:
  1. Unplug mouse
  2. Navigate entire site with keyboard only
  3. Complete contact form
  4. Use calculator
  5. Browse systems directory

#### 2.1.2 No Keyboard Trap (Level A)

- [ ] **Keyboard focus never trapped**
  - Can always Tab/Shift+Tab to escape
  - Modal focus trapped deliberately (but Esc exits)
  - Dropdown focus manageable
  
  **Test**: Tab through all pages, ensure can always progress or regress

#### 2.1.4 Character Key Shortcuts (Level A)

- [ ] **Single character shortcuts either:**
  - Don't exist, OR
  - Can be turned off, OR
  - Only active when component focused
  
  **Current status**: ✅ No single-char shortcuts

---

### 2.2 Enough Time

#### 2.2.1 Timing Adjustable (Level A)

- [x] **No time limits on interactions** ✅
  - Form has no timeout
  - No auto-refreshing content

#### 2.2.2 Pause, Stop, Hide (Level A)

- [x] **No auto-updating, blinking, or scrolling content** ✅

---

### 2.3 Seizures and Physical Reactions

#### 2.3.1 Three Flashes or Below Threshold (Level A)

- [x] **No flashing content** ✅

---

### 2.4 Navigable

#### 2.4.1 Bypass Blocks (Level A)

- [ ] **Skip links present**
  - "Skip to main content" link
  - Hidden until keyboard focus
  
  **Add to** `app/layout.tsx`:
  ```tsx
  <a href="#main-content" className="skip-link">
    {t('تخطى إلى المحتوى الرئيسي', 'Skip to main content')}
  </a>
  ```

#### 2.4.2 Page Titled (Level A)

- [ ] **Every page has unique, descriptive `<title>`**
  
  **Check**:
  - Homepage: "VIARA - Healthcare Management Systems"
  - Solutions: "RIS - Radiology Information System | VIARA"
  - Contact: "Request a Demo | VIARA"
  
  **Verify**: `app/page.tsx`, `app/solutions/[slug]/page.tsx`

#### 2.4.3 Focus Order (Level A)

- [ ] **Focus order follows meaningful sequence**
  - Logical tab order
  - No jumping around
  - RTL respected for Arabic
  
  **Test**: Tab through pages, verify order makes sense

#### 2.4.4 Link Purpose (in Context) (Level A)

- [ ] **Link text describes destination**
  - No "click here" links
  - No "read more" without context
  - Links clear from surrounding text
  
  **Test**: Screen reader "list links" command makes sense

#### 2.4.5 Multiple Ways (Level AA)

- [ ] **Multiple ways to find pages**
  - Navigation menu ✅
  - Sitemap ✅ (`/sitemap.xml`)
  - Search (if implemented)
  - Footer links ✅
  
  **Current**: ✅ Navigation + footer + sitemap

#### 2.4.6 Headings and Labels (Level AA)

- [ ] **Headings describe topics**
- [ ] **Form labels describe purpose**
  
  **Check**:
  - Heading hierarchy logical
  - Labels clear and descriptive
  
  **Test**: Read headings only, can you understand page structure?

#### 2.4.7 Focus Visible (Level AA)

- [ ] **Keyboard focus indicator always visible**
  - Default browser outline, OR
  - Custom focus styles
  - Never `outline: none` without replacement
  
  **Test**: Tab through site, always see where focus is

**Check CSS**:
```bash
# Find problematic focus removal
grep -r "outline: none" app/*.css
grep -r "outline: 0" app/*.css
```

---

### 2.5 Input Modalities

#### 2.5.1 Pointer Gestures (Level A)

- [x] **No complex gestures required** ✅
  - All interactions single-click/tap
  - No drag-and-drop
  - No multi-touch

#### 2.5.2 Pointer Cancellation (Level A)

- [ ] **Click completes on up-event (mouseup/touchend)**
  - Prevents accidental activation
  
  **Current**: ✅ React onClick uses standard up-event

#### 2.5.3 Label in Name (Level A)

- [ ] **Visible label matches accessible name**
  - Button text = ARIA label
  - Form label = accessible name
  
  **Check**: Buttons and form fields

#### 2.5.4 Motion Actuation (Level A)

- [x] **No device motion triggers** ✅
  - No shake to undo
  - No tilt controls

---

## 3. Understandable

### 3.1 Readable

#### 3.1.1 Language of Page (Level A)

- [ ] **HTML lang attribute set**
  - Arabic pages: `<html lang="ar">`
  - English pages: `<html lang="en">`
  
  **Check**: `app/layout.tsx`

#### 3.1.2 Language of Parts (Level AA)

- [ ] **Mixed language content marked**
  - English terms in Arabic text: `<span lang="en">RIS</span>`
  - Arabic terms in English text: `<span lang="ar">...</span>`
  
  **Check**: Pages with mixed language content

---

### 3.2 Predictable

#### 3.2.1 On Focus (Level A)

- [x] **Focus doesn't trigger context change** ✅
  - Focusing doesn't open modal
  - Focusing doesn't submit form

#### 3.2.2 On Input (Level A)

- [x] **Input doesn't trigger context change** ✅
  - Typing doesn't submit
  - Selecting doesn't navigate

#### 3.2.3 Consistent Navigation (Level AA)

- [ ] **Navigation consistent across pages**
  - Same order
  - Same labels
  - Same location
  
  **Check**: Header navigation on all pages

#### 3.2.4 Consistent Identification (Level AA)

- [ ] **Components with same function labeled consistently**
  - All "Submit" buttons say "Submit" (or language equivalent)
  - All close icons labeled same way
  
  **Check**: Buttons, icons, form fields across pages

---

### 3.3 Input Assistance

#### 3.3.1 Error Identification (Level A)

- [ ] **Form errors clearly identified**
  - Error messages describe what's wrong
  - Invalid fields marked
  - ARIA attributes announce errors
  
  **Check**: `app/lead-form.tsx`
  - Submit invalid form
  - Verify errors announced by screen reader

#### 3.3.2 Labels or Instructions (Level A)

- [ ] **Form fields have labels**
- [ ] **Required fields indicated**
- [ ] **Input format described**
  
  **Check**: Contact form
  - All labels present
  - Required marked with *
  - Format hints (e.g., "+20 ...")

#### 3.3.3 Error Suggestion (Level AA)

- [ ] **Error messages suggest corrections**
  - "Email required" → "Please enter your email address"
  - "Invalid phone" → "Phone number must be in format +20 ..."
  
  **Check**: Form validation messages

#### 3.3.4 Error Prevention (Legal, Financial, Data) (Level AA)

- [ ] **Submissions are:**
  - Reversible (can delete request), OR
  - Checked (validation before submit), OR
  - Confirmed (confirmation page/message)
  
  **Current**: ✅ Validation + confirmation message

---

## 4. Robust

### 4.1 Compatible

#### 4.1.1 Parsing (Level A)

- [ ] **Valid HTML**
  - No duplicate IDs
  - Elements properly nested
  - Tags properly closed
  
  **Test**:
  - [W3C HTML Validator](https://validator.w3.org/)
  - Chrome DevTools Console (check for HTML errors)

#### 4.1.2 Name, Role, Value (Level A)

- [ ] **All UI components have:**
  - Accessible name
  - Appropriate role
  - Current state/value (if applicable)
  
  **Check**: Custom components with ARIA

#### 4.1.3 Status Messages (Level AA)

- [ ] **Status messages announced without focus**
  - Loading states: `role="status"` or `aria-live="polite"`
  - Errors: `role="alert"` or `aria-live="assertive"`
  - Success: `role="status"`
  
  **Check**: Form submission success/error messages

---

## 🛠️ Testing Tools

### Automated Testing

#### Browser Extensions
1. **axe DevTools** (Chrome/Firefox)
   - Install from browser store
   - Run on each page
   - Fix critical/serious issues
   
2. **WAVE** (Chrome/Firefox)
   - Install from browser store
   - Visual indicators of issues
   - Detailed reports

3. **Lighthouse** (Chrome built-in)
   - DevTools → Lighthouse → Accessibility
   - Target score: ≥ 90

#### Command Line
```bash
# Install pa11y
npm install --save-dev pa11y

# Test a page
npx pa11y http://localhost:5173

# Test multiple pages
npx pa11y-ci --sitemap http://localhost:5173/sitemap.xml
```

---

### Manual Testing

#### Screen Readers

**NVDA (Windows - Free)**
1. Download from [nvaccess.org](https://www.nvaccess.org/)
2. Install and launch
3. Navigate site with:
   - `Insert + Down Arrow` - Read all
   - `Tab` - Next interactive element
   - `H` - Next heading
   - `F` - Next form field
   - `L` - Next link

**VoiceOver (Mac - Built-in)**
1. Enable: System Preferences → Accessibility → VoiceOver
2. Shortcut: `Cmd + F5`
3. Navigate with:
   - `VO + A` - Read all
   - `VO + Right/Left Arrow` - Navigate elements
   - `VO + Space` - Activate

**JAWS (Windows - Commercial)**
- Most widely used professional screen reader
- Trial version available

#### Keyboard Only
1. Unplug mouse
2. Complete all tasks using only:
   - `Tab` / `Shift + Tab` - Navigate
   - `Enter` / `Space` - Activate
   - `Arrow keys` - Navigate within component
   - `Esc` - Close/Cancel

#### Color Blindness Simulation
**Chrome Extensions**:
- Colorblindly
- NoCoffee Vision Simulator

**Test**:
- Deuteranopia (red-green)
- Protanopia (red-green)
- Tritanopia (blue-yellow)
- Achromatopsia (grayscale)

---

## 📋 Page-by-Page Checklist

### Homepage (AR + EN)

- [ ] Proper heading structure (H1 → H2 → H3)
- [ ] Hero image has alt text
- [ ] CTA buttons keyboard accessible
- [ ] Focus order logical
- [ ] Color contrast passes
- [ ] Language switcher accessible
- [ ] Mobile menu keyboard accessible
- [ ] Form labels properly associated
- [ ] Error states accessible
- [ ] Success messages announced

### Solutions Pages (RIS, PACS, CMS)

- [ ] Breadcrumbs keyboard accessible
- [ ] Feature tabs keyboard accessible
- [ ] Gallery images have alt text
- [ ] Gallery keyboard navigable
- [ ] Workflow diagrams have text alternatives
- [ ] CTA buttons accessible

### Systems Directory

- [ ] Search field labeled
- [ ] Filters keyboard accessible
- [ ] System cards keyboard accessible
- [ ] Comparison table accessible
- [ ] Selection state announced

### About Page

- [ ] Heading structure
- [ ] Images have alt text
- [ ] Links descriptive

### Contact Form

- [ ] All fields have labels
- [ ] Required fields indicated
- [ ] Errors clearly identified
- [ ] Error suggestions provided
- [ ] Success state announced
- [ ] Autocomplete attributes present

---

## ✅ Sign-Off

### Automated Tests

- [ ] **axe DevTools**: 0 critical issues
- [ ] **WAVE**: 0 errors
- [ ] **Lighthouse Accessibility**: Score ≥ 90
- [ ] **HTML Validator**: No errors

### Manual Tests

- [ ] **NVDA**: All content readable, all actions possible
- [ ] **VoiceOver**: All content readable, all actions possible
- [ ] **Keyboard Only**: All functionality accessible
- [ ] **200% Zoom**: No content loss
- [ ] **320px Width**: No horizontal scroll
- [ ] **Color Contrast**: All text passes WCAG AA

### Sign-Off

**Tested By**: _______________  
**Date**: _______________  
**Tool Versions**:
- axe DevTools: _______
- NVDA: _______
- Browser: _______

**Issues Found**: _______  
**Issues Fixed**: _______  
**Outstanding Issues**: _______

---

## 📊 Common Issues & Fixes

### Issue: Low Contrast Text

**Problem**: Gray text on white background (ratio 3:1)  
**Fix**: Darken text color to #64748b or darker

**CSS**:
```css
/* Before */
color: #cbd5e1; /* Too light */

/* After */
color: #64748b; /* Darker, better contrast */
```

---

### Issue: Missing Alt Text

**Problem**: `<img src="..." />`  
**Fix**: Add descriptive alt attribute

**TSX**:
```tsx
{/* Before */}
<img src="/assets/hero.webp" />

{/* After */}
<img 
  src="/assets/hero.webp" 
  alt={t('صورة توضيحية لنظام VIARA', 'VIARA system illustration')}
/>
```

---

### Issue: No Focus Indicator

**Problem**: Can't see keyboard focus  
**Fix**: Add visible focus styles

**CSS**:
```css
/* Never do this without replacement */
button {
  outline: none; /* ❌ Bad */
}

/* Do this instead */
button:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
```

---

### Issue: Form Errors Not Announced

**Problem**: Errors visible but screen reader doesn't announce  
**Fix**: Add ARIA live region

**TSX**:
```tsx
{error && (
  <div 
    className="form-error" 
    role="alert"              {/* 👈 Add this */}
    aria-live="assertive"     {/* 👈 And this */}
  >
    {error}
  </div>
)}
```

---

## 📚 Resources

### Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/extension/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Screen Readers
- [NVDA](https://www.nvaccess.org/) (Windows, free)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows, trial)
- VoiceOver (Mac/iOS, built-in)

### Learning
- [WebAIM](https://webaim.org/)
- [A11ycasts (YouTube)](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g)
- [Inclusive Components](https://inclusive-components.design/)

---

**Last Updated**: 2026-10-20  
**Next Review**: Before launch + quarterly  
**Maintained By**: Development & QA Teams
