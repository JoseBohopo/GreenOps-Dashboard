import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricCard } from '../MetricCard';

describe('MetricCard', () => {
  it('renders title, value, and subtitle', () => {
    render(
      <MetricCard title="Test Title" value={123} subtitle="Test Subtitle" />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders icon if provided', () => {
    render(
      <MetricCard title="Icon Test" value={42} icon={<span data-testid="icon">🌟</span>} />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
