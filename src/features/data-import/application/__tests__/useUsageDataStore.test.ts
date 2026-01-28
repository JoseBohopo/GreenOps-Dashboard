import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUsageDataStore } from "../useUsageDataStore";
import { ParseResult, UsageDataRow } from "../../domain/types";

const resetStore = () => {
    useUsageDataStore.setState({
        usageData: null,
        isLoading: false,
        error: null,
        lastUploadDate: null,
    });
};

describe("usageDataStore", () => {
    beforeEach(() => {
        resetStore();
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        resetStore();
        localStorage.clear();
    });

    describe("Store Actions", () => {
        it("test initial state usage data", () => {
            const result = useUsageDataStore.getState();

            expect(result.usageData).toBeNull();
            expect(result.isLoading).toBe(false);
            expect(result.error).toBeNull();
            expect(result.lastUploadDate).toBeNull();
        });

        it("setLoading should update isLoading state", () => {
            useUsageDataStore.getState().setLoading(true);
            expect(useUsageDataStore.getState().isLoading).toBe(true);
        });

        it("should reset state on clearData", () => {
            const { setData, clearData } = useUsageDataStore.getState();
            setData([
                {
                    date: "2023-01-01",
                    pageViews: 100,
                    dataTransfer: 2048,
                    avgSessionDuration: 300,
                },
            ]);
            useUsageDataStore.setState({ lastUploadDate: new Date().toISOString() });
            clearData();
            const result = useUsageDataStore.getState();

            expect(result.usageData).toBeNull();
            expect(result.isLoading).toBe(false);
            expect(result.error).toBeNull();
            expect(result.lastUploadDate).toBeNull();
        });

        it("setParseResult should update state on success", () => {
            const mockData: UsageDataRow[] = [
                {
                    date: "2023-01-01",
                    pageViews: 100,
                    dataTransfer: 2048,
                    avgSessionDuration: 300,
                },
            ];

            const successResult: ParseResult<UsageDataRow> = {
                success: true,
                rows: mockData,
                rowCount: 1,
            };

            const { setParseResult } = useUsageDataStore.getState();
            setParseResult(successResult);
            const state = useUsageDataStore.getState();

            expect(state.usageData).toHaveLength(1);
            expect(state.usageData?.[0]).toEqual(mockData[0]);
            expect(state.error).toBeNull();
            expect(state.lastUploadDate).not.toBeNull();
            expect(state.isLoading).toBe(false);
        });

        it("setParseResult should update state on error", async () => {
            const errorResult: ParseResult<UsageDataRow> = {
                success: false,
                rows: [],
                error: "Invalid CSV",
                missingColumns: ["Missing columns"],
            };

            useUsageDataStore.getState().setParseResult(errorResult);

            const state = useUsageDataStore.getState();
            expect(state.usageData).toEqual([]);
            expect(state.error).toBe("Invalid CSV");
            expect(state.isLoading).toBe(false);
        });
    });

    describe("Persistence", () => {
        it("should persist state to localStorage", async () => {
            const mockData: UsageDataRow[] = [
                { date: "2023-01-01", pageViews: 100, dataTransfer: 2048, avgSessionDuration: 300 },
            ];
            const successResult: ParseResult<UsageDataRow> = {
                success: true,
                rows: mockData,
                rowCount: 1,
            };

            useUsageDataStore.getState().setParseResult(successResult);

            await new Promise((resolve) => setTimeout(resolve, 100));

            const storedItem = localStorage.getItem("usage-data-storage");
            expect(storedItem).not.toBeNull();
            if (storedItem) {
                const persistedState = JSON.parse(storedItem);
                expect(persistedState.state.usageData).toEqual(mockData);
            }
        });

        it("should rehydrate state from localStorage", async () => {
            const mockData: UsageDataRow[] = [
                { date: "2023-01-01", pageViews: 100, dataTransfer: 2048, avgSessionDuration: 300 },
            ];
            const persistedState = {
                state: {
                    usageData: mockData,
                    lastUploadDate: new Date().toISOString(),
                },
                version: 0,
            };
            localStorage.setItem("usage-data-storage", JSON.stringify(persistedState));

            await useUsageDataStore.persist.rehydrate();

            const state = useUsageDataStore.getState();
            expect(state.usageData).toEqual(mockData);
        });
    });
});
