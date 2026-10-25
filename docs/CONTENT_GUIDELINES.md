# VIARA Marketing Site - Content Guidelines

## Purpose

This document provides guidelines for creating and maintaining marketing content that is accurate, compliant, and effective.

## Content Principles

### 1. Accuracy First
- Every technical claim must be verifiable
- Features listed must exist in current or committed roadmap
- No exaggeration of capabilities
- Clear distinction between:
  - **Available now** (shipped and supported)
  - **Subject to assessment** (requires scoping)
  - **Planned** (roadmap item with timeline)

### 2. Compliance & Legal
- Medical device regulations respected
- No false advertising claims
- Privacy policy reflects actual data handling
- Terms of service protect both parties
- Regional healthcare regulations considered

### 3. Customer-Centric
- Speak to real pain points
- Use language customers understand
- Avoid jargon where simple words work
- Show, don't just tell
- Provide clear next steps

## Technical Claims - Required Documentation

### DICOM Integration

**What to document:**
- DICOM Conformance Statement (required)
- Supported Service Classes (e.g., C-STORE, C-FIND, C-MOVE)
- Transfer syntaxes supported
- SOP Classes supported
- Character sets supported
- Modality worklist features

**Avoid:**
- "Full DICOM support" without specification
- "All modalities" without testing
- Version claims without conformance statement

**Example - Good:**
```
PACS system supports DICOM 3.0 standard:
- C-STORE for image reception
- C-FIND/C-MOVE for query/retrieve
- Modality Worklist (MWL) provider
- Verification (C-ECHO)

Supported modalities: CT, MR, CR, DX, US, RF
Transfer syntaxes: Explicit/Implicit VR, JPEG, JPEG 2000

Full conformance statement available on request.
```

**Example - Avoid:**
```
Complete DICOM compatibility with all devices and modalities.
```

### HL7/FHIR Integration

**What to document:**
- HL7 version (2.x or FHIR R4/R5)
- Message types supported (ADT, ORM, ORU, etc.)
- FHIR resources implemented
- Interoperability testing completed

**Example - Good:**
```
HL7 v2.5.1 interface supporting:
- ADT messages (patient demographics)
- ORM messages (order entry)
- ORU messages (results reporting)

FHIR R4 resources:
- Patient, Practitioner, Organization
- ServiceRequest, DiagnosticReport
- ImagingStudy, Media

Integration scope defined during technical assessment.
```

### Performance Claims

**What to document:**
- Hardware specifications tested
- Network conditions assumed
- Concurrent user counts
- Data volumes tested
- Test methodology

**Avoid:**
- Percentage uptimes without SLA backing
- "Lightning fast" without metrics
- "Unlimited" anything (users, storage, throughput)

**Example - Good:**
```
Performance characteristics (reference configuration):
- Worklist: < 2 second response for 1000 studies
- Image viewing: < 3 second first-image display
- Report generation: < 5 second save/submit

Tested with:
- 50 concurrent radiologist users
- 500 studies per day
- 10TB total archive size
- 1 Gbps network infrastructure

Actual performance depends on:
- Hardware specifications
- Network infrastructure
- Archive size and usage patterns
- Customization scope

Formal performance testing included in implementation.
```

### Security & Compliance

**What to document:**
- Encryption standards used (TLS 1.3, AES-256)
- Authentication methods available
- Access control models
- Audit logging capabilities
- Compliance frameworks supported (if certified)

**Avoid:**
- "100% secure" or "unhackable"
- Regulatory certifications you don't hold
- Data protection guarantees without policy backing

**Example - Good:**
```
Security features:
- TLS 1.3 for data in transit
- AES-256 encryption for sensitive data at rest
- Role-based access control (RBAC)
- Comprehensive audit logging
- Multi-factor authentication (MFA) available
- Password policies configurable

Compliance:
- Data handling practices designed with HIPAA principles
- Deployment configurations can be tailored to local regulations
- Security assessment available during evaluation

Compliance certification depends on:
- Deployment model (on-premise vs. cloud)
- Local regulatory requirements
- Customer's infrastructure and policies
```

