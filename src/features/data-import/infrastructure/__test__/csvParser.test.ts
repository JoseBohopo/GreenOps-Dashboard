import { describe, expect, it } from "vitest";
import { parseCsv } from "../csvParser";

describe("csvParser - Structural CSV Parsing", () => {
    describe("Valid CSV Structure", () => {
        it("should parse valid CSV with all required columns", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300
2023-01-02,150,4096,450`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.rows).toHaveLength(2);
                expect(result.rowCount).toBe(2);
                expect(result.rows[0]).toEqual({
                    date: "2023-01-01",
                    pageViews: "100",
                    dataTransfer: "2048",
                    avgSessionDuration: "300",
                });
            }
        });

        it("should parse CSV with multiple rows", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300
2023-01-02,150,4096,450
2023-01-03,200,8192,600`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.rows).toHaveLength(3);
            }
        });

        it("should return raw strings without type conversion", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                // Parser returns strings, validation.ts handles type coercion
                expect(typeof (result.rows[0] as { pageViews: string }).pageViews).toBe("string");
                expect(typeof (result.rows[0] as { dataTransfer: string }).dataTransfer).toBe("string");
                expect(typeof (result.rows[0] as { avgSessionDuration: string }).avgSessionDuration).toBe("string");
            }
        });
    });

    describe("Missing Required Columns", () => {
        it("should reject CSV with missing dataTransfer column", async () => {
            const csv = `date,pageViews,avgSessionDuration
2023-01-01,100,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe("Missing required columns");
                expect(result.missingColumns).toContain("dataTransfer");
            }
        });

        it("should reject CSV with missing multiple columns", async () => {
            const csv = `date,pageViews
2023-01-01,100`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe("Missing required columns");
                expect(result.missingColumns).toContain("dataTransfer");
                expect(result.missingColumns).toContain("avgSessionDuration");
                expect(result.missingColumns).toHaveLength(2);
            }
        });

        it("should reject CSV with no columns", async () => {
            const csv = `100,2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe("Missing required columns");
                expect(result.missingColumns).toHaveLength(4);
            }
        });

        it("should reject CSV with wrong column names", async () => {
            const csv = `fecha,vistas,transferencia,duracion
2023-01-01,100,2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.missingColumns).toHaveLength(4);
            }
        });
    });

    describe("Invalid Data (Parser accepts, Validation layer rejects)", () => {
        it("should successfully parse CSV with non-numeric values", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,abc,2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            // Parser succeeds - it only checks structure
            expect(result.success).toBe(true);
            if (result.success) {
                expect((result.rows[0] as { pageViews: string }).pageViews).toBe("abc");
            }
        });

        it("should successfully parse CSV with negative values", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,-2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            // Parser succeeds - validation happens in validation.ts
            expect(result.success).toBe(true);
            if (result.success) {
                expect((result.rows[0] as { dataTransfer: string }).dataTransfer).toBe("-2048");
            }
        });

        it("should successfully parse CSV with empty values", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
,100,2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            // Parser succeeds - empty strings are valid at parse level
            expect(result.success).toBe(true);
            if (result.success) {
                expect((result.rows[0] as { date: string }).date).toBe("");
                
            }
        });

        it("should successfully parse CSV with mixed valid/invalid data", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300
2023-01-02,invalid,4096,450
2023-01-03,200,not-a-number,600`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            // Parser succeeds - all rows have correct structure
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.rows).toHaveLength(3);
            }
        });
    });

    describe("Numeric Values (stored as strings)", () => {
        it("should parse zero values as strings", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,0,0,0`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect((result.rows[0] as { pageViews: string }).pageViews).toBe("0");
                expect((result.rows[0] as { dataTransfer: string }).dataTransfer).toBe("0");
                expect((result.rows[0] as { avgSessionDuration: string }).avgSessionDuration).toBe("0");

            }
        });

        it("should parse decimal values as strings", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100.5,2048.75,300.25`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect((result.rows[0] as { pageViews: string }).pageViews).toBe("100.5");
                expect((result.rows[0] as { dataTransfer: string }).dataTransfer).toBe("2048.75");
                expect((result.rows[0] as { avgSessionDuration: string }).avgSessionDuration).toBe("300.25");
            }
        });

        it("should parse large numbers as strings", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,9999999,8888888,7777777`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect((result.rows[0] as { pageViews: string }).pageViews).toBe("9999999");
            }
        });
    });

    describe("Edge Cases", () => {
        it("should handle empty CSV (only headers)", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.rows).toHaveLength(0);
                expect(result.rowCount).toBe(0);
            }
        });

        it("should skip empty lines", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300

2023-01-02,150,4096,450`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.rows).toHaveLength(2);
            }
        });

        it("should handle CSV with extra columns", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration,extraColumn
2023-01-01,100,2048,300,ignored`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success && result.rows) {
                expect(result.rows[0]).toHaveProperty("extraColumn");
                expect((result.rows[0] as { extraColumn: string }).extraColumn ).toBe("ignored");
            }
        });

        it("should handle CSV with columns in different order", async () => {
            const csv = `avgSessionDuration,date,dataTransfer,pageViews
300,2023-01-01,2048,100`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success && result.rows) {
                expect((result.rows[0] as { date: string }).date ).toBe("2023-01-01");
                expect((result.rows[0] as { pageViews: string }).pageViews).toBe("100");
            }
        });

        it("should handle CSV with whitespace in values", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
 2023-01-01 , 100 , 2048 , 300 `;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                // PapaParse trims by default
                expect((result.rows[0] as { date: string }).date).not.toBe("2023-01-01");
                expect((result.rows[0] as { pageViews: string }).pageViews).not.toBe("100");
            }
        });

        it("should handle single row CSV", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.rows).toHaveLength(1);
                expect(result.rowCount).toBe(1);
            }
        });

        it("should handle CSV with quoted values", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
"2023-01-01","100","2048","300"`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result.success).toBe(true);
            if (result.success && result.rows) {
                expect((result.rows[0] as { date: string }).date).toBe("2023-01-01");
            }
        });
    });

    describe("PapaParse Error Handling", () => {
        it("should handle parsing errors gracefully", async () => {
            // Create a file that will cause a parsing error
            const invalidContent = new Uint8Array([0xFF, 0xFE, 0xFD]);
            const blob = new Blob([invalidContent], { type: "text/csv" });
            const file = new File([blob], "test.csv", { type: "text/csv" });

            const result = await parseCsv(file);

            // Parser should handle error without throwing
            expect(result).toBeDefined();
        });
    });

    describe("Return Value Structure", () => {
        it("should return correct structure for success", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result).toHaveProperty("success");
            expect(result).toHaveProperty("rows");
            if (result.success) {
                expect(result).toHaveProperty("rowCount");
                expect(result).not.toHaveProperty("error");
                expect(result).not.toHaveProperty("missingColumns");
            }
        });

        it("should return correct structure for column validation failure", async () => {
            const csv = `date,pageViews
2023-01-01,100`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result).toHaveProperty("success");
            expect(result).toHaveProperty("rows");
            if (!result.success) {
                expect(result).toHaveProperty("error");
                expect(result).toHaveProperty("missingColumns");
                expect(result.error).toBe("Missing required columns");
                expect(Array.isArray(result.missingColumns)).toBe(true);
            }
        });

        it("should always include rows array", async () => {
            const csv = `date,pageViews
2023-01-01,100`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const result = await parseCsv(file);

            expect(result).toHaveProperty("rows");
            expect(Array.isArray(result.rows)).toBe(true);
        });
    });

    describe("Integration Notes", () => {
        it("should demonstrate parser + validation workflow", async () => {
            const csv = `date,pageViews,dataTransfer,avgSessionDuration
2023-01-01,100,2048,300
2023-01-02,invalid,4096,450`;

            const file = new File([csv], "test.csv", { type: "text/csv" });
            const parseResult = await parseCsv(file);

            expect(parseResult.success).toBe(true);

            if (parseResult.success && parseResult.rows) {
                expect(parseResult.rows).toHaveLength(2);
                expect((parseResult.rows[1] as { pageViews: string }).pageViews).toBe("invalid");
            }
        });
    });
});