'use client';
import Link from 'next/link';
import { ArrowUpLeft, ArrowUpRight, Check, Plus, ChevronDown, Columns3 } from 'lucide-react';
import { txt, careCatalog, type Locale, type SiteContent } from '../lib/site-content';
import { systemGuides } from '../lib/system-guides';
import { solutionPath } from '../lib/solutions';
import { marketingSystemIds } from '../lib/healthcare-catalog.mjs';
import './system-decision.css';

export default function SystemComparison({
  content,
  locale,
  selected,
  onToggle,
  alwaysOpen = true,
}: {
  content: SiteContent;
  locale: Locale;
  selected: string[];
  onToggle: (id: string) => void;
  alwaysOpen?: boolean;
}) {
  const en = locale === 'en',
    t = (ar: string, english: string) => (en ? english : ar);
  const systems = careCatalog(content).sort(
    (a, b) => marketingSystemIds.indexOf(a.id) - marketingSystemIds.indexOf(b.id)
  );
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  if (systems.length < 2) return null;
  const guide = (id: string) => systemGuides[id];
  const select = (id: string) => (
    <button
      type="button"
      className="vdc-select"
      aria-pressed={selected.includes(id)}
      onClick={() => onToggle(id)}
    >
      {selected.includes(id) ? <Check size={16} /> : <Plus size={16} />}
      {selected.includes(id) ? t('ضمن نطاقك', 'In your scope') : t('أضف إلى نطاقك', 'Add to scope')}
    </button>
  );

  const comparisonBody = (
    <div className="vdc-comparison-body">
      <p>
        {t(
          'لكل نظام دور سريري وتقني متخصص. يمكنك الجمع بين الأنظمة في نطاق واحد، وتُراجع متطلبات الربط والبنية التحتية في العرض الفني المخصص.',
          'Each system serves a specialized clinical and technical role. You can combine multiple systems in one scope; interoperability is reviewed in your technical proposal.'
        )}
      </p>
      <div className="vdc-table-wrap">
        <table>
          <caption className="vdc-visually-hidden">
            {t('مقارنة أدوار أنظمة VIARA وقدراتها', 'VIARA system roles and capabilities comparison')}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t('المحور التشغيلي', 'Operational Dimension')}</th>
              {systems.map(system => (
                <th scope="col" key={system.id}>
                  <bdi>{system.id}</bdi>
                  <strong>{txt(system.name, locale)}</strong>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{t('الدور الرئيسي', 'Main role')}</th>
              {systems.map(system => (
                <td key={system.id}>
                  {guide(system.id) ? txt(guide(system.id).purpose, locale) : txt(system.description, locale)}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">{t('الفريق والبيئة المستهدفة', 'Relevant teams')}</th>
              {systems.map(system => (
                <td key={system.id}>
                  {guide(system.id) ? txt(guide(system.id).team, locale) : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">{t('أبرز القدرات السريرية', 'Current capabilities')}</th>
              {systems.map(system => (
                <td key={system.id}>
                  <ul>
                    {content.products
                      .find(product => product.id === system.id)
                      ?.features.slice(0, 3)
                      .map((feature, i) => (
                        <li key={i}>
                          <Check size={14} />
                          <span>{txt(feature, locale)}</span>
                        </li>
                      ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">{t('نطاقك والإجراء', 'Choose your scope')}</th>
              {systems.map(system => (
                <td key={system.id}>
                  {select(system.id)}
                  <Link className="vdc-details" href={solutionPath(system.id, locale)}>
                    {t('تفاصيل النظام', 'System details')}
                    <Arrow size={15} />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="vdc-mobile-comparison">
        {systems.map(system => (
          <article key={system.id}>
            <div className="vdc-mobile-title">
              <bdi>{system.id}</bdi>
              <h3>{txt(system.name, locale)}</h3>
            </div>
            <dl>
              <div>
                <dt>{t('الدور الرئيسي', 'Main role')}</dt>
                <dd>
                  {guide(system.id) ? txt(guide(system.id).purpose, locale) : txt(system.description, locale)}
                </dd>
              </div>
              <div>
                <dt>{t('الفريق المستفيد', 'Relevant teams')}</dt>
                <dd>{guide(system.id) ? txt(guide(system.id).team, locale) : '—'}</dd>
              </div>
            </dl>
            <ul className="vdc-mobile-features">
              {content.products
                .find(product => product.id === system.id)
                ?.features.slice(0, 3)
                .map((feature, i) => (
                  <li key={i}>
                    <Check size={14} />
                    <span>{txt(feature, locale)}</span>
                  </li>
                ))}
            </ul>
            {select(system.id)}
            <Link className="vdc-details" href={solutionPath(system.id, locale)}>
              {t('تفاصيل النظام', 'System details')}
              <Arrow size={15} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );

  if (alwaysOpen) {
    return (
      <div className="vdc-comparison is-always-open" id="system-comparison">
        {comparisonBody}
      </div>
    );
  }

  return (
    <details className="vdc-comparison" id="system-comparison">
      <summary>
        <span className="vdc-summary-icon">
          <Columns3 size={23} strokeWidth={1.6} />
        </span>
        <span>
          <strong>{t('قارن الأنظمة قبل اختيار نطاقك.', 'Compare systems before choosing your scope.')}</strong>
          <small>
            {t(
              'الدور الرئيسي، والفريق المستفيد، والقدرات الحالية في مكان واحد.',
              'Main role, relevant teams and current capabilities in one place.'
            )}
          </small>
        </span>
        <span className="vdc-summary-action">
          <span className="vdc-open-label">{t('عرض المقارنة', 'Compare')}</span>
          <span className="vdc-close-label">{t('إخفاء المقارنة', 'Close comparison')}</span>
          <ChevronDown size={18} />
        </span>
      </summary>
      {comparisonBody}
    </details>
  );
}