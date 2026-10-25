import SystemsPage from '../../systems-page';
import { pageMetadata } from '../../../lib/seo';
export const dynamic='force-dynamic';
export const metadata=pageMetadata({locale:'en',canonical:'/en/systems',arPath:'/systems',enPath:'/en/systems',title:'Radiology & Medical Center Systems | VIARA',description:'Explore VIARA RIS for radiology workflow, PACS for medical image archiving, and CMS for medical centers and clinics.'});
export default function Page(){return <SystemsPage locale="en"/>;}
