import React from 'react'

interface UploadSummaryProps {
    rows: number
    error?: string
    isWarning?: boolean
}

const UploadSummaryComponent: React.FC<UploadSummaryProps> = ({ rows, error, isWarning }) => {
  return (
     <div
          aria-live="polite"
          className={`mb-4 rounded-lg border p-3 sm:p-4 ${
            isWarning
              ? 'border-yellow-200 bg-yellow-50'
              : 'border-green-200 bg-green-50'
          }`}
        >
          <div className="flex items-start gap-2">
            <svg
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                isWarning ? 'text-yellow-600' : 'text-green-600'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p
                className={`text-sm font-semibold ${
                  isWarning ? 'text-yellow-700' : 'text-green-700'
                }`}
              >
                ✓ Successfully loaded {rows} rows
              </p>
              {isWarning && (
                <p className="mt-1 text-xs text-yellow-600 sm:text-sm">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
  )
}

export const UploadSummary = React.memo(UploadSummaryComponent);
