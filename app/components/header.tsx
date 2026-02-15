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
    <div className="shrink-0 flex items-center justify-between h-9 px-3 bg-[#00347F]">
      <div
        className='flex items-center justify-center h-8 w-8 cursor-pointer rounded-lg hover:bg-white/10'
        onClick={() => onShowSideBar?.()}
      >
        <Bars3Icon className="h-4 w-4 text-white" />
      </div>
      <div className='flex-1 text-center text-sm text-white font-medium truncate px-2'>
        {title}
      </div>
      <div className='w-8 h-8' />
    </div>
  )
}

export default React.memo(Header)
