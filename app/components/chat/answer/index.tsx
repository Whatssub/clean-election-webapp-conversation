'use client'
import type { FC } from 'react'
import type { FeedbackFunc } from '../type'
import type { ChatItem, VisionFile } from '@/types/app'
import type { Emoji } from '@/types/tools'
import React from 'react'
import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '../../base/image-gallery'
import LoadingAnim from '../loading-anim'
import s from '../style.module.css'
import Thought from '../thought'

function AgentAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#003e99] flex items-center justify-center">
      <span className="text-white text-xs font-semibold">AI</span>
    </div>
  )
}

interface IAnswerProps {
  item: ChatItem
  feedbackDisabled?: boolean
  onFeedback?: FeedbackFunc
  isResponding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  showAvatar?: boolean
}

const Answer: FC<IAnswerProps> = ({
  item,
  feedbackDisabled: _feedbackDisabled,
  onFeedback: _onFeedback,
  isResponding,
  allToolIcons,
  showAvatar = true,
}) => {
  const { id, content, agent_thoughts } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0

  const getImgs = (list?: VisionFile[]) => {
    if (!list) { return [] }
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  const agentModeAnswer = (
    <div>
      {agent_thoughts?.map((item, index) => (
        <div key={index}>
          {item.thought && (
            <StreamdownMarkdown content={item.thought} />
          )}
          {!!item.tool && (
            <Thought
              thought={item}
              allToolIcons={allToolIcons || {}}
              isFinished={!!item.observation || !isResponding}
            />
          )}
          {getImgs(item.message_files).length > 0 && (
            <ImageGallery srcs={getImgs(item.message_files).map(item => item.url)} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div key={id}>
      <div className="flex items-start gap-2.5">
        {/* Avatar column - 32px fixed width */}
        <div className="shrink-0 w-8">
          {showAvatar && <AgentAvatar />}
        </div>
        {/* Message bubble */}
        <div className={`${s.answerWrap} max-w-[calc(85%-42px)] overflow-hidden`}>
          <div className={`${s.answer} relative text-[15px] leading-6 tracking-[0.3px] font-medium`} style={{ color: 'rgba(0, 8, 16, 0.898)' }}>
            <div className="px-3 py-[7px] bg-white rounded-2xl max-w-full overflow-hidden">
              {(isResponding && (isAgentMode ? (!content && (agent_thoughts || []).filter(item => !!item.thought || !!item.tool).length === 0) : !content))
                ? (
                  <div className="flex items-center justify-center w-6 h-5">
                    <LoadingAnim type="text" />
                  </div>
                )
                : (isAgentMode
                  ? agentModeAnswer
                  : (
                    <StreamdownMarkdown content={content} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(Answer)
