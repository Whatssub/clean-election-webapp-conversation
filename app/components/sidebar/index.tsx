import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export interface ISidebarProps {
  currentId: string
  onCurrentIdChange: (id: string) => void
  onClose?: () => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({
  currentId,
  onCurrentIdChange,
  onClose,
  list,
}) => {
  const { t } = useTranslation()
  return (
    <div
      className="shrink-0 flex flex-col bg-white w-[280px] h-screen shadow-xl"
    >
      {/* Header with safe area */}
      <div className="shrink-0 pt-[var(--app-inset-top)] border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-12">
          <span className="text-gray-900 font-semibold text-[15px]">
            {t('app.chat.newChat')}
          </span>
          <div className="flex items-center gap-1">
            {list.length < MAX_CONVERSATION_LENTH && (
              <button
                type="button"
                onClick={() => onCurrentIdChange('-1')}
                className="flex items-center justify-center h-9 w-9 cursor-pointer rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onClose?.()}
              className="flex items-center justify-center h-9 w-9 cursor-pointer rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Conversation list */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {list.length === 0
          ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-3">
                <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-primary-600" />
              </div>
              <p className="text-sm text-gray-500 leading-5">
                새 대화를 시작하여
                <br />
                질의를 해보세요
              </p>
            </div>
          )
          : (
            <div className="space-y-0.5">
              {list.map((item) => {
                const isCurrent = item.id === currentId
                const ItemIcon
                  = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
                return (
                  <div
                    onClick={() => onCurrentIdChange(item.id)}
                    key={item.id}
                    className={classNames(
                      isCurrent
                        ? 'bg-primary-50 border-l-[3px] border-l-primary-600'
                        : 'border-l-[3px] border-l-transparent hover:bg-gray-50',
                      'group flex items-center rounded-r-lg pl-3 pr-3 py-2.5 cursor-pointer transition-colors',
                    )}
                  >
                    <ItemIcon
                      className={classNames(
                        isCurrent
                          ? 'text-primary-600'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 h-[18px] w-[18px] flex-shrink-0',
                      )}
                      aria-hidden="true"
                    />
                    <span className={classNames(
                      isCurrent ? 'text-primary-700 font-medium' : 'text-gray-700',
                      'text-sm truncate',
                    )}>
                      {item.name}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
      </nav>
    </div>
  )
}

export default React.memo(Sidebar)
