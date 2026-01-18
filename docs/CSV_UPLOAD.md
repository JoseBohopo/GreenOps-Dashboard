# CSV Upload Feature - Technical Documentation

> **Last updated**: January 2026  
> **Version**: 1.0.0

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Data Flow](#data-flow)
5. [Validation Rules](#validation-rules)
6. [State Management](#state-management)
7. [Usage Guide](#usage-guide)
8. [API Reference](#api-reference)
9. [Testing](#testing)
10. [Error Handling](#error-handling)

---

## Overview

The CSV Upload feature allows users to import usage data (page views, data transfer, session duration) from CSV files into the GreenOps Dashboard.

### Key Features

- File selection via button click
- File type validation (CSV only)
- File size validation (max 10MB)
- Column structure validation
- Data type and range validation
- Asynchronous processing with Web Workers
- Visual feedback (loading, success, error states)
- Data persistence in localStorage
- Responsive design (mobile, tablet, desktop)
- Comprehensive error reporting

### User Flow

1. User visits `/import`
2. Clicks "Select CSV File"
3. File validated (type, size)
4. File processed in Web Worker
5. Results displayed (success/errors)
6. Data stored in localStorage

---

## Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────┐
│ UI Layer                                        │
│ • CsvUploader.tsx (React Component)             │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│ Application Layer                               │
│ • useCsvWorker.ts (Custom Hook)                 │
│ • useUsageDataStore.ts (Zustand Store)          │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│ Domain Layer                                    │
│ • types.ts (Type Definitions)                   │
│ • Validation Rules                              │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│ Infrastructure Layer                            │
│ • csvParser.ts (Parser Logic)                   │
│ • csv.worker.ts (Web Worker)                    │
│ • PapaParse (External Library)                  │
└─────────────────────────────────────────────────┘
```

### File Structure

```
src/features/data-import/
├── application/
│   ├── useCsvWorker.ts              # Web Worker hook
│   ├── useUsageDataStore.ts         # Global state
│   └── tests/
│       └── useUsageDataStore.test.ts
├── domain/
│   └── types.ts                     # Type definitions
├── infrastructure/
│   ├── csv.worker.ts                # Web Worker
│   ├── csvParser.ts                 # Parser logic
│   └── tests/
│       └── csvParser.test.ts
└── ui/
└── CsvUploader.tsx                  # UI Component
```

---

## Components

### 1. CsvUploader

**Path**: `src/features/data-import/ui/CsvUploader.tsx`

**Responsibility**: Main UI component for CSV file upload and validation feedback.

**Features**:

- File input with custom styled button
- File type and size validation
- Loading state during processing
- Success state with file info
- Error state with detailed messages
- Integration with Web Worker
- Integration with Zustand store

**Internal State**:

```tsx
const [file, setFile] = useState<File | null>(null);
const [fileError, setFileError] = useState<string | null>(null);
```

**Usage**:

```tsx
import { CsvUploader } from '@/src/features/data-import/ui/CsvUploader';

function ImportPage() {
  return (
  <div>
    <h1>Import Data</h1>
    <CsvUploader />
  </div>
  );
}
```

---

### 2. useCsvWorker

**Path**: `src/features/data-import/application/useCsvWorker.ts`

**Responsibility**: Manages Web Worker lifecycle and communication.

**Features**:

- Lazy worker initialization
- Promise-based parsing API
- Automatic cleanup on unmount
- Error handling
- Memory leak prevention

**API**:

```tsx
const { parseFile, terminateWorker } = useCsvWorker();

// Parse a file
const result = await parseFile(file);

// Manual cleanup (optional)
terminateWorker();
```

**Return Type**:

```tsx
{
  parseFile: (file: File) => Promise<ParseResult>;
  terminateWorker: () => void;
}
```

**Example**:

```tsx
import { useCsvWorker } from '@/src/features/data-import/application/useCsvWorker';

function MyComponent() {
  const { parseFile } = useCsvWorker();

  const handleUpload = async (file: File) => {
  try {
    const result = await parseFile(file);
    
    if (result.success) {
    console.log('Parsed data:', result.data);
    } else {
    console.error('Validation errors:', result.errors);
    }
  } catch (error) {
    console.error('Worker error:', error);
  }
  };

  return <button onClick={() => handleUpload(selectedFile)}>Upload</button>;
}
```

---

### 3. useUsageDataStore

**Path**: `src/features/data-import/application/useUsageDataStore.ts`

**Responsibility**: Global state management with Zustand.

**State Shape**:

```tsx
{
  usageData: UsageDataRow[] | null;
  isLoading: boolean;
  error: string | null;
  lastUploadDate: string | null;
}
```

**Actions**:

```tsx
setLoading(isLoading: boolean): void
setParseResult(result: ParseResult, fileName: string): void
clearData(): void
setUsageData(data: UsageDataRow[]): void
```

**Persistence**:

- Persists to localStorage with key: `usage-data-storage`
- Only persists: `usageData` and `lastUploadDate`
- Excludes `isLoading` and `error` (ephemeral state)

**Usage**:

```tsx
import { useUsageDataStore } from '@/src/features/data-import/application/useUsageDataStore';

function MyComponent() {
  const { usageData, isLoading, error, setParseResult } = useUsageDataStore();

  // Access data
  console.log('Records:', usageData?.length);

  // Update state
  setParseResult(parseResult, 'data.csv');

  return (
  <div>
    {isLoading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}
    {usageData && <p>Loaded {usageData.length} records</p>}
  </div>
  );
}
```

---

### 4. csvParser

**Path**: `src/features/data-import/infrastructure/csvParser.ts`

**Responsibility**: Parse and validate CSV files using PapaParse.

**Main Function**:

```tsx
export function parseUsageDataCsv(csvContent: string): ParseResult
```

**Validation Logic**:

1. Check required columns exist
2. Parse CSV with PapaParse
3. Validate each row:
   - `date`: non-empty string
   - `pageViews`: number ≥ 0
   - `dataTransfer`: number ≥ 0
   - `avgSessionDuration`: number ≥ 0
4. Trim whitespace from date field
5. Return success or validation errors

**Error Handling**:

- Returns up to 10 first validation errors
- Each error includes row number
- Missing columns reported immediately

---

### 5. csv.worker

**Path**: `src/features/data-import/infrastructure/csv.worker.ts`

**Responsibility**: Process CSV files in background thread.

**How it Works**:

1. Receives File object via postMessage
2. Reads file as text with FileReader
3. Calls `parseUsageDataCsv()`
4. Posts result back to main thread
5. Handles errors and edge cases

**Benefits**:

- Non-blocking UI during processing
- Can handle large files without freezing
- Isolated error handling

---

## Data Flow

### Upload Flow

```
┌─────────────┐
│    User     │
│ Selects CSV │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  CsvUploader    │  ← Validates type & size
│   Component     │
└──────┬──────────┘
       │
       │ User clicks "Load File"
       ▼
┌─────────────────┐
│ useCsvWorker    │  ← Creates Worker
│     Hook        │
└──────┬──────────┘
       │
       │ postMessage(file)
       ▼
┌─────────────────┐
│  csv.worker.ts  │  ← Process in background
│                 │
└──────┬──────────┘
       │
       │ postMessage(result)
       ▼
┌─────────────────┐
│useUsageDataStore│  ← Store data
│   (Zustand)     │
└──────┬──────────┘
       │
       │ persist
       ▼
┌─────────────────┐
│  localStorage   │  ← Survives refresh
└─────────────────┘
```

### State Updates

```tsx
// 1. Start loading
setLoading(true);

// 2. Parse file
const result = await parseFile(file);

// 3. Process result
setParseResult(result, file.name);
// This calls internally:
// - setLoading(false)
// - setUsageData(result.data) or setError(result.errors)
// - setLastUploadDate(new Date().toISOString())
```

---

## Validation Rules

### File Validation

| Rule      | Validation                  | Error Message                  |
| --------- | --------------------------- | ------------------------------ |
| File type | Extension must be `.csv`    | "Please select a CSV file"     |
| File size | Max 10MB (10,485,760 bytes) | "File size exceeds 10MB limit" |

### CSV Structure

**Required Columns**:

1. `date`
2. `pageViews`
3. `dataTransfer`
4. `avgSessionDuration`

**Column Validation**:

```tsx
REQUIRED_COLUMNS = ['date', 'pageViews', 'dataTransfer', 'avgSessionDuration']
```

### Data Validation

| Field                | Type   | Constraints         | Example        |
|----------------------|--------|---------------------|----------------|
| `date`               | string | Non-empty, trimmed  | `"2024-01-15"` |
| `pageViews`          | number | ≥ 0, can be decimal | 1250.5         |
| `dataTransfer`       | number | ≥ 0, can be decimal | 45.67          |
| `avgSessionDuration` | number | ≥ 0, can be decimal | 180.25         |

### Valid Examples

```csv
date,pageViews,dataTransfer,avgSessionDuration
2024-01-15,1000,50.5,120
2024-01-16,1250.5,45.67,180.25
2024-01-17,0,0,0
```

### Invalid Examples

```csv
# Missing column
date,pageViews,dataTransfer
2024-01-15,1000,50.5

# Negative values
date,pageViews,dataTransfer,avgSessionDuration
2024-01-15,-100,50.5,120

# Non-numeric values
date,pageViews,dataTransfer,avgSessionDuration
2024-01-15,abc,50.5,120
```

---

## State Management

### Store Schema

```tsx
interface UsageDataState {
  usageData: UsageDataRow[] | null;
  isLoading: boolean;
  error: string | null;
  lastUploadDate: string | null;
  
  // Actions
  setLoading: (isLoading: boolean) => void;
  setParseResult: (result: ParseResult, fileName: string) => void;
  clearData: () => void;
  setUsageData: (data: UsageDataRow[]) => void;
}
```

### Data Types

```tsx
interface UsageDataRow {
  date: string;
  pageViews: number;
  dataTransfer: number;
  avgSessionDuration: number;
}

type ParseResult = 
  | { success: true; data: UsageDataRow[] }
  | { success: false; errors: ValidationError[] };

interface ValidationError {
  row?: number;
  message: string;
}
```

### Persistence Configuration

```tsx
persist(
  (set) => ({ /* state */ }),
  {
  name: 'usage-data-storage',
  partialize: (state) => ({
    usageData: state.usageData,
    lastUploadDate: state.lastUploadDate,
  }),
  }
)
```

**Why Partial Persistence?**

- `isLoading`: Ephemeral, should always start as `false`
- `error`: Ephemeral, should clear on page reload
- `usageData`: Persisted, survives refresh
- `lastUploadDate`: Persisted, tracks when data was loaded

---

## Usage Guide

### Basic Implementation

**1. Import the component:**

```tsx
import { CsvUploader } from '@/src/features/data-import/ui/CsvUploader';
```

**2. Use in your page:**

```tsx
export default function ImportPage() {
  return (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Import Usage Data</h1>
    <CsvUploader />
  </div>
  );
}
```

**3. Access uploaded data:**

```tsx
import { useUsageDataStore } from '@/src/features/data-import/application/useUsageDataStore';

export default function DashboardPage() {
  const { usageData } = useUsageDataStore();

  if (!usageData) {
  return <p>No data uploaded yet. Visit /import to upload CSV.</p>;
  }

  return (
  <div>
    <h2>Usage Statistics</h2>
    <p>Total records: {usageData.length}</p>
  </div>
  );
}
```

### Advanced Usage

```tsx
import { useCsvWorker } from '@/src/features/data-import/application/useCsvWorker';
import { useUsageDataStore } from '@/src/features/data-import/application/useUsageDataStore';

function CustomUploader() {
  const { parseFile } = useCsvWorker();
  const { setParseResult, isLoading } = useUsageDataStore();

  const handleFileUpload = async (file: File) => {
  try {
    const result = await parseFile(file);
    setParseResult(result, file.name);
    
    if (result.success) {
    console.log(`Loaded ${result.data.length} rows`);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
  };

  return (
  <input
    type="file"
    accept=".csv"
    onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    }}
    disabled={isLoading}
  />
  );
}
```

---

## API Reference

### CsvUploader Component

```tsx
<CsvUploader />
```

**Props**: None (self-contained)

**Emits**: No custom events (uses internal store)

**Styling**: Tailwind CSS classes (customizable)

---

### useCsvWorker Hook

```tsx
const { parseFile, terminateWorker } = useCsvWorker();
```

**Returns**:

```tsx
{
  parseFile: (file: File) => Promise<ParseResult>;
  terminateWorker: () => void;
}
```

**Methods**:

#### `parseFile(file: File): Promise<ParseResult>`

Parses a CSV file in a Web Worker.

**Parameters**:

- `file`: File object to parse

**Returns**: Promise resolving to ParseResult

**Throws**: Error if worker fails

**Example**:

```tsx
const result = await parseFile(csvFile);
if (result.success) {
  console.log(result.data);
} else {
  console.log(result.errors);
}
```

#### `terminateWorker(): void`

Manually terminates the Web Worker. Prevents memory leaks. Usually not needed (automatic cleanup on unmount).

**Example**:

```tsx
useEffect(() => {
  return () => terminateWorker(); // Cleanup
}, []);
```

---

### useUsageDataStore Hook

```tsx
const store = useUsageDataStore();
```

**Returns**: Store object with state and actions

**State Properties**:

#### `usageData: UsageDataRow[] | null`

Array of parsed usage data rows, or `null` if no data loaded.

#### `isLoading: boolean`

`true` while parsing CSV, `false` otherwise

#### `error: string | null`

Error message if parsing failed, `null` otherwise.

#### `lastUploadDate: string | null`

ISO timestamp of last successful upload.

**Actions**:

#### `setLoading(isLoading: boolean): void`

Manually set loading state.

#### `setParseResult(result: ParseResult, fileName: string): void`

Process parse result and update store accordingly.

**Parameters**:

- `result`: Parse result from worker
- `fileName`: Name of uploaded file (for logging)

---

### validation.ts

**Path**: `src/features/data-import/domain/validation.ts`

**Responsibility**: Domain-level validation using Zod schemas.

**Main Function**:
```tsx
export const validateUsageData = (
  data: ParseResult<unknown>
): ValidationResult
```
**Process**:

1. Checks if CSV parsing was successful
2. Iterates through each parsed row
3. Validates against IngestDataRowSchema (Zod schema)
4. Separates valid rows from invalid rows
5. Captures error details and row numbers

**Types**:

```tsx
interface ValidationResult {
  validRows: IngestDataRow[];
  invalidRows: InvalidRecord[];
}

interface InvalidRecord {
  data: UsageDataRow;
  error: ZodError;
  rowNumber: number;
}
```

**Complete Implementation:**:

```tsx
import { IngestDataRowSchema } from "@/src/domain/schemas";

export const validateUsageData = (
  data: ParseResult<unknown>
): ValidationResult => {
  if (!data.success) {
    return { validRows: [], invalidRows: [] };
  }

  return data.rows.reduce<ValidationResult>(
    (acc, row, index) => {
      const parseResult = IngestDataRowSchema.safeParse(row);

      if (parseResult.success && parseResult.data) {
        acc.validRows.push(parseResult.data);
      } 
      if (parseResult.error) {
        acc.invalidRows.push({
          data: row as UsageDataRow,
          error: parseResult.error,
          rowNumber: index + 1,
        });
      }

      return acc;
    },
    { validRows: [], invalidRows: [] }
  );
};
```
**Complete Implementation:**:
```tsx
import { parseCsv } from './csvParser';
import { validateUsageData } from '../domain/validation';

const parseResult = await parseCsv(fileContent);
const validationResult = validateUsageData(parseResult);

postMessage({
  success: validationResult.validRows.length > 0,
  data: validationResult.validRows,
  errors: validationResult.invalidRows
});
```
**Benefits:**:
- Separation of concerns (Clean Architecture)
- Reusable validation logic
- Easier testing (unit test parsing and validation separately)
- Flexibility (can swap CSV parser without changing validation)

---

## Testing

### Test Coverage

| File                   | Status        | Coverage |
|------------------------|---------------|----------|
| `csvParser.ts`         | ✅ Tested     | ~90%     |
| `useUsageDataStore.ts` | ✅ Tested     | ~85%     |
| `CsvUploader.tsx`      | ❌ Not tested | 0%       |
| `useCsvWorker.ts`      | ❌ Not tested | 0%       |
| `csv.worker.ts`        | ❌ Not tested | 0%       |

### Existing Tests

**csvParser.test.ts**:

```
✓ Valid CSV with 2 rows
✓ Missing required columns
✓ Invalid pageViews (non-numeric)
✓ Negative pageViews
✓ Invalid dataTransfer
✓ Negative dataTransfer
✓ Invalid avgSessionDuration
✓ Negative avgSessionDuration
✓ Multiple validation errors
✓ Decimal values
✓ Zero values
✓ Empty date
✓ Whitespace in date
```

**useUsageDataStore.test.ts**:

```
✓ Initial state
✓ setLoading updates state
✓ clearData resets state
✓ setParseResult with success
✓ setParseResult with errors
✓ Persistence to localStorage
✓ Rehydration from localStorage
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Run specific test file
pnpm test csvParser

# Watch mode
pnpm test --watch
```

---

## Error Handling

### Error Types

#### 1. File Validation Errors

**Trigger**: Invalid file type or size

**Handled by**: CsvUploader component

**User feedback**: Red error card with message

**Examples**:

- "Please select a CSV file"
- "file size exceeds 10MB limit"

#### 2. CSV Structure Errors

**Trigger**: Missing required columns

**Handled by**: csvParser

**User feedback**: Red card with specific columns missing

**Example**:

```
Missing required columns: pageViews, dataTransfer
```

#### 3. Data Validation Errors

**Trigger**: Invalid data types or ranges

**Handled by**: csvParser

**User feedback**: Red card with list of errors (up to 10)

**Example**:

```
• Row 2: pageViews must be a valid number
• Row 3: dataTransfer cannot be negative
• Row 5: avgSessionDuration must be a valid number
```

#### 4. Worker Errors

**Trigger**: Worker crash or unexpected failure

**Handled by**: useCsvWorker hook

**User feedback**: Generic error message

**Example**:

```
An error occurred while processing the file
```

### Error Recovery

**User can**:

1. Select a different file
2. Fix the CSV and re-upload
3. Clear error state by selecting new file

**System does**:

- Clears previous errors on new file selection
- Maintains last valid data in store
- Logs errors to console for debugging

---

## Configuration

### Validation Limits

```tsx
// File size limit
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Error display limit
const MAX_ERRORS_DISPLAYED = 10;

// Required columns
const REQUIRED_COLUMNS = [
  'date',
  'pageViews',
  'dataTransfer',
  'avgSessionDuration'
];
```

### Customization

**Change file size limit**:

```tsx
// In CsvUploader.tsx
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
```

**Add new required column**:

```tsx
// In csvParser.ts
const REQUIRED_COLUMNS = [
  'date',
  'pageViews',
  'dataTransfer',
  'avgSessionDuration',
  'userId' // New column
];

// Update types.ts
export interface UsageDataRow {
  date: string;
  pageViews: number;
  dataTransfer: number;
  avgSessionDuration: number;
  userId: string; // New field
}
```

---

## Performance

### Benchmarks

| File Size | Rows     | Parse Time | UI Blocking   |
|-----------|----------|------------|---------------|
| 100KB     | ~1,000   | ~50ms      | None (Worker) |
| 1MB       | ~10,000  | ~300ms     | None (Worker) |
| 10MB      | ~100,000 | ~2s        | None (Worker) |

**Note**: Times vary by device. Web Worker ensures UI remains responsive.

### Optimization

**Current optimizations**:

- Web Worker prevents UI blocking
- Lazy worker initialization
- Automatic worker cleanup
- Partial store persistence (reduces localStorage size)
- Early validation (type/size before parsing)

---

## Changelog

**v1.0.0 - January 2026**

- Initial implementation
- CSV upload with validation
- Web Worker processing
- Zustand store with persistence
- Responsive UI
- Tests for parser and store

---

## References

- [PapaParse Documentation](https://www.papaparse.com/)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File)

