import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileInput } from '../FileInput';

describe('FileInput', () => {
  it('renders label and button', () => {
    render(
      <FileInput selectedFile={null} handleFileChange={() => {}} hasData={false} />
    );
    expect(screen.getByText('Select File')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows file name when selected', () => {
    render(
      <FileInput selectedFile={{ name: 'test.csv' }} handleFileChange={() => {}} hasData={false} />
    );
    // There are two elements with 'test.csv', so check both
    const fileNameElements = screen.getAllByText('test.csv');
    expect(fileNameElements.length).toBeGreaterThan(1);
    fileNameElements.forEach(el => expect(el).toBeInTheDocument());
  });

  it('shows error message', () => {
    render(
      <FileInput selectedFile={null} handleFileChange={() => {}} fileError="Error!" hasData={false} />
    );
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });
});
