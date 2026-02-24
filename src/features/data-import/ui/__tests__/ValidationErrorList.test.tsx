import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ValidationErrorList } from '../ValidationErrorList';

describe('ValidationErrorList', () => {
  it('renders error message', () => {
    render(
      <ValidationErrorList
        hasMissingColumns={true}
        hasInvalidRows={true}
        missingColumns={['col1', 'col2']}
        invalidRows={[{ row: 1, error: 'Invalid' }]}
        error="Test error"
      />
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
    // Use custom matcher for column text
    expect(screen.getByText((content) => content.includes('col1'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('col2'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Invalid'))).toBeInTheDocument();
  });
});