## Content Sections - What to Include

### Homepage

**Hero Section:**
- Clear value proposition (what problem does it solve?)
- Target audience (radiology centers, medical centers, hospitals)
- Primary CTA: "Request a demonstration" or "Get a proposal"
- Supporting CTA: "Explore solutions" or "See features"

**Solutions Overview:**
- 3-4 core solutions with clear use cases
- One sentence per solution
- Visual representation (screenshot or diagram)
- Link to detailed solution page

**Social Proof:**
- Real customer testimonials (with permission)
- Case studies (if available)
- Implementation statistics (if verified)
- Industry recognition (if earned)

**Implementation Confidence:**
- Setup and training process
- Support availability
- Integration approach
- Timeline expectations

**FAQs:**
- Pricing model (custom vs. packages)
- Deployment options (cloud, on-premise, hybrid)
- Integration capabilities
- Support and training
- Data migration assistance

### Solution Pages (RIS, PACS, CMS)

**Hero:**
- Solution name and tagline
- Key benefit statement
- Target user/facility type
- Primary CTA

**Core Features:**
- 6-8 key features
- Each with:
  - Feature name
  - User benefit (not just what it is, but why it matters)
  - Visual representation
- Organized by workflow stage or user role

**Workflow Journey:**
- 4-6 steps in typical workflow
- Before/after or current/improved narrative
- Real use cases
- Screenshots from actual system (with sample data)

**Technical Specifications:**
- System requirements
- Integration points
- Scalability information
- Performance characteristics
- Security features

**Implementation:**
- Setup process overview
- Training approach
- Timeline estimate (range)
- Success criteria

**Related Solutions:**
- How this integrates with other products
- Common package combinations

### Planning/Pricing Page

**Package Overview:**
- Clear differentiation between packages
- Feature comparison table
- Transparent about what varies (users, storage, features)
- "Help me choose" guidance

**Calculator (if included):**
- Purpose: Estimating archive storage needs
- Inputs clearly labeled
- Assumptions displayed
- Result format: "Estimated range" not "Exact size"
- CTA: "Discuss your specific needs"

**Custom Pricing Explanation:**
- Why custom: facility size, scope, integrations vary
- What's included in proposal:
  - Detailed scope
  - Implementation plan
  - Training plan
  - Support terms
- No obligation to purchase

**Implementation Phases:**
- Phase 1: Assessment and scoping
- Phase 2: Setup and configuration
- Phase 3: Training and go-live
- Phase 4: Support and optimization

### About Page

**Company Story:**
- Mission and vision
- Years in operation (if established)
- Team expertise (healthcare IT, radiology, software)
- Regional focus/market understanding

**Approach:**
- How we work with customers
- Our implementation methodology
- Support philosophy
- Continuous improvement commitment

**Why Choose VIARA:**
- What makes us different (not just "better")
- Real examples of customer success
- Our understanding of regional needs
- Arabic/English support

### FAQ Page

**Categories:**
1. Getting Started
2. Technical & Integration
3. Pricing & Packages
4. Implementation & Training
5. Support & Maintenance
6. Security & Compliance

**Answer Format:**
- Direct answer first
- Explanation second
- Link to more details (if complex)
- CTA when appropriate ("Contact us for...")

## Language & Tone

### Arabic Content
- Professional and respectful
- Clear and direct
- Medical terminology accurate
- Regional dialect appropriate (Modern Standard Arabic)
- Avoid:
  - Overly promotional language
  - Direct translations of English idioms
  - Inconsistent terminology

### English Content
- Professional but approachable
- Active voice preferred
- Technical accuracy maintained
- International English (not US-specific)
- Avoid:
  - Jargon without explanation
  - Buzzwords without substance
  - Superlatives without backing

### Bilingual Consistency
- Same information in both languages
- Terminology consistency:
  - RIS = نظام معلومات الأشعة
  - PACS = أرشفة الصور الطبية
  - CMS = إدارة المراكز الطبية
  - EHR = الملف الطبي الإلكتروني
- Cultural adaptation where appropriate
- Not word-for-word translation

## Visual Content Guidelines

### Screenshots & UI Examples

**Do:**
- Use actual system screenshots
- Use realistic sample data (no real PHI)
- Show complete workflows
- Annotate key features
- Use high-quality captures

**Don't:**
- Use mockups labeled as "actual system"
- Show half-built features
- Include real patient data
- Use low-resolution images
- Show error states unless demonstrating error handling

### Diagrams & Illustrations

**Do:**
- Illustrate complex workflows
- Show system architecture
- Visualize data flows
- Explain integrations
- Use consistent visual style

**Don't:**
- Overcomplicate simple concepts
- Use generic stock illustrations
- Contradict actual system behavior

### Photography

**Do:**
- Show real healthcare environments (with permission)
- Represent diverse staff and patients
- Maintain professional quality
- Respect cultural sensitivities

**Don't:**
- Use obviously stock photos
- Show identifiable people without consent
- Include visible PHI
- Use outdated equipment imagery

## Customer Testimonials & Case Studies

### Testimonial Requirements
- Written consent from customer
- Real person, real organization
- Specific benefit mentioned
- Attribution (name, title, organization)
- Date obtained
- Review period (update or remove if outdated)

### Case Study Structure
1. **Customer Background**
   - Organization type and size
   - Challenge faced
   - Goals defined

2. **Solution Implemented**
   - Products deployed
   - Customizations made
   - Timeline

3. **Results Achieved**
   - Measurable outcomes
   - User feedback
   - Ongoing improvements

4. **Customer Quote**
   - Permission obtained
   - Authentic voice preserved

### What NOT to Include
- Fabricated testimonials
- Generic praise without specifics
- Promises that can't be verified
- Comparisons to competitors (unless substantiated)

## Legal & Compliance Reminders

### Privacy Policy
- Accurately describe data collection
- Specify data retention periods
- Explain cookie usage
- Detail user rights (access, deletion, correction)
- Contact for privacy questions
- Update date clearly shown
- No contradictions with actual handling

### Terms of Service
- Scope of services provided
- Limitations of liability (realistic)
- Intellectual property rights
- Termination conditions
- Dispute resolution process
- Governing law and jurisdiction

### Medical Device Regulations
- If product is a medical device: include appropriate warnings/disclaimers
- Regulatory status clearly stated (certified, registered, exempt)
- Intended use statement
- Contraindications or limitations
- Contact for adverse event reporting

### Content Approval Process

**Before Publishing:**
1. Technical review (engineering team)
2. Medical/clinical review (if making clinical claims)
3. Legal review (for compliance)
4. Marketing review (for messaging)
5. Final approval (authorized stakeholder)

**Updates Require Re-Approval When:**
- Technical claims change
- New features added
- Regulatory status changes
- Pricing model changes
- Legal terms modified

## Content Update Schedule

### Regular Reviews
- Homepage: Quarterly
- Product pages: After each major release
- FAQ: Monthly
- Testimonials: Annually (verify still accurate)
- Pricing: As needed
- Legal pages: Annually minimum, or as laws change

### Version Control
- Content versioned in admin system (up to 20 revisions)
- Major changes noted in changelog
- Publication date visible
- Last reviewed date tracked

## Measurement & Optimization

### Track
- Form submission rate
- Bounce rate by page
- Time on page (engagement)
- CTA click rates
- Search queries (if search implemented)
- User feedback

### Test
- A/B test headlines
- Test CTA wording
- Test form field requirements
- Test page layouts

### Optimize Based On
- User behavior data
- Customer feedback
- Sales team input
- Support team questions
- Competitive analysis

---

**Maintained by**: Marketing & Product Teams  
**Last Updated**: 2026-10-20  
**Next Review**: 2027-01-20
