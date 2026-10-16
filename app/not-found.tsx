import { headers } from 'next/headers';
export default async function NotFound() {
  const en = (await headers()).get('x-viara-locale') === 'en';
  return <main style={{ minHeight:'80vh',display:'grid',placeContent:'center',padding:'32px',textAlign:'center',gap:'20px',background:'#fffef9',color:'#173c31' }}>
    <p style={{letterSpacing:'6px',fontSize:'14px'}}>VIARA / 404</p>
    <h1 style={{fontSize:'32px',lineHeight:1.5}}>{en ? 'This page is unavailable.' : 'هذه الصفحة غير متاحة.'}</h1>
    <p>{en ? 'Explore our current solutions or return to the home page.' : 'استكشف الحلول الحالية أو عد إلى الصفحة الرئيسية.'}</p>
    <a href={en ? '/en#solutions' : '/#solutions'} style={{background:'#007b61',color:'white',padding:'14px 24px',borderRadius:'10px',justifySelf:'center'}}>{en ? 'Explore solutions' : 'استكشف الحلول'}</a>
  </main>;
}
