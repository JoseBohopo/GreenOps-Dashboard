import React from 'react'

interface ValidationErrorListProps {
    hasMissingColumns?: boolean,
    hasInvalidRows?: boolean,
    invalidRows: { rowNumber: number, error: string }[],
    missingColumns: string[],
    error: string,
}
const ValidationErrorList: React.FC<ValidationErrorListProps> = ({ hasMissingColumns, hasInvalidRows, missingColumns, invalidRows, error }) => {
  return (
            <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 p-3"
        >
          <p className="text-sm font-semibold text-red-700">{error}</p>
          {hasMissingColumns &&  missingColumns.map((col) => (
            <p key={col} className="mt-1 text-xs text-red-600">
              Missing required column: {col}
            </p>
          ))}
          {hasInvalidRows && invalidRows.map(({ rowNumber, error }) => (
            <p key={rowNumber} className="mt-1 text-xs text-red-600">
              Row {rowNumber}: {error}
            </p>
          ))}
        </div>
  )
}

export default React.memo(ValidationErrorList);