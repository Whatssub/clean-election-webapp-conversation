'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'
import s from '../style.module.css'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, imgSrcs }) => {
  return (
    <div className='flex justify-end' key={id}>
      <div className="max-w-[85%]">
        <div className={`${s.question} relative text-[15px] leading-6 tracking-[0.3px] font-medium text-white`}>
          <div
            className={'px-[14px] py-[7px] bg-[#0068ff] text-white rounded-2xl'}
          >
            {imgSrcs && imgSrcs.length > 0 && (
              <ImageGallery srcs={imgSrcs} />
            )}
            <StreamdownMarkdown content={content} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Question)
