import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UploadSummary } from '../UploadSummary';
import { describe, it, expect } from 'vitest';

describe('UploadSummary', () => {
  it('renders success message with green style', () => {
    render(<UploadSummary rows={5} error={undefined} isWarning={false} />);
    expect(screen.getByText(/Successfully loaded 5 rows/)).toBeInTheDocument();
    expect(screen.getByText(/Successfully loaded 5 rows/)).toHaveClass('text-green-700');
  });

  it('renders warning message with yellow style and error', () => {
    render(<UploadSummary rows={3} error={'Some rows were ignored'} isWarning={true} />);
    expect(screen.getByText(/Successfully loaded 3 rows/)).toBeInTheDocument();
    expect(screen.getByText(/Successfully loaded 3 rows/)).toHaveClass('text-yellow-700');
    expect(screen.getByText(/Some rows were ignored/)).toBeInTheDocument();
  });

  it('does not render error if not warning', () => {
    render(<UploadSummary rows={2} error={'Should not show'} isWarning={false} />);
    expect(screen.queryByText(/Should not show/)).not.toBeInTheDocument();
  });
});
