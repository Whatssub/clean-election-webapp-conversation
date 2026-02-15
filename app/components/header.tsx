import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
} from '@heroicons/react/24/solid'

export interface IHeaderProps {
  title: string
  onShowSideBar?: () => void
}

const Header: FC<IHeaderProps> = ({
  title,
  onShowSideBar,
}) => {
  return (
    <div className="shrink-0 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between h-9 px-3">
        <div
          className='flex items-center justify-center h-8 w-8 cursor-pointer rounded-lg hover:bg-gray-100'
          onClick={() => onShowSideBar?.()}
        >
          <Bars3Icon className="h-4 w-4 text-gray-600" />
        </div>
        <div className='flex-1 text-center text-sm text-gray-900 font-medium truncate px-2'>
          {title}
        </div>
        <div className='w-8 h-8' />
      </div>
    </div>
  )
}

export default React.memo(Header)
