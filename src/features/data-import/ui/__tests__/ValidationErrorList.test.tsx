import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ValidationErrorList } from '../ValidationErrorList';
import { describe, expect, it } from 'vitest';

describe('ValidationErrorList', () => {
  it('renders error message', () => {
    render(
      <ValidationErrorList
        hasMissingColumns={true}
        hasInvalidRows={true}
        missingColumns={['col1', 'col2']}
        invalidRows={[{ rowNumber: 1, error: 'Invalid' }]}
        error="Test error"
      />
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
    // Use custom matcher for column text
    expect(screen.getByText((content) => content.includes('col1'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('col2'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Invalid'))).toBeInTheDocument();
  });

  it('renders only missing columns', () => {
    render(
      <ValidationErrorList
        hasMissingColumns={true}
        hasInvalidRows={false}
        missingColumns={['colA']}
        invalidRows={[]}
        error="Missing columns"
      />
    );
    expect(screen.getByText('Missing columns')).toBeInTheDocument();
    expect(screen.getByText(/Missing required column: colA/)).toBeInTheDocument();
  });

  it('renders only invalid rows', () => {
    render(
      <ValidationErrorList
        hasMissingColumns={false}
        hasInvalidRows={true}
        missingColumns={[]}
        invalidRows={[{ rowNumber: 2, error: 'Bad value' }]}
        error="Row errors"
      />
    );
    expect(screen.getByText('Row errors')).toBeInTheDocument();
    expect(screen.getByText(/Row 2: Bad value/)).toBeInTheDocument();
  });

  it('renders with no missing columns or invalid rows', () => {
    render(
      <ValidationErrorList
        hasMissingColumns={false}
        hasInvalidRows={false}
        missingColumns={[]}
        invalidRows={[]}
        error="General error"
      />
    );
    expect(screen.getByText('General error')).toBeInTheDocument();
  });
});
