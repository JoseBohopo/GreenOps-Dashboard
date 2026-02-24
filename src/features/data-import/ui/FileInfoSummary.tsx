import React from 'react'

interface FileInfoSummaryProps {
  selectedFile: {
    name: string
    size: number
  }
}
const FileInfoSummaryComponent: React.FC<FileInfoSummaryProps> = ({ selectedFile }) => {
  return (
    <section
      className="mb-4 w-full max-w-xs rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3 shadow-sm"
      aria-label="Selected file summary"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 mr-2" aria-hidden="true">
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-green-800" title={selectedFile.name}>
          <span className="sr-only">Selected file: </span>
          {selectedFile.name}
        </p>
        <p className="mt-1 text-xs text-green-700">
          Size: <span aria-label="File size">{(selectedFile.size / 1024).toFixed(2)} KB</span>
        </p>
      </div>
    </section>
  )
}

export const FileInfoSummary = React.memo(FileInfoSummaryComponent);
