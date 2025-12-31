import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UsageDataRow, ParseResult, UsageDataState } from '../domain/types';
import { parseCsv } from '../infrastructure/csvParser';

export const useUsageDataStore = create<UsageDataState>()(
    devtools(
        persist(
            (set) => ({
                usageData: null,
                isLoading: false,
                error: null,
                lastUploadDate: null,

                uploadAndParseCsv: async (file: File) => {
                    set({ isLoading: true, error: null }, false, 'uploadAndParseCsv/start');

                    try {
                        const result: ParseResult<UsageDataRow> = await parseCsv(file);

                        if (result.success) {
                            set({
                                usageData: result?.data,
                                error: null,
                                lastUploadDate: new Date().toISOString(),
                                isLoading: false,
                            }, false, 'uploadAndParseCsv/success');
                        } else {
                            set({ usageData: null, error: result.error, isLoading: false }, false, 'uploadAndParseCsv/failure');
                        }

                        return result;
                    } catch (error) {
                        const errorResult: ParseResult<UsageDataRow> = {
                            success: false,
                            error: 'Unexpected error during parsing',
                            details: [error instanceof Error ? error.message : 'Unknown error'],
                        };

                        set({ usageData: null, error: errorResult.error, isLoading: false }, false, 'uploadAndParseCsv/error');
                        return errorResult;
                    }
                },

                clearData: () => set({ usageData: null, lastUploadDate: null, error: null }),
                setData: (data: UsageDataRow[]) => set({ usageData: data }),
            }),
            {
                name: 'usage-data-storage',
                partialize: (state) => ({
                    usageData: state.usageData,
                    lastUploadDate: state.lastUploadDate,
                }),
            }
        ),
        { name: 'UsageDataStore' }
    )
);