import { useCallback, useEffect, useRef } from 'react'
import { ParseResult, UsageDataRow } from '../domain/types'

export const useCsvWorker = () => {
    const workerRef = useRef<Worker | null>(null)

    const parseFile = useCallback((file: File): Promise<ParseResult<UsageDataRow>> => {
        return new Promise((resolve, reject) => {
            workerRef.current ??= new Worker(new URL('../infrastructure/csv.worker.ts', import.meta.url))

            const worker = workerRef.current

            const handleMessage = (event: MessageEvent<ParseResult<UsageDataRow>>) => {
                worker.removeEventListener('message', handleMessage)
                worker.removeEventListener('error', handleError)
                resolve(event.data)
            }

            const handleError = (error: ErrorEvent) => {
                worker.removeEventListener('message', handleMessage)
                worker.removeEventListener('error', handleError)
                reject(new Error(`Worker error: ${error.message}`))
            }

            worker.addEventListener('message', handleMessage)
            worker.addEventListener('error', handleError)

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
