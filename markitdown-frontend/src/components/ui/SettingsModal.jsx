import { useState, useEffect } from 'react'
import { X, Server, Save, History, RotateCcw } from 'lucide-react'

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('markitdown-settings') || '{}')
  } catch {
    return {}
  }
}

function saveSettings(settings) {
  localStorage.setItem('markitdown-settings', JSON.stringify(settings))
}

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(() => ({
    apiUrl: 'http://localhost:7860',
    saveHistory: true,
    ...loadSettings(),
  }))
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSettings({
        apiUrl: 'http://localhost:7860',
        saveHistory: true,
        ...loadSettings(),
      })
      setSaved(false)
    }
  }, [isOpen])

  const handleSave = () => {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 800)
  }

  const handleReset = () => {
    const defaults = { apiUrl: 'http://localhost:7860', saveHistory: true }
    setSettings(defaults)
    saveSettings(defaults)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#1a1a18] rounded-2xl shadow-2xl border border-brand-gray-200 dark:border-[#3a3a38] animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-label="Configurações"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-200 dark:border-[#3a3a38]">
          <h2 className="text-lg font-semibold text-brand-gray-900 dark:text-white">
            Configurações
          </h2>
          <button onClick={onClose} className="btn-icon" aria-label="Fechar">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* API URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-brand-gray-700 dark:text-[#c8c7c0]">
              <Server className="w-4 h-4" />
              Endpoint da API
            </label>
            <input
              type="text"
              value={settings.apiUrl}
              onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
              className="input-field font-mono text-sm"
              placeholder="http://localhost:7860"
              aria-label="URL do endpoint da API"
            />
            <p className="text-xs text-brand-gray-400 dark:text-[#888880]">
              URL base do servidor MarkItDown
            </p>
          </div>

          {/* Save History Toggle */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-brand-gray-700 dark:text-[#c8c7c0]">
              <History className="w-4 h-4" />
              Salvar histórico
            </label>
            <button
              onClick={() => setSettings({ ...settings, saveHistory: !settings.saveHistory })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                settings.saveHistory ? 'bg-brand-orange' : 'bg-brand-gray-200 dark:bg-[#3a3a38]'
              }`}
              role="switch"
              aria-checked={settings.saveHistory}
              aria-label="Ativar ou desativar salvamento de histórico"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  settings.saveHistory ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-brand-gray-200 dark:border-[#3a3a38]">
          <button onClick={handleReset} className="btn-ghost text-sm" aria-label="Restaurar padrões">
            <RotateCcw className="w-3.5 h-3.5" />
            Padrões
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary text-sm">
              Cancelar
            </button>
            <button onClick={handleSave} className="btn-primary text-sm">
              {saved ? (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Salvo!
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
