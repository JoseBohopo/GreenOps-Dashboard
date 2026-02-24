'use client';

import Link from 'next/link';

const FEATURES = [
  {
    id: 'file-format',
    icon: '📄',
    title: 'File Format',
    bgColor: 'bg-blue-100',
    items: [
      'CSV format only',
      'Maximum 10MB',
      'UTF-8 encoding',
    ],
  },
  {
    id: 'columns',
    icon: '📋',
    title: 'Required Columns',
    bgColor: 'bg-green-100',
    items: [
      'date',
      'pageViews',
      'dataTransfer',
      'avgSessionDuration',
    ],
  },
  {
    id: 'validation',
    icon: '✅',
    title: 'Validation Rules',
    bgColor: 'bg-amber-100',
    items: [
      'Numbers must be ≥ 0',
      'Valid date format',
      'No empty values',
    ],
  },
];

const CSV_EXAMPLE = `date,pageViews,dataTransfer,avgSessionDuration
2024-01-15,1000,1048576,120
2024-01-16,1250.5,2097152,95.5
2024-01-17,950,524288,130`;

interface FeatureCardProps {
  icon: string;
  title: string;
  items: string[];
  bgColor: string;
  isColumns?: boolean;
}

const FeatureCard = ({ icon, title, items, bgColor, isColumns }: FeatureCardProps) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className={`flex items-center justify-center w-12 h-12 ${bgColor} rounded-lg mb-4`}>
      <span className="text-xl">{icon}</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <ul className="text-sm text-gray-600 space-y-1">
      {items.map((item: string) => (
        <li key={item}>
          {isColumns ? (
            <>• <code className="bg-gray-100 px-1 rounded">{item}</code></>
          ) : (
            <>✓ {item}</>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const CTAButton = () => (
  <Link href="/import">
    <button className="bg-linear-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 inline-block">
      Get Started → Import Data
    </button>
  </Link>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to GreenOps Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze your usage data and measure your environmental impact with ease. 
            Upload your data and get actionable insights in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              bgColor={feature.bgColor}
              items={feature.items}
              isColumns={feature.id === 'columns'}
            />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Example CSV Format</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
            <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
              {CSV_EXAMPLE}
            </pre>
          </div>
        </div>

        <div className="text-center">
          <CTAButton />
        </div>
      </div>
    </div>
  );
}