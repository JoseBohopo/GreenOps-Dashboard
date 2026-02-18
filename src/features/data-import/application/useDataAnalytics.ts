'use client';
import { DataInsights } from "@/src/shared/types";
import { useUsageDataStore } from "./useUsageDataStore";
import { calculateDataInsights } from "../domain/calculations";

export const useDataInsights = (): DataInsights => {
    const { usageData } = useUsageDataStore();
    return calculateDataInsights(usageData);
};