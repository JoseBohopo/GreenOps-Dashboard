import { useCallback, useEffect, useRef } from 'react'
import { ParseResult, UsageDataRow } from '../domain/types'

export const useCsvWorker = () => {
    const workerRef = useRef<Worker | null>(null)

    const parseFile = useCallback((file: File): Promise<ParseResult<UsageDataRow>> => {
        return new Promise((resolve, reject) => {
            workerRef.current ??= new Worker(new URL('../infrastructure/csv.worker.ts', import.meta.url))

            const worker = workerRef.current

            const handleResponse = (event:  MessageEvent<ParseResult<UsageDataRow>> | ErrorEvent) => {
                worker.removeEventListener('message', handleResponse)
                worker.removeEventListener('error', handleResponse)

                if(event instanceof ErrorEvent) {
                    reject(new Error(`Worker error: ${event.message}`))
                } else {
                    resolve(event.data)
                }
            }

            worker.addEventListener('message', handleResponse)
            worker.addEventListener('error', handleResponse)

            worker.postMessage({ file })
        })
    }, [])

    const terminateWorker = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate()
            workerRef.current = null
        }
    }, [])

    useEffect(() => {
        return () => {
            terminateWorker()
        }
    }, [terminateWorker])

    return { parseFile, terminateWorker }
}
