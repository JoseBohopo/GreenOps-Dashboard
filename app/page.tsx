'use client';

import Link from 'next/link';

const FEATURES = [
  {
    id: 'file-format',
    icon: '📄',
    title: 'File Format',
    color: 'bg-blue-50',
    items: ['CSV format only', 'Maximum 10MB', 'UTF-8 encoding'],
  },
  {
    id: 'columns',
    icon: '📋',
    title: 'Required Columns',
    color: 'bg-green-50',
    items: ['date', 'pageViews', 'dataTransfer', 'avgSessionDuration'],
  },
  {
    id: 'validation',
    icon: '✅',
    title: 'Validation Rules',
    color: 'bg-yellow-50',
    items: ['Numbers must be ≥ 0', 'Valid date format', 'No empty values'],
  },
];

const CSV_EXAMPLE = `date,pageViews,dataTransfer,avgSessionDuration
2024-01-15,1000,1048576,120
2024-01-16,1250.5,2097152,95.5
2024-01-17,950,524288,130`;

interface FeatureCardProps {
  readonly icon: string;
  readonly title: string;
  readonly items: readonly string[];
  readonly color: string;
  readonly isColumns?: boolean;
}

function FeatureCard({
  icon,
  title,
  items,
  color,
  isColumns,
}: FeatureCardProps) {
  return (
    <section
      className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-shadow p-7 group focus-within:ring-2 focus-within:ring-green-700 focus-within:ring-offset-2"
      aria-labelledby={`feature-title-${title.replaceAll(' ', '-')}`}
    >
      <div
        className={`flex items-center justify-center w-14 h-14 ${color} rounded-xl mb-4 text-2xl group-hover:scale-105 transition-transform`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3
        id={`feature-title-${title.replaceAll(' ', '-')}`}
        className="text-xl font-semibold mb-2 text-gray-900 tracking-tight"
      >
        {title}
      </h3>
      <ul className="text-base text-gray-800 space-y-1 flex-1">
        {items.map((item: string) => (
          <li key={item} className="flex items-center gap-2">
            {isColumns ? (
              <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-900 font-mono text-sm" tabIndex={-1}>
                {item}
              </code>
            ) : (
              <span className="text-green-700" aria-hidden="true">
                &#10003;
              </span>
            )}
            {!isColumns && <span>{item}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CTAButton() {
  return (
    <Link
      className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-all text-lg"
      role="button"
      aria-label="Get Started: Import Data"
      tabIndex={0}
      href="/import"
      passHref
    >
      <span>Get Started</span>
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-green-50 flex flex-col" role="main">
      <header className="w-full pt-16 pb-10 px-4 md:px-0 bg-white/80 backdrop-blur border-b border-gray-100" role="banner">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            Welcome to <span className="text-green-700">GreenOps Dashboard</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Analyze your cloud usage and environmental impact with clarity. Upload your data and unlock actionable insights.
          </p>
          <CTAButton />
        </div>
      </header>

      <section className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-0 py-16" aria-labelledby="how-to-get-started">
        <h2 id="how-to-get-started" className="text-3xl font-bold text-gray-900 mb-10 text-center tracking-tight">
          How to get started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              color={feature.color}
              items={feature.items}
              isColumns={feature.id === 'columns'}
            />
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl mx-auto px-4 md:px-0 pb-16" aria-labelledby="csv-example">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 id="csv-example" className="text-2xl font-bold text-gray-900 mb-4">
            CSV Example
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
            <pre className="text-base text-gray-800 font-mono whitespace-pre-wrap" aria-label="CSV Example Data">
              {CSV_EXAMPLE}
            </pre>
          </div>
        </div>
      </section>

      <footer className="w-full py-8 text-center text-gray-700 text-base border-t border-gray-100 bg-white/70 mt-auto" role="contentinfo">
        GreenOps Dashboard © 2026.{' '}
        <a
          href="/docs/CSV_UPLOAD.md"
          className="underline hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
        >
          User guide
        </a>
      </footer>
    </main>
  );
}