import { describe, expect, it } from "vitest";
import { useUsageDataStore } from "../useUsageDataStore";

describe("usageDataStore", () => {
    it("test initial state usage data", () => {
        const result = useUsageDataStore.getState();
        expect(result.usageData).toBeNull();
        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
        expect(result.lastUploadDate).toBeNull();
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

    it("should set usage data on setData", () => {
        const { setData } = useUsageDataStore.getState();
        const csvData = {
            date: "2023-01-01",
            pageViews: 100,
            dataTransfer: 2048,
            avgSessionDuration: 300,
        };
        setData([csvData]);
        const result = useUsageDataStore.getState();
        expect(result.usageData).toHaveLength(1);
        expect(result.usageData?.[0]).toEqual(csvData);
    });

    it("should upload and parse valid CSV file", async () => {
        const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300
2023-01-02,150,4096,450`;
        const file = new File([csv], "test.csv", { type: "text/csv" });
        const { uploadAndParseCsv } = useUsageDataStore.getState();
        const result = await uploadAndParseCsv(file);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toHaveLength(2);
            expect(result.data[0]).toEqual({
                date: "2023-01-01",
                pageViews: 100,
                dataTransfer: 2048,
                avgSessionDuration: 300,
            });
        }
    });

    it("should handle upload and parse invalid CSV file", async () => {
        const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,abc,2048,300`;
        const file = new File([csv], "test.csv", { type: "text/csv" });
        const { uploadAndParseCsv } = useUsageDataStore.getState();
        const result = await uploadAndParseCsv(file);
        expect(result.success).toBe(false);
    });

    it("should handle upload and parse CSV with missing columns", async () => {
        const csv = `date,pageViews
2023-01-01,100`;
        const file = new File([csv], "test.csv", { type: "text/csv" });
        const { uploadAndParseCsv } = useUsageDataStore.getState();
        const result = await uploadAndParseCsv(file);
        expect(result.success).toBe(false);
    });

    it("should handle unexpected errors during upload and parse", async () => {
        const invalidFile: File = {} as File;
        const { uploadAndParseCsv } = useUsageDataStore.getState();
        const result = await uploadAndParseCsv(invalidFile);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe("Unexpected error during parsing");
        }
    });
});
