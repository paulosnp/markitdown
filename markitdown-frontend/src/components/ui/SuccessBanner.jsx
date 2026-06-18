import { CheckCircle2 } from 'lucide-react'

export default function SuccessBanner({ sourceInfo }) {
  return (
    <div className="animate-fade-in flex items-center gap-3 p-3 bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20 rounded-xl">
      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-green-800 dark:text-green-300">
          Conversão concluída
        </p>
        {sourceInfo?.name && (
          <p className="text-xs text-green-700/70 dark:text-green-400/60 mt-0.5">
            {sourceInfo.name}
          </p>
        )}
      </div>
    </div>
  )
}
