import { useState, useRef, useCallback } from 'react'
import { Upload, FileUp, X, File, Loader2 } from 'lucide-react'
import clsx from 'clsx'

const ACCEPTED_EXTENSIONS = [
  '.pdf', '.docx', '.doc', '.pptx', '.ppt', '.xlsx', '.xls',
  '.html', '.htm', '.xml', '.json', '.csv', '.tsv',
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp',
  '.mp3', '.wav', '.m4a', '.ogg',
  '.zip', '.tar', '.gz',
  '.md', '.txt', '.rst', '.rtf', '.epub',
  '.ipynb', '.yaml', '.yml',
]

const FILE_TYPE_COLORS = {
  pdf: 'text-red-500 bg-red-50 dark:bg-red-500/10',
  docx: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
  doc: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
  pptx: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10',
  ppt: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10',
  xlsx: 'text-green-500 bg-green-50 dark:bg-green-500/10',
  xls: 'text-green-500 bg-green-50 dark:bg-green-500/10',
  html: 'text-teal-500 bg-teal-50 dark:bg-teal-500/10',
  mp3: 'text-pink-500 bg-pink-50 dark:bg-pink-500/10',
  zip: 'text-gray-500 bg-gray-50 dark:bg-gray-500/10',
  png: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10',
  jpg: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10',
  jpeg: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10',
}

function getExtension(name) {
  return name?.split('.').pop()?.toLowerCase() || ''
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUpload({ onFileSelect, status, progress }) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const dragCounter = useRef(0)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current += 1
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const processFile = useCallback((file) => {
    setSelectedFile(file)
    onFileSelect(file)
  }, [onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleInputChange = useCallback((e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
    e.target.value = ''
  }, [processFile])

  const clearFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const isUploading = status === 'uploading'

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group',
          isDragging
            ? 'border-brand-orange bg-brand-orange-bg dark:bg-brand-orange/5 scale-[1.01]'
            : isUploading
            ? 'border-brand-gray-200 dark:border-[#3a3a38] bg-brand-gray-50 dark:bg-[#242422] cursor-wait'
            : 'border-brand-gray-200 dark:border-[#3a3a38] hover:border-brand-orange/50 hover:bg-brand-orange-bg/50 dark:hover:bg-brand-orange/5 animate-pulse-border'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        role="button"
        aria-label="Área de upload — arraste um arquivo ou clique para selecionar"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleInputChange}
          aria-hidden="true"
        />

        <div className="flex flex-col items-center justify-center py-12 px-6">
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-brand-orange animate-spin mb-4" />
          ) : isDragging ? (
            <FileUp className="w-10 h-10 text-brand-orange mb-4 animate-bounce" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Upload className="w-6 h-6 text-brand-orange" />
            </div>
          )}

          {isUploading ? (
            <div className="text-center">
              <p className="text-sm font-medium text-brand-gray-900 dark:text-[#e8e7e0]">
                Convertendo...
              </p>
              <p className="text-xs text-brand-gray-400 dark:text-[#888880] mt-1">
                {progress}% concluído
              </p>
            </div>
          ) : isDragging ? (
            <p className="text-sm font-medium text-brand-orange">
              Solte o arquivo aqui
            </p>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-brand-gray-900 dark:text-[#e8e7e0]">
                Arraste arquivos aqui
              </p>
              <p className="text-xs text-brand-gray-400 dark:text-[#888880] mt-1">
                ou <span className="text-brand-orange font-medium">clique para selecionar</span>
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gray-200 dark:bg-[#3a3a38] rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-brand-orange transition-all duration-300 ease-out rounded-b-xl"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Selected file badge */}
      {selectedFile && !isUploading && (
        <div className="animate-fade-in flex items-center gap-3 p-3 bg-brand-gray-50 dark:bg-[#242422] border border-brand-gray-200 dark:border-[#3a3a38] rounded-lg">
          <div className={clsx(
            'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
            FILE_TYPE_COLORS[getExtension(selectedFile.name)] || 'text-brand-gray-700 bg-brand-gray-100 dark:bg-[#2e2e2c]'
          )}>
            <File className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brand-gray-900 dark:text-[#e8e7e0] truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-brand-gray-400 dark:text-[#888880]">
              {formatSize(selectedFile.size)} · {getExtension(selectedFile.name).toUpperCase()}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); clearFile() }}
            className="btn-icon flex-shrink-0"
            aria-label="Remover arquivo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Supported formats */}
      <div className="flex flex-wrap gap-1.5">
        {['PDF', 'DOCX', 'PPTX', 'XLSX', 'IMG', 'HTML', 'MP3', 'ZIP'].map((ext) => (
          <span
            key={ext}
            className="px-2 py-0.5 text-[10px] font-medium bg-brand-gray-100 dark:bg-[#2e2e2c] text-brand-gray-700 dark:text-[#a0a098] rounded-md"
          >
            {ext}
          </span>
        ))}
      </div>
    </div>
  )
}
