import React from 'react'

interface FileInfoSummaryProps {
  selectedFile: {
    name: string
    size: number
  }
}
const FileInfoSummaryComponent: React.FC<FileInfoSummaryProps> = ({ selectedFile }) => {
  return (
            <div className="mb-4 w-56 rounded-lg border border-green-200 bg-green-50 p-3 sm:w-sm sm:p-4">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-green-700">
                Selected:{' '}
                <span className="wrap-break-words font-normal">
                  {selectedFile.name}
                </span>
              </p>
              <p className="mt-1 text-xs text-green-600">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>
  )
}

export const FileInfoSummary = React.memo(FileInfoSummaryComponent);
