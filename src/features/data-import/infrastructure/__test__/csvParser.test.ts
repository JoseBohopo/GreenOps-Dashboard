import { describe, expect, it } from "vitest";
import { parseCsv } from "../csvParser";

describe("CSV Parser", () => {
    describe("Valid CSV", () => {
        it("should parse valid CSV correctly", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300
2023-01-02,150,4096,450`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

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
    });

    describe("Missing Columns", () => {
        it("should reject CSV with missing required columns", async () => {
            const csv = `date,pageViews
2023-01-01,100`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe("Missing required columns");
                expect(result.details?.[0]).toContain("dataTransfer");
            }
        });
    });

    describe("Invalid Values", () => {
        it("should reject non-numeric pageViews", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,abc,2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe("Validation errors in rows");
            }
        });

        it("should reject negative values", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,-2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(false);
        });

        it("should accept zero values", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,0,0,0`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data[0].pageViews).toBe(0);
            }
        });

        it("should accept decimal values", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100.5,2048.75,300.25`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data[0].pageViews).toBe(100.5);
            }
        });
    });

    describe("Edge Cases", () => {
        it("should skip invalid rows if some valid rows exist", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300
2023-01-02,invalid,4096,450
2023-01-03,200,8192,600`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(false);
        });

        it("should handle empty CSV", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toHaveLength(0);
            }
        });
    });
});