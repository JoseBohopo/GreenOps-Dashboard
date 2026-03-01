import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileInfoSummary } from '../FileInfoSummary';
import { describe, expect, it } from 'vitest';

describe('FileInfoSummary', () => {
  it('renders file name and size', () => {
    render(
      <FileInfoSummary selectedFile={{ name: 'data.csv', size: 2048 }} />
    );
    expect(screen.getByText('data.csv')).toBeInTheDocument();
    expect(screen.getByText(/Size:/)).toBeInTheDocument();
    expect(screen.getByText(/2.00 KB/)).toBeInTheDocument();
  });
});
