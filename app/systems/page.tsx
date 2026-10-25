import SystemsPage from '../systems-page';
import { pageMetadata } from '../../lib/seo';
export const dynamic='force-dynamic';
export const metadata=pageMetadata({locale:'ar',canonical:'/systems',arPath:'/systems',enPath:'/en/systems',title:'أنظمة الأشعة والمراكز الطبية | VIARA',description:'استكشف حلول VIARA لإدارة مراكز الأشعة RIS، وأرشفة الصور الطبية PACS، وإدارة المراكز الطبية والعيادات CMS.'});
export default function Page(){return <SystemsPage locale="ar"/>;}
