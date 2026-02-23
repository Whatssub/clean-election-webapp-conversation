'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { ArrowUpIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'

export interface IChatProps {
  chatList: ChatItem[]
  feedbackDisabled?: boolean
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
  suggestedQuestions?: string[]
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
  suggestedQuestions = [],
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) { return }
    const imageFiles: VisionFile[] = files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]
    onSend(queryRef.current, combinedFiles)
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) { onClear() }
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)) { setAttachmentFiles([]) }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (!e.shiftKey && !isUseInputMethod.current) { handleSend() }
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  return (
    <div className="h-full">
      {/* Chat List */}
      <div className="h-full flex flex-col gap-2">
        {chatList.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full pb-[120px]">
            <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-4">
              <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7 text-primary-600" />
            </div>
            <p className="text-[15px] text-gray-800 font-medium mb-1">무엇이든 질문해보세요</p>
            <p className="text-sm text-gray-400">아래 입력창에 질문을 입력하면 답변을 받을 수 있습니다</p>
          </div>
        )}
        {chatList.map((item, index) => {
          if (item.isAnswer) {
            const isLast = item.id === chatList[chatList.length - 1].id
            const prevItem = index > 0 ? chatList[index - 1] : null
            const showAvatar = !prevItem || !prevItem.isAnswer
            return <Answer
              key={item.id}
              item={item}
              feedbackDisabled={feedbackDisabled}
              onFeedback={onFeedback}
              isResponding={isResponding && isLast}
              showAvatar={showAvatar}
            />
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
            />
          )
        })}
      </div>
      {/* Fixed bottom input area */}
      {
        !isHideSendInput && (
          <div className="fixed z-10 bottom-0 left-0 right-0 w-full">
            {/* Top gradient fade */}
            <div className="h-4 bg-gradient-to-b from-transparent to-white pointer-events-none" />
            <div className="bg-white">
              {/* Suggested question chips */}
              {suggestedQuestions.length > 0 && !isResponding && (
                <div className="px-5 pb-2">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        className="shrink-0 flex items-center gap-1 px-[15px] py-2 rounded-[18px] bg-white text-[15px] leading-[22px] font-medium whitespace-nowrap cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        style={{ color: 'rgba(0, 8, 16, 0.898)' }}
                        onClick={() => suggestionClick(q)}
                      >
                        <span>{q}</span>
                        <ChevronRightIcon className="w-3.5 h-3.5 text-primary-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Input field */}
              <div className="px-5 pb-[env(safe-area-inset-bottom,0px)]">
                <div className="flex items-end gap-2 py-3 px-4 rounded-2xl" style={{ backgroundColor: 'rgba(0, 34, 68, 0.07)', border: '1px solid rgba(0, 36, 72, 0.04)' }}>
                  {
                    visionConfig?.enabled && (
                      <div className="flex items-center shrink-0 pb-0.5">
                        <ChatImageUploader
                          settings={visionConfig}
                          onUpload={onUpload}
                          disabled={files.length >= visionConfig.number_limits}
                        />
                      </div>
                    )
                  }
                  <div className="flex-1 min-w-0">
                    {
                      visionConfig?.enabled && files.length > 0 && (
                        <div className="mb-1">
                          <ImageList
                            list={files}
                            onRemove={onRemove}
                            onReUpload={onReUpload}
                            onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                            onImageLinkLoadError={onImageLinkLoadError}
                          />
                        </div>
                      )
                    }
                    {
                      fileConfig?.enabled && (
                        <div className="mb-1">
                          <FileUploaderInAttachmentWrapper
                            fileConfig={fileConfig}
                            value={attachmentFiles}
                            onChange={setAttachmentFiles}
                          />
                        </div>
                      )
                    }
                    <Textarea
                      className="block w-full py-1 leading-5 max-h-[100px] text-[15px] text-gray-900 outline-none appearance-none resize-none bg-transparent"
                      value={query}
                      onChange={handleContentChange}
                      onKeyUp={handleKeyUp}
                      onKeyDown={handleKeyDown}
                      autoSize
                      placeholder="선거에 관해 무엇이든 물어보세요"
                    />
                  </div>
                  {/* Send button */}
                  <button
                    type="button"
                    className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#003e99] cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={handleSend}
                    disabled={!query.trim()}
                  >
                    <ArrowUpIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
