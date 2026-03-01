import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CsvUploader } from '../CsvUploader';
import { describe, expect, it, vi } from 'vitest';

const parseFileMock = vi.fn(async () => ({ success: true, rows: [{ id: 1 }], error: null }));
const setParseResultMock = vi.fn();


// Mock hooks and child components
vi.mock('../../application/useUsageDataStore', () => ({
  useUsageDataStore: () => ({
    usageData: [],
    isLoading: false,
    error: null,
    missingColumns: [],
    invalidRows: [],
    setLoading: vi.fn(),
    clearData: vi.fn(),
    setParseResult: setParseResultMock,
  }),
}));
vi.mock('../../application/useCsvWorker', () => ({
  useCsvWorker: () => ({
    parseFile: parseFileMock,
    terminateWorker: vi.fn(),
  }),
}));

describe('CsvUploader', () => {
  it('renders uploader title', () => {
    render(<CsvUploader />);
    expect(screen.getByText(/Load Usage Data CSV/i)).toBeInTheDocument();
  });

  it('shows file error for invalid file type', async () => {
    render(<CsvUploader />);
    const input = screen.getByLabelText(/CSV file input/i);
    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByText(/Please select a valid CSV file/i)).toBeInTheDocument();
  });

  it('shows file error for file too large', async () => {
    render(<CsvUploader />);
    const input = screen.getByLabelText(/CSV file input/i);
    const file = new File(['a'.repeat(11 * 1024 * 1024)], 'big.csv', { type: 'text/csv' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 });
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByText(/File size exceeds the maximum limit/i)).toBeInTheDocument();
  });

  it('enables Load File button when valid file selected', async () => {
    render(<CsvUploader />);
    const input = screen.getByLabelText(/CSV file input/i);
    const file = new File(['dummy'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByText(/Load File/i)).not.toBeDisabled();
  });

  it('calls parseFile and setParseResult on upload', async () => {
    render(<CsvUploader />);
    const input = screen.getByLabelText(/CSV file input/i);
    const file = new File(['dummy'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });
    const button = await screen.findByText(/Load File/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(parseFileMock).toHaveBeenCalled();
      expect(setParseResultMock).toHaveBeenCalled();
    });
  });

  it('disables Load File button when no file selected', () => {
    render(<CsvUploader />);
    expect(screen.getByText(/Load File/i)).toBeDisabled();
  });

  it('disables Clear Data button when no data', () => {
    render(<CsvUploader />);
    expect(screen.getByRole('button', { name: /Clear uploaded data/i })).toBeDisabled();
  });
});
