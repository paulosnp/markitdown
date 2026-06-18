import { useState, useCallback } from 'react'
import { Globe, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

function isValidUrl(string) {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function UrlInput({ onSubmit, status }) {
  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = url.length === 0 || isValidUrl(url)
  const canSubmit = url.length > 0 && isValid && status !== 'uploading'

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (canSubmit) {
      onSubmit(url)
    }
  }, [url, canSubmit, onSubmit])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-brand-gray-700 dark:text-[#c8c7c0]">
          URL do documento
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-400 dark:text-[#666660]">
            <Globe className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setTouched(true) }}
            onBlur={() => setTouched(true)}
            placeholder="https://exemplo.com/documento.pdf"
            className="input-field pl-10 pr-10"
            aria-label="URL para converter"
            aria-invalid={touched && !isValid}
            disabled={status === 'uploading'}
          />
          {touched && url.length > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          )}
        </div>
        {touched && !isValid && url.length > 0 && (
          <p className="text-xs text-red-500 flex items-center gap-1 animate-fade-in">
            <AlertCircle className="w-3 h-3" />
            URL inválida. Use o formato https://...
          </p>
        )}
      </div>

      <div className="text-xs text-brand-gray-400 dark:text-[#888880] space-y-1">
        <p>Suporta páginas web, imagens remotas e documentos públicos.</p>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="btn-primary w-full"
        aria-label="Converter URL"
      >
        {status === 'uploading' ? (
          <>Convertendo...</>
        ) : (
          <>
            Converter
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  )
}
