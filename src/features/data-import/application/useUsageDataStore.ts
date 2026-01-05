import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UsageDataRow, ParseResult, UsageDataState } from '../domain/types';

export const useUsageDataStore = create<UsageDataState>()(
    devtools(
        persist(
            (set) => ({
                usageData: null,
                isLoading: false,
                error: null,
                lastUploadDate: null,

                setLoading: (isLoading: boolean) => {
                    set({ isLoading }, false, isLoading ? 'parse/start' : 'parse/end');
                },

                setParseResult: (result: ParseResult<UsageDataRow>) => {
                    if (result.success) {
                        set(
                            {
                                usageData: result.data,
                                lastUploadDate: new Date().toISOString(),
                                error: null,
                                isLoading: false,
                            },
                            false,
                            'parse/success'
                        );
                    } else {
                        set(
                            {
                                usageData: null,
                                error: result.error,
                                isLoading: false,
                            },
                            false,
                            'parse/failure'
                        );
                    }
                },

                clearData: () =>
                    set({ usageData: null, lastUploadDate: null, error: null }, false, 'data/clear'),
                setData: (data: UsageDataRow[]) => set({ usageData: data }, false, 'data/set'),
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