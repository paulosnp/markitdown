import { useState, useCallback } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

const FORMATS = [
  { value: 'html', label: 'HTML' },
  { value: 'rst', label: 'reStructuredText' },
  { value: 'latex', label: 'LaTeX' },
  { value: 'csv', label: 'CSV' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'plain', label: 'Texto Puro' },
]

export default function TextInput({ onSubmit, status }) {
  const [content, setContent] = useState('')
  const [format, setFormat] = useState('html')

  const canSubmit = content.trim().length > 0 && status !== 'uploading'

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (canSubmit) {
      onSubmit(content, format)
    }
  }, [content, format, canSubmit, onSubmit])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-brand-gray-700 dark:text-[#c8c7c0]">
          Formato de entrada
        </label>
        <div className="relative">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="input-field appearance-none pr-10 cursor-pointer"
            aria-label="Formato de entrada"
          >
            {FORMATS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-brand-gray-700 dark:text-[#c8c7c0]">
            Conteúdo
          </label>
          <span className="text-xs text-brand-gray-400 dark:text-[#888880]">
            {content.length} caracteres
          </span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Cole seu conteúdo ${FORMATS.find(f => f.value === format)?.label || ''} aqui...`}
          className="input-field min-h-[200px] max-h-[400px] resize-y font-mono text-sm leading-relaxed"
          aria-label="Conteúdo para converter"
          disabled={status === 'uploading'}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="btn-primary w-full"
        aria-label="Converter texto"
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
