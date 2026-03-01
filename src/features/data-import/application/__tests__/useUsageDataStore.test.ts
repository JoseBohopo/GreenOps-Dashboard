import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUsageDataStore } from "../useUsageDataStore";
import { ParseResult, UsageDataRow } from "../../domain/types";
import { act } from "react";

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

    describe("useUsageDataStore", () => {
        it("initializes with default state", () => {
            const state = useUsageDataStore.getState();
            expect(state.usageData).toBeNull();
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
            expect(state.lastUploadDate).toBeNull();
            expect(state.missingColumns).toEqual(["Missing columns"]);
            expect(state.invalidRows).toBeUndefined();
        });

        it("sets loading state", () => {
            act(() => useUsageDataStore.getState().setLoading(true));
            expect(useUsageDataStore.getState().isLoading).toBe(true);
            act(() => useUsageDataStore.getState().setLoading(false));
            expect(useUsageDataStore.getState().isLoading).toBe(false);
        });

        it("sets parse result (success)", () => {
            const result = {
                success: true,
                rows: [{ id: 1, date: "2023-01-01", pageViews: 100, dataTransfer: 2048, avgSessionDuration: 300 }],
                error: undefined,
                invalidRows: undefined,
                missingColumns: undefined,
            };
            act(() => useUsageDataStore.getState().setParseResult(result));
            expect(useUsageDataStore.getState().usageData).toEqual(result.rows);
            expect(useUsageDataStore.getState().error).toBeNull();
            expect(useUsageDataStore.getState().invalidRows).toBeUndefined();
            expect(useUsageDataStore.getState().isLoading).toBe(false);
        });

        it("sets parse result (failure)", () => {
            const result = {
                success: false,
                rows: [],
                error: "Parse error",
                invalidRows: [{ rowNumber: 2, error: "Bad value" }],
                missingColumns: ["colA"],
            };
            act(() => useUsageDataStore.getState().setParseResult(result));
            expect(useUsageDataStore.getState().usageData).toEqual([]);
            expect(useUsageDataStore.getState().error).toBe("Parse error");
            expect(useUsageDataStore.getState().missingColumns).toEqual(["colA"]);
            expect(useUsageDataStore.getState().invalidRows?.[0].rowNumber).toBe(2);
            expect(useUsageDataStore.getState().isLoading).toBe(false);
        });

        it("clears data", () => {
            act(() => useUsageDataStore.getState().clearData());
            expect(useUsageDataStore.getState().usageData).toBeNull();
            expect(useUsageDataStore.getState().error).toBeNull();
            expect(useUsageDataStore.getState().lastUploadDate).toBeNull();
            expect(useUsageDataStore.getState().missingColumns).toBeUndefined();
            expect(useUsageDataStore.getState().invalidRows).toBeUndefined();
        });

        it("sets usage data directly", () => {
            act(() => useUsageDataStore.getState().setData([{ date: "2023-01-01", pageViews: 100, dataTransfer: 2048, avgSessionDuration: 300 }]));
            expect(useUsageDataStore.getState().usageData).toEqual([{ date: "2023-01-01", pageViews: 100, dataTransfer: 2048, avgSessionDuration: 300 }]);
        });
    });
});