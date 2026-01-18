import { describe, it, expect } from 'vitest';
import { validateUsageData } from '../validation';
import { ParseResult } from '../types';

describe('validateUsageData', () => {
  describe('when parse result is unsuccessful', () => {
    it('should return empty arrays for valid and invalid rows', () => {
      const parseResult: ParseResult<unknown> = {
        success: false,
        rows: [],
        error: 'Failed to parse CSV',
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toEqual([]);
      expect(result.invalidRows).toEqual([]);
    });

    it('should handle parse result with missing columns', () => {
      const parseResult: ParseResult<unknown> = {
        success: false,
        rows: [],
        missingColumns: ['date', 'pageViews'],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(0);
    });
  });

  describe('when all rows are valid', () => {
    it('should return all rows as valid', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 1000,
            dataTransfer: 50.5,
            avgSessionDuration: 120,
          },
          {
            date: '2024-01-16',
            pageViews: 1250,
            dataTransfer: 45.67,
            avgSessionDuration: 180.5,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(2);
      expect(result.invalidRows).toHaveLength(0);
      expect(result.validRows[0]).toEqual({
        date: '2024-01-15',
        pageViews: 1000,
        dataTransfer: 50.5,
        avgSessionDuration: 120,
      });
    });

    it('should handle rows with zero values', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 0,
            dataTransfer: 0,
            avgSessionDuration: 0,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(1);
      expect(result.invalidRows).toHaveLength(0);
      expect(result.validRows[0].pageViews).toBe(0);
    });

    it('should coerce string numbers to numbers', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: '1000',
            dataTransfer: '50.5',
            avgSessionDuration: '120',
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(1);
      expect(result.validRows[0].pageViews).toBe(1000);
      expect(result.validRows[0].dataTransfer).toBe(50.5);
      expect(result.validRows[0].avgSessionDuration).toBe(120);
    });

    it('should handle large decimal values', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 9999.99,
            dataTransfer: 12345.6789,
            avgSessionDuration: 999.999,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(1);
      expect(result.validRows[0].dataTransfer).toBe(12345.6789);
    });
  });

  describe('when all rows are invalid', () => {
    it('should return all rows as invalid with empty date', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '',
            pageViews: 1000,
            dataTransfer: 50.5,
            avgSessionDuration: 120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(1);
      expect(result.invalidRows[0].rowNumber).toBe(1);
      expect(result.invalidRows[0].error).toBeDefined();
    });

    it('should reject negative pageViews', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: -100,
            dataTransfer: 50.5,
            avgSessionDuration: 120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(1);
      expect(result.invalidRows[0].data.pageViews).toBe(-100);
    });

    it('should reject negative dataTransfer', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 1000,
            dataTransfer: -50.5,
            avgSessionDuration: 120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(1);
    });

    it('should reject negative avgSessionDuration', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 1000,
            dataTransfer: 50.5,
            avgSessionDuration: -120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(1);
    });

    it('should reject non-numeric pageViews', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 'not-a-number',
            dataTransfer: 50.5,
            avgSessionDuration: 120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(1);
    });

    it('should reject missing required fields', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 1000,
            // Missing dataTransfer and avgSessionDuration
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(1);
    });
  });

  describe('when rows are mixed (valid and invalid)', () => {
    it('should segregate valid and invalid rows correctly', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 1000,
            dataTransfer: 50.5,
            avgSessionDuration: 120,
          },
          {
            date: '',
            pageViews: 1250,
            dataTransfer: 45.67,
            avgSessionDuration: 180,
          },
          {
            date: '2024-01-17',
            pageViews: 1100,
            dataTransfer: 48.2,
            avgSessionDuration: 150,
          },
          {
            date: '2024-01-18',
            pageViews: -500,
            dataTransfer: 50,
            avgSessionDuration: 130,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(2);
      expect(result.invalidRows).toHaveLength(2);
      expect(result.validRows[0].date).toBe('2024-01-15');
      expect(result.validRows[1].date).toBe('2024-01-17');
    });

    it('should assign correct row numbers to invalid rows', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          { date: '2024-01-15', pageViews: 1000, dataTransfer: 50.5, avgSessionDuration: 120 },
          { date: '', pageViews: 1250, dataTransfer: 45.67, avgSessionDuration: 180 },
          { date: '2024-01-17', pageViews: 1100, dataTransfer: 48.2, avgSessionDuration: 150 },
          { date: '2024-01-18', pageViews: -500, dataTransfer: 50, avgSessionDuration: 130 },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.invalidRows[0].rowNumber).toBe(2);
      expect(result.invalidRows[1].rowNumber).toBe(4);
    });

    it('should handle multiple validation errors in same row', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '',
            pageViews: -100,
            dataTransfer: -50,
            avgSessionDuration: -120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(1);
      expect(result.invalidRows[0].error.issues.length).toBeGreaterThan(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty rows array', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toEqual([]);
      expect(result.invalidRows).toEqual([]);
    });

    it('should handle single valid row', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 1000,
            dataTransfer: 50.5,
            avgSessionDuration: 120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(1);
      expect(result.invalidRows).toHaveLength(0);
    });

    it('should handle large dataset', () => {
      const rows = Array.from({ length: 1000 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        pageViews: 1000 + i,
        dataTransfer: 50.5 + i,
        avgSessionDuration: 120 + i,
      }));

      const parseResult: ParseResult<unknown> = {
        success: true,
        rows,
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(1000);
      expect(result.invalidRows).toHaveLength(0);
    });

    it('should preserve original data structure in invalid records', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: -100,
            dataTransfer: 50.5,
            avgSessionDuration: 120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.invalidRows[0].data).toEqual({
        date: '2024-01-15',
        pageViews: -100,
        dataTransfer: 50.5,
        avgSessionDuration: 120,
      });
    });

    it('should handle whitespace in date field', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '  2024-01-15  ',
            pageViews: 1000,
            dataTransfer: 50.5,
            avgSessionDuration: 120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(1);
      expect(result.validRows[0].date).toBe('  2024-01-15  ');
    });

    it('should handle extra unknown fields', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 1000,
            dataTransfer: 50.5,
            avgSessionDuration: 120,
            extraField: 'should be ignored',
            anotherField: 123,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(1);
      expect(result.validRows[0]).not.toHaveProperty('extraField');
      expect(result.validRows[0]).not.toHaveProperty('anotherField');
    });
  });

  describe('Zod error capture', () => {
    it('should capture ZodError for invalid rows', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '',
            pageViews: 1000,
            dataTransfer: 50.5,
            avgSessionDuration: 120,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.invalidRows[0].error).toBeDefined();
      expect(result.invalidRows[0].error.issues).toBeDefined();
      expect(result.invalidRows[0].error.issues[0].message).toContain('empty');
    });

    it('should capture multiple issues in ZodError', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '',
            pageViews: -100,
            dataTransfer: 'invalid',
            avgSessionDuration: -50,
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.invalidRows[0].error.issues.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('type coercion', () => {
    it('should coerce valid string numbers', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: '1000',
            dataTransfer: '50.5',
            avgSessionDuration: '120',
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(1);
      expect(typeof result.validRows[0].pageViews).toBe('number');
      expect(typeof result.validRows[0].dataTransfer).toBe('number');
      expect(typeof result.validRows[0].avgSessionDuration).toBe('number');
    });

    it('should fail coercion for invalid strings', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: 'abc',
            dataTransfer: '50.5',
            avgSessionDuration: '120',
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(0);
      expect(result.invalidRows).toHaveLength(1);
    });

    it('should handle numeric strings with spaces', () => {
      const parseResult: ParseResult<unknown> = {
        success: true,
        rows: [
          {
            date: '2024-01-15',
            pageViews: ' 1000 ',
            dataTransfer: ' 50.5 ',
            avgSessionDuration: ' 120 ',
          },
        ],
      };

      const result = validateUsageData(parseResult);

      expect(result.validRows).toHaveLength(1);
      expect(result.validRows[0].pageViews).toBe(1000);
    });
  });
});