import { useState, useMemo } from 'react'
import { Code, Eye, Copy, Download, RotateCcw, CheckCircle2, Hash } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import clsx from 'clsx'
import toast from 'react-hot-toast'

export default function ResultPanel({ result, sourceInfo, onReset }) {
  const [viewMode, setViewMode] = useState('preview')
  const [copied, setCopied] = useState(false)

  const markdown = result?.markdown || ''

  const stats = useMemo(() => {
    const words = markdown.trim().split(/\s+/).filter(Boolean).length
    const chars = markdown.length
    const lines = markdown.split('\n').length
    return { words, chars, lines }
  }, [markdown])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      toast.success('Markdown copiado!', {
        style: {
          background: '#2C2C2A',
          color: '#FAFAF9',
          borderRadius: '8px',
          fontSize: '13px',
        },
        iconTheme: { primary: '#D4541B', secondary: '#fff' },
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Falha ao copiar')
    }
  }

  const handleDownload = () => {
    const name = sourceInfo?.name?.replace(/\.[^.]+$/, '') || 'documento'
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Arquivo baixado!', {
      style: {
        background: '#2C2C2A',
        color: '#FAFAF9',
        borderRadius: '8px',
        fontSize: '13px',
      },
      iconTheme: { primary: '#D4541B', secondary: '#fff' },
    })
  }

  return (
    <div className="animate-fade-in border border-brand-gray-200 dark:border-[#3a3a38] rounded-xl bg-white dark:bg-[#1a1a18] overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-brand-gray-200 dark:border-[#3a3a38] bg-brand-gray-50 dark:bg-[#242422]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('raw')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
              viewMode === 'raw'
                ? 'bg-brand-orange text-white shadow-sm'
                : 'text-brand-gray-700 dark:text-[#a0a098] hover:bg-brand-gray-200 dark:hover:bg-[#3a3a38]'
            )}
            aria-label="Ver código Markdown"
          >
            <Code className="w-3.5 h-3.5" />
            Raw
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
              viewMode === 'preview'
                ? 'bg-brand-orange text-white shadow-sm'
                : 'text-brand-gray-700 dark:text-[#a0a098] hover:bg-brand-gray-200 dark:hover:bg-[#3a3a38]'
            )}
            aria-label="Ver preview renderizado"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="btn-ghost text-xs"
            aria-label="Copiar Markdown"
            title="Copiar Markdown"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Copiar</span>
          </button>
          <button
            onClick={handleDownload}
            className="btn-ghost text-xs"
            aria-label="Baixar arquivo .md"
            title="Baixar .md"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar</span>
          </button>
          <button
            onClick={onReset}
            className="btn-ghost text-xs"
            aria-label="Nova conversão"
            title="Nova conversão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5 min-h-[300px] max-h-[600px]">
        {viewMode === 'raw' ? (
          <pre className="text-sm font-mono text-brand-gray-900 dark:text-[#e8e7e0] whitespace-pre-wrap break-words leading-relaxed">
            {markdown}
          </pre>
        ) : (
          <div className="markdown-preview dark:text-[#e8e7e0]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        borderRadius: '8px',
                        fontSize: '12px',
                        margin: '12px 0',
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-brand-gray-200 dark:border-[#3a3a38] bg-brand-gray-50 dark:bg-[#242422]">
        <div className="flex items-center gap-1.5 text-xs text-brand-gray-400 dark:text-[#888880]">
          <Hash className="w-3 h-3" />
          {stats.words} palavras
        </div>
        <div className="text-xs text-brand-gray-400 dark:text-[#888880]">
          {stats.chars} caracteres
        </div>
        <div className="text-xs text-brand-gray-400 dark:text-[#888880]">
          {stats.lines} linhas
        </div>
      </div>
    </div>
  )
}
