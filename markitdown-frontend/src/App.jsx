import { useState, useEffect, useCallback } from 'react'
import { Toaster } from 'react-hot-toast'

import Header from './components/Layout/Header.jsx'
import Sidebar from './components/Layout/Sidebar.jsx'
import FileUpload from './components/Converter/FileUpload.jsx'
import UrlInput from './components/Converter/UrlInput.jsx'
import TextInput from './components/Converter/TextInput.jsx'
import ResultPanel from './components/Preview/ResultPanel.jsx'
import ErrorState from './components/ui/ErrorState.jsx'
import SuccessBanner from './components/ui/SuccessBanner.jsx'

import { useConvert } from './hooks/useConvert.js'
import { useHistory } from './hooks/useHistory.js'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('markitdown-dark')
      if (stored !== null) return stored === 'true'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })
  const [activeTab, setActiveTab] = useState('file')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768
  })

  const converter = useConvert()
  const history = useHistory()

  // Toggle dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('markitdown-dark', String(darkMode))
  }, [darkMode])

  // Responsive sidebar
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e) => setSidebarCollapsed(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Save to history on successful conversion
  useEffect(() => {
    if (converter.status === 'success' && converter.result && !converter.isRestored) {
      history.addItem({
        sourceInfo: converter.sourceInfo,
        result: converter.result,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [converter.status, converter.isRestored])

  const handleHistoryClick = useCallback((item) => {
    converter.restoreResult(item)
  }, [converter])

  const handleReset = useCallback(() => {
    converter.reset()
    document.title = 'MarkItDown'
  }, [converter])

  return (
    <div className="h-screen flex flex-col bg-brand-gray-50 dark:bg-[#141412] text-brand-gray-900 dark:text-[#e8e7e0]">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: '10px',
            padding: '10px 16px',
          },
        }}
      />

      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      <div className="flex-1 flex min-h-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          historyItems={history.items}
          onHistoryClick={handleHistoryClick}
          onClearHistory={history.clearHistory}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8" role="main">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Title area */}
            <div>
              <h2 className="text-xl font-bold text-brand-gray-900 dark:text-white">
                {activeTab === 'file' && 'Upload de Arquivo'}
                {activeTab === 'url' && 'Converter URL'}
                {activeTab === 'text' && 'Converter Texto'}
              </h2>
              <p className="text-sm text-brand-gray-400 dark:text-[#888880] mt-1">
                {activeTab === 'file' && 'Arraste ou selecione um arquivo para converter para Markdown'}
                {activeTab === 'url' && 'Cole uma URL de página web, imagem ou documento público'}
                {activeTab === 'text' && 'Cole conteúdo HTML, LaTeX ou outro formato para converter'}
              </p>
            </div>

            {/* Input area */}
            {activeTab === 'file' && (
              <FileUpload
                onFileSelect={converter.handleFile}
                status={converter.status}
                progress={converter.progress}
              />
            )}
            {activeTab === 'url' && (
              <UrlInput
                onSubmit={converter.handleUrl}
                status={converter.status}
              />
            )}
            {activeTab === 'text' && (
              <TextInput
                onSubmit={converter.handleText}
                status={converter.status}
              />
            )}

            {/* Error state */}
            {converter.status === 'error' && (
              <ErrorState
                message={converter.error}
                onRetry={handleReset}
              />
            )}

            {/* Success state */}
            {converter.status === 'success' && converter.result && (
              <>
                <SuccessBanner sourceInfo={converter.sourceInfo} />
                <ResultPanel
                  result={converter.result}
                  sourceInfo={converter.sourceInfo}
                  onReset={handleReset}
                />
              </>
            )}
          </div>
        </main>
      </div>

    </div>
  )
}

export default App
