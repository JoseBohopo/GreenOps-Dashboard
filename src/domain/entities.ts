/**
 * Domain entities for GreenOps Dashboard
 * 
 * Note: UsageRecord is defined in schemas.ts (validated with Zod)
 * These entities are for types that don't need runtime validation yet
 */

export type { UsageRecordValidated } from './schemas';

export interface Report {
    id: string;
    name: string;
    description?: string;
    periodStart: Date;
    periodEnd: Date;

    totalEnergyKwh: number;
    totalCostUsd: number;
    totalEmissionsKg: number;
    recordCount: number;

    status: 'draft' | 'published' | 'archived';
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * AI-generated insight about usage patterns
 */

export interface Insight {
    id: string;
    reportId: string;
    type: 'cost-spike' | 'efficiency-drop' | 'emission-alert' | 'optimization-opportunity';
    severity: 'low' | 'medium' | 'high' | 'critical';

    title: string;
    description: string;
    affectedResources: string[];

    estimatedSavingsUsd?: number;
    estimatedEmissionReductionKg?: number;

    createdAt: Date;
}

export interface Recommendation {
    id: string;
    insightId: string;
    title: string;
    description: string;

    priority: 'low' | 'medium' | 'high';
    effort: 'small' | 'medium' | 'large';
    category: 'cost' | 'efficiency' | 'sustainability' | 'performance';

    expectedSavingsUsd?: number;
    expectedEmissionReductionKg?: number;
    estimatedImplementationDays?: number;

    status: 'pending' | 'in-progress' | 'completed' | 'dismissed';
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
}