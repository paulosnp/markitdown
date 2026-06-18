import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="animate-fade-in border border-red-200 dark:border-red-500/20 rounded-xl bg-red-50 dark:bg-red-500/5 p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">
            Erro na conversão
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300/80 mt-1">
            {message}
          </p>

          {message?.includes('conectar') && (
            <div className="mt-4 p-3 bg-white/60 dark:bg-[#1a1a18]/60 rounded-lg border border-red-200/50 dark:border-red-500/10">
              <p className="text-xs font-medium text-brand-gray-700 dark:text-[#c8c7c0] flex items-center gap-1.5 mb-2">
                <Terminal className="w-3 h-3" />
                Como iniciar o servidor MarkItDown:
              </p>
              <code className="block text-xs font-mono text-brand-gray-900 dark:text-[#e8e7e0] bg-brand-gray-100 dark:bg-[#242422] rounded p-2">
                pip install markitdown[all]
                <br />
                markitdown --serve --port 7860
              </code>
            </div>
          )}

          <button
            onClick={onRetry}
            className="mt-4 btn-secondary text-sm"
            aria-label="Tentar novamente"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  )
}
