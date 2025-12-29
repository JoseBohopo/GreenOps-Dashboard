import { z } from 'zod';

/**
 * Zod schema for UsageRecord validation
 * Ensures data integrity at runtime
 */

export const UsageRecordSchema = z.object({
    id: z.string().uuid(),

    resourceId: z.string().min(1, 'Resource ID cannot be empty'),
    resourceType: z.enum(['compute', 'storage', 'network', 'database'], {
        error: () => ({ message: 'Invalid resource type' }),
    }),

    timestamp: z.coerce.date(),
    region: z.string().min(1, 'Region cannot be empty'),

    energyUsageKwh: z.number().nonnegative('Energy usage must be non-negative'),
    costUsd: z.number().nonnegative('Cost must be non-negative'),
    carbonEmissionsKg: z.number().nonnegative('Carbon emissions must be non-negative'),

    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().default(() => new Date()),

})

export type UsageRecordValidated = z.infer<typeof UsageRecordSchema>;

export const CreateUsageRecordSchema = UsageRecordSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
})

export type CrateUsageRecordInput = z.infer<typeof CreateUsageRecordSchema>;