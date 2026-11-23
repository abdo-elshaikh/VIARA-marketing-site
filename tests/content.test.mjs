import test from 'node:test';
import assert from 'node:assert/strict';
import {siteContentSchema,defaultContent,isOfferActive,cairoDay,offerSchema,L} from '../lib/site-content.ts';
import {createDemoContent} from '../lib/demo-content.ts';
import {reviewSchema} from '../lib/review.ts';
import {matchesAdmin} from '../lib/access.ts';
import {jsonLd,organizationSchema} from '../lib/seo.ts';
import {readFileSync} from 'node:fs';
const copy=()=>structuredClone(defaultContent);
test('public package IDs and technical specifications use the package catalog',()=>{
 const catalog=JSON.parse(readFileSync(new URL('../config/packageCatalog.json',import.meta.url),'utf8'));
 const plans=Object.values(catalog.packages);
 for(const plan of defaultContent.plans) assert.ok(plans.some(p=>p.id===plan.id));
 const view=readFileSync(new URL('../app/planning/planning-view.tsx',import.meta.url),'utf8');
 assert.match(view,/config\/packageCatalog\.json/);
 assert.match(view,/plan\.defaultMaxUsers/);
 assert.match(view,/plan\.modules/);
 assert.equal(view.includes('commercialPlanFeature'),false);
});
test('structured data escapes script boundaries and includes only supplied organization details',()=>{
 const content=copy();content.brand.name='</script><script>1</script>';
 content.contact.email='sales@example.com';content.contact.linkedin='https://www.linkedin.com/company/example';
 const schema=organizationSchema(content);const serialized=jsonLd(schema);
 assert.equal(serialized.includes('</script>'),false);
 assert.equal(JSON.parse(serialized).name,content.brand.name);
 assert.equal(schema.email,'sales@example.com');
 assert.deepEqual(schema.sameAs,['https://www.linkedin.com/company/example']);
 assert.equal('telephone' in schema,false);
 assert.equal('aggregateRating' in schema,false);
});
test('default content is bilingual, valid and free of fabricated testimonials or offers',()=>{
 assert.equal(siteContentSchema.safeParse(defaultContent).success,true);
 assert.equal(defaultContent.offers.length,0);
 assert.equal(defaultContent.journeys.length,5);
 assert.equal(defaultContent.metrics.length,4);
 for(const product of defaultContent.products){assert.ok(product.name.ar&&product.name.en);for(const feature of product.features)assert.ok(feature.ar&&feature.en);}
});
test('default company content does not publish placeholder contacts or unverified credentials', () => {
  const content = copy();
  assert.equal(content.company.offices.length, 0);
  assert.equal(content.company.support.length, 0);
  assert.equal(content.company.credentials.length, 0);
});
test('sample content is editable, valid, preserves real contact and branding, and keeps factual drafts unpublished',()=>{
 const current=copy();current.contact.email='contact@example.com';current.brand.name='Existing brand';current.brand.logo='/assets/viara-symbol.png';current.company.legalName=L('اسم المنشأة الحالي','Current organization name');
 const sample=createDemoContent(current);
 assert.equal(siteContentSchema.safeParse(sample).success,true);
 assert.equal(sample.contact.email,current.contact.email);
 assert.equal(sample.brand.name,current.brand.name);
 assert.deepEqual(sample.company.legalName,current.company.legalName);
 assert.equal(sample.company.offices.every(item=>!item.enabled),true);
 assert.equal(sample.company.support.every(item=>!item.enabled),true);
 assert.equal(sample.company.team.every(item=>!item.enabled),true);
 assert.equal(sample.company.milestones.every(item=>!item.enabled),true);
 assert.equal(sample.company.credentials.every(item=>!item.enabled),true);
 assert.equal(sample.offers.length,1);
 assert.equal(sample.offers[0].active,false);
 assert.match(sample.offers[0].title.ar,/تجريبي/);
 assert.equal(current.offers.length,0);
});
test('content rejects unsafe links, CSS injection and missing language content',()=>{
 for(const alter of [c=>c.contact.facebook='javascript:alert(1)',c=>c.brand.logo='data:image/svg+xml,<svg/>',c=>c.brand.primary='red;display:none',c=>c.hero.title.en='',c=>c.contact.email='invalid',c=>c.contact.phone='-------',c=>c.products.forEach(p=>p.enabled=false),c=>c.plans.forEach(p=>p.enabled=false)]){const content=copy();alter(content);assert.equal(siteContentSchema.safeParse(content).success,false);}
});
test('offers expire at the end of their Cairo calendar day',()=>{
 const offer={id:'6933fe22-93d5-405f-8e40-70b6b63f37db',title:L('عرض حقيقي','Actual offer'),description:L('وصف العرض وشروطه','Offer description and conditions'),badge:L('عرض','Offer'),endDate:'2026-10-14',active:true,plan:'أساس'};
 assert.equal(cairoDay(new Date('2026-10-14T21:00:00Z')),'2026-10-15');
 assert.equal(isOfferActive(offer,new Date('2026-10-14T20:59:59Z')),true);
 assert.equal(isOfferActive(offer,new Date('2026-10-14T21:00:00Z')),false);
 assert.equal(isOfferActive({...offer,active:false},new Date('2026-10-13T00:00:00Z')),false);
 assert.equal(offerSchema.safeParse({...offer,endDate:'2026-02-31'}).success,false);
 assert.equal(offerSchema.safeParse({...offer,title:L('','')}).success,false);
});
test('admin access requires the configured owner and fails closed',()=>{
 assert.equal(matchesAdmin('owner@example.com',undefined),false);
 assert.equal(matchesAdmin('','  '),false);
 assert.equal(matchesAdmin('other@example.com','owner@example.com'),false);
 assert.equal(matchesAdmin('owner@example.com.attacker.test','owner@example.com'),false);
 assert.equal(matchesAdmin(' OWNER@EXAMPLE.COM ','owner@example.com'),true);
});
test('review validation requires consent, real content and a bounded rating, and strips client moderation fields',()=>{
 const review={id:'6933fe22-93d5-405f-8e40-70b6b63f37db',name:'مراجع تجريبي',role:'',organization:'',quote:'هذا نص اختبار لا ينشر على الموقع',rating:5,locale:'ar',consent:true};
 for(const invalid of [{consent:false},{rating:6},{rating:0},{quote:'short'},{locale:'unknown'}])assert.equal(reviewSchema.safeParse({...review,...invalid}).success,false);
 const result=reviewSchema.parse({...review,status:'approved',userId:'another-user'});
 assert.equal('status' in result,false);assert.equal('userId' in result,false);
});
test('existing saved content gains default page imagery without losing customized text',()=>{
 const legacy=copy();delete legacy.imagery;delete legacy.journeys;delete legacy.metrics;legacy.hero.title.ar='عنوان مخصص محفوظ';
 const parsed=siteContentSchema.parse(legacy);
 assert.equal(parsed.hero.title.ar,'عنوان مخصص محفوظ');
 assert.equal(parsed.imagery.hero,'/assets/scenes/radiology-care.webp');
 assert.equal(parsed.imagery.care,'/assets/scenes/medical-team.webp');
 assert.deepEqual(parsed.journeys,defaultContent.journeys);
 assert.deepEqual(parsed.metrics,defaultContent.metrics);
 assert.equal(siteContentSchema.safeParse({...legacy,imagery:{hero:'javascript:alert(1)',care:'/assets/scenes/medical-team.webp'}}).success,false);
});

test('reviews can be linked only to a known system without granting moderation privileges',()=>{
 const review={id:'6933fe22-93d5-405f-8e40-70b6b63f37db',name:'Test reviewer',quote:'A genuine experience for validation only',rating:4,locale:'en',consent:true};
 for(const systemId of ['HIS','EHR','PACS','LIS','AI'])assert.equal(reviewSchema.parse({...review,systemId}).systemId,systemId);
 assert.equal(reviewSchema.safeParse({...review,systemId:'UNKNOWN'}).success,false);
 assert.equal(reviewSchema.parse({...review,systemId:null}).systemId,null);
 assert.equal(reviewSchema.parse({...review,systemId:'PACS',status:'approved'}).status,undefined);
});
