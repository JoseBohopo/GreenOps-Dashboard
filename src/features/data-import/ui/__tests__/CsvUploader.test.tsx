import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CsvUploader } from '../CsvUploader';

describe('CsvUploader', () => {
  it('renders uploader title', () => {
    render(<CsvUploader />);
    expect(screen.getByText(/Load Usage Data CSV/i)).toBeInTheDocument();
  });
});
