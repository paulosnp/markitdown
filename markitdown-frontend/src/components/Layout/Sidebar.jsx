import { Upload, Globe, Type, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

const TABS = [
  { id: 'file', label: 'Arquivo', icon: Upload },
  { id: 'url', label: 'URL', icon: Globe },
  { id: 'text', label: 'Texto', icon: Type },
]

export default function Sidebar({
  activeTab,
  onTabChange,
  historyItems,
  onHistoryClick,
  onClearHistory,
  collapsed,
  onToggleCollapse,
}) {
  return (
    <aside
      className={clsx(
        'border-r border-brand-gray-200 dark:border-[#3a3a38] bg-white dark:bg-[#1a1a18] flex flex-col transition-all duration-200 ease-out relative',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-4 w-6 h-6 rounded-full bg-white dark:bg-[#242422] border border-brand-gray-200 dark:border-[#3a3a38] flex items-center justify-center hover:bg-brand-gray-100 dark:hover:bg-[#2e2e2c] transition-colors z-10 shadow-sm"
        aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-brand-gray-700 dark:text-[#a0a098]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-brand-gray-700 dark:text-[#a0a098]" />
        )}
      </button>

      {/* Navigation tabs */}
      <nav className="p-3 space-y-1" role="navigation" aria-label="Tipo de conversão">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={clsx('sidebar-link w-full', activeTab === id && 'active')}
            aria-label={label}
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-brand-gray-200 dark:border-[#3a3a38]" />

      {/* History section */}
      <div className="flex-1 flex flex-col min-h-0 p-3">
        {!collapsed && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-gray-400 dark:text-[#888880] uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              Recentes
            </div>
            {historyItems.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-brand-gray-400 hover:text-red-500 transition-colors"
                aria-label="Limpar histórico"
                title="Limpar histórico"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-1">
          {collapsed ? (
            <div className="flex flex-col items-center gap-1 mt-2">
              <Clock className="w-4 h-4 text-brand-gray-400 dark:text-[#666660]" />
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-full bg-brand-gray-100 dark:bg-[#2e2e2c] flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-brand-gray-400 dark:text-[#666660]" />
              </div>
              <p className="text-xs text-brand-gray-400 dark:text-[#666660]">
                Nenhuma conversão ainda
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <HistoryCard key={item.id} item={item} onClick={() => onHistoryClick(item)} />
            ))
          )}
        </div>
      </div>
    </aside>
  )
}

function HistoryCard({ item, onClick }) {
  const typeIcons = {
    file: Upload,
    url: Globe,
    text: Type,
  }
  const Icon = typeIcons[item.sourceInfo?.type] || Upload
  const preview = item.result?.markdown?.slice(0, 60) || ''
  const time = new Date(item.timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2.5 rounded-lg hover:bg-brand-gray-100 dark:hover:bg-[#2e2e2c] transition-colors group"
      aria-label={`Restaurar: ${item.sourceInfo?.name}`}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 w-6 h-6 rounded bg-brand-gray-100 dark:bg-[#2e2e2c] group-hover:bg-brand-gray-200 dark:group-hover:bg-[#3a3a38] flex items-center justify-center flex-shrink-0 transition-colors">
          <Icon className="w-3 h-3 text-brand-gray-700 dark:text-[#a0a098]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-brand-gray-900 dark:text-[#e8e7e0] truncate">
            {item.sourceInfo?.name || 'Sem nome'}
          </p>
          <p className="text-[10px] text-brand-gray-400 dark:text-[#666660] mt-0.5">{time}</p>
          {preview && (
            <p className="text-[10px] text-brand-gray-400 dark:text-[#888880] mt-1 line-clamp-2 leading-relaxed">
              {preview}...
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
