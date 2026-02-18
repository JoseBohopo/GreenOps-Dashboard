import { describe, expect, it } from 'vitest';
import { calculateDataInsights } from '../calculations';
import { UsageDataRow } from '../types';

describe('calculateDataInsights', () => {
  const mockData: UsageDataRow[] = [
    {
      date: '2024-01-01',
      pageViews: 1000,
      avgSessionDuration: 120,
      dataTransfer: 1048576,
    },
    {
      date: '2024-01-02', 
      pageViews: 2000,
      avgSessionDuration: 90,
      dataTransfer: 2097152,
    },
  ];

  it('should calculate correct totals', () => {
    const insights = calculateDataInsights(mockData);
    
    expect(insights.totalPageViews).toBe(3000);
    expect(insights.totalDataTransfer).toBe(3145728);
    expect(insights.totalRecords).toBe(2);
  });

  it('should calculate correct averages', () => {
    const insights = calculateDataInsights(mockData);
    
    expect(insights.avgSessionDuration).toBe(105);
  });

  it('should handle date ranges', () => {
    const insights = calculateDataInsights(mockData);
    
    expect(insights.dateRange).toEqual({
      from: '2024-01-01',
      to: '2024-01-02'
    });
  });

  it('should handle empty data', () => {
    const insights = calculateDataInsights([]);
    
    expect(insights.totalPageViews).toBe(0);
    expect(insights.totalRecords).toBe(0);
    expect(insights.dateRange).toBe(null);
  });

  it('should handle null data', () => {
    const insights = calculateDataInsights(null);
    
    expect(insights.totalPageViews).toBe(0);
    expect(insights.totalRecords).toBe(0);
  });
});