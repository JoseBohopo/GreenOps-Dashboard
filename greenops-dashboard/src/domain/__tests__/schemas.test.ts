import { describe, it, expect } from 'vitest';
import { CreateUsageRecordSchema, UsageRecordSchema } from '../schemas';


describe('UsageRecordSchema', () => {
    describe('Valid cases', () => {
        it('should validate a complete valid usage record', () => {
            const validRecord = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                resourceId: 'res-123',
                resourceType: 'compute' as const,
                timestamp: new Date(),
                region: 'us-west-1',
                energyUsageKwh: 150.5,
                costUsd: 75.25,
                carbonEmissionsKg: 20.5,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const result = UsageRecordSchema.parse(validRecord);

            expect(result).toBeDefined();
            expect(result.resourceId).toBe('res-123');
            expect(result.resourceType).toBe('compute');
        })

        it('should accept all valid resource types', () => {
            const baseRecord = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                resourceId: 'res-123',
                timestamp: new Date(),
                region: 'us-west-1',
                energyUsageKwh: 100,
                costUsd: 50,
                carbonEmissionsKg: 10,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const resourceTypes = ['compute', 'storage', 'network', 'database'] as const;

            resourceTypes.forEach((type) => {
                expect(() => {
                    UsageRecordSchema.parse({ ...baseRecord, resourceType: type });
                }).not.toThrow();
            })
        })

        it('should coerce date strings to Date objects', () => {
            const record = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                resourceId: 'res-123',
                resourceType: 'storage' as const,
                timestamp: new Date().toISOString(),
                region: 'us-west-1',
                energyUsageKwh: 100,
                costUsd: 50,
                carbonEmissionsKg: 10,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            const result = UsageRecordSchema.parse(record);

            expect(result.timestamp).toBeInstanceOf(Date);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        })
    })

    describe('Invalid cases', () => {
        it('should reject negative energy usage', () => {
            const invalidRecord = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                resourceId: 'res-123',
                resourceType: 'compute' as const,
                timestamp: new Date().toISOString(),
                region: 'us-west-1',
                energyUsageKwh: -100,
                costUsd: 50,
                carbonEmissionsKg: 10,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            expect(() => UsageRecordSchema.parse(invalidRecord)).toThrow();
        })

        it('should reject negative cost', () => {
            const invalidRecord = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                resourceId: 'res-123',
                resourceType: 'compute' as const,
                timestamp: new Date().toISOString(),
                region: 'us-west-1',
                energyUsageKwh: 100,
                costUsd: -50,
                carbonEmissionsKg: 10,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            expect(() => UsageRecordSchema.parse(invalidRecord)).toThrow();
        })

        it('should reject negative carbon emissions', () => {
            const invalidRecord = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                resourceId: 'res-123',
                resourceType: 'compute' as const,
                timestamp: new Date().toISOString(),
                region: 'us-west-1',
                energyUsageKwh: 100,
                costUsd: 50,
                carbonEmissionsKg: -10,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            expect(() => UsageRecordSchema.parse(invalidRecord)).toThrow();
        })

        it('should reject invalid UUID format', () => {
            const invalidRecord = {
                id: 'invalid-uuid',
                resourceId: 'res-123',
                resourceType: 'compute' as const,
                timestamp: new Date().toISOString(),
                region: 'us-west-1',
                energyUsageKwh: 100,    
                costUsd: 50,
                carbonEmissionsKg: 10,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            expect(() => UsageRecordSchema.parse(invalidRecord)).toThrow();
        })

        it('should reject empty resource ID', () => {
            const invalidRecord = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                resourceId: '',
                resourceType: 'compute' as const,
                timestamp: new Date().toISOString(),
                region: 'us-west-1',
                energyUsageKwh: 100,
                costUsd: 50,
                carbonEmissionsKg: 10,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            expect(() => UsageRecordSchema.parse(invalidRecord)).toThrow('Resource ID cannot be empty');
        })
    })

    describe('CreateUsageRecordSchema', () => {
        it('should validate input without id, createdAt, updatedAt', () => {
            const createInput = {
            resourceId: 'vm-dev-002',
            resourceType: 'storage' as const,
            timestamp: new Date().toISOString(),
            region: 'eu-west-1',
            energyUsageKwh: 5.4,
            costUsd: 1.2,
            carbonEmissionsKg: 2.5,
            };

            const result = CreateUsageRecordSchema.parse(createInput);
            
            expect(result).toBeDefined();
            expect(result.resourceId).toBe('vm-dev-002');
            expect(result).not.toHaveProperty('id');
            expect(result).not.toHaveProperty('createdAt');
            expect(result).not.toHaveProperty('updatedAt');
        });
    });
})