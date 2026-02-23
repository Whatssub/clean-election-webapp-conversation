import type { FC } from 'react'
import React from 'react'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export interface IHeaderProps {
  onBack?: () => void
  onDelete?: () => void
}

const Header: FC<IHeaderProps> = ({
  onBack,
  onDelete,
}) => {
  return (
    <div className="shrink-0 pt-[var(--app-inset-top)] bg-transparent">
      <div className="flex items-center justify-between h-11 px-4">
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 -ml-1 cursor-pointer"
          onClick={() => onBack?.()}
        >
          <ChevronLeftIcon className="h-6 w-6 text-[#0068ff] stroke-[2]" />
        </button>
        <button
          type="button"
          className="text-[15px] text-[#0068ff] font-medium cursor-pointer"
          onClick={() => onDelete?.()}
        >
          삭제
        </button>
      </div>
    </div>
  )
}

export default React.memo(Header)
