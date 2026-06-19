import { useState, useCallback, useRef } from 'react'
import { convertFile, convertUrl, convertText } from '../lib/api'

const STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
}

export function useConvert() {
  const [status, setStatus] = useState(STATUS.IDLE)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [sourceInfo, setSourceInfo] = useState(null)
  const [isRestored, setIsRestored] = useState(false)
  const abortRef = useRef(false)

  const reset = useCallback(() => {
    setStatus(STATUS.IDLE)
    setProgress(0)
    setResult(null)
    setError(null)
    setSourceInfo(null)
    abortRef.current = false
    setIsRestored(false)
  }, [])

  const handleFile = useCallback(async (file) => {
    reset()
    setStatus(STATUS.UPLOADING)
    setSourceInfo({ type: 'file', name: file.name, size: file.size })

    // Update document title
    document.title = `Convertendo ${file.name}... — MarkItDown`

    try {
      const data = await convertFile(file, (p) => setProgress(p))
      if (abortRef.current) return
      setResult(data)
      setStatus(STATUS.SUCCESS)
      document.title = `${file.name} — MarkItDown`
    } catch (err) {
      if (abortRef.current) return
      setError(err.message)
      setStatus(STATUS.ERROR)
      document.title = 'Erro — MarkItDown'
    }
  }, [reset])

  const handleUrl = useCallback(async (url) => {
    reset()
    setStatus(STATUS.UPLOADING)
    setProgress(50)
    setSourceInfo({ type: 'url', name: url })

    document.title = `Convertendo URL... — MarkItDown`

    try {
      const data = await convertUrl(url)
      if (abortRef.current) return
      setResult(data)
      setStatus(STATUS.SUCCESS)
      setProgress(100)
      document.title = 'Conversão concluída — MarkItDown'
    } catch (err) {
      if (abortRef.current) return
      setError(err.message)
      setStatus(STATUS.ERROR)
      document.title = 'Erro — MarkItDown'
    }
  }, [reset])

  const handleText = useCallback(async (content, format) => {
    reset()
    setStatus(STATUS.UPLOADING)
    setProgress(50)
    setSourceInfo({ type: 'text', name: `Texto (${format.toUpperCase()})` })

    document.title = `Convertendo texto... — MarkItDown`

    try {
      const data = await convertText(content, format)
      if (abortRef.current) return
      setResult(data)
      setStatus(STATUS.SUCCESS)
      setProgress(100)
      document.title = 'Conversão concluída — MarkItDown'
    } catch (err) {
      if (abortRef.current) return
      setError(err.message)
      setStatus(STATUS.ERROR)
      document.title = 'Erro — MarkItDown'
    }
  }, [reset])

  const restoreResult = useCallback((data) => {
    setResult(data.result)
    setSourceInfo(data.sourceInfo)
    setStatus(STATUS.SUCCESS)
    setProgress(100)
    document.title = `${data.sourceInfo?.name || 'Resultado'} — MarkItDown`
    setIsRestored(true)
  }, [])

  return {
    status,
    progress,
    result,
    error,
    sourceInfo,
    isRestored,
    handleFile,
    handleUrl,
    handleText,
    restoreResult,
    reset,
    STATUS,
  }
}
