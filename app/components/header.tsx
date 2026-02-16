import type { FC } from 'react'
import React from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'

export interface IHeaderProps {
  title: string
  onShowSideBar?: () => void
}

const Header: FC<IHeaderProps> = ({
  title,
  onShowSideBar,
}) => {
  return (
    <div className="shrink-0 pt-[env(safe-area-inset-top)] bg-white border-b border-gray-200">
      <div className="flex items-center h-11 px-4">
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 -ml-1 cursor-pointer"
          onClick={() => onShowSideBar?.()}
        >
          <Bars3Icon className="h-[22px] w-[22px] text-gray-700 stroke-[1.5]" />
        </button>
        <div className="flex-1 text-center text-[17px] text-gray-900 font-semibold truncate px-2">
          {title}
        </div>
        <div className="w-8 h-8" />
      </div>
    </div>
  )
}

export default React.memo(Header)
