import { FileText, Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header({ darkMode, onToggleDark }) {
  return (
    <header className="h-14 border-b border-brand-gray-200 dark:border-[#3a3a38] bg-white/80 dark:bg-[#1a1a18]/80 backdrop-blur-md flex items-center justify-between px-4 z-50 relative">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-base font-bold text-brand-gray-900 dark:text-white tracking-tight">
            MarkItDown
          </h1>
          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-brand-orange/10 text-brand-orange rounded-md">
            v2.x
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleDark}
          className="btn-icon"
          aria-label={darkMode ? 'Modo claro' : 'Modo escuro'}
          title={darkMode ? 'Modo claro' : 'Modo escuro'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  )
}
