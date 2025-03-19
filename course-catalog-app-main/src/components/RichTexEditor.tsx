// import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Paragraph from '@tiptap/extension-paragraph'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Blockquote from '@tiptap/extension-blockquote'
import { useState } from 'react'
import SendEmailPreview from './SendEmailPreview'
import { Class } from '../interfaces/MainInterface'
import { useNavigate } from 'react-router-dom'

interface RichTextEditorProps {
  data: Class
  checkedEmails: string[]
}

export default function RichTextEditor({
  data,
  checkedEmails
}: RichTextEditorProps) {
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(null)

  const navigate = useNavigate()

  const mockContent = `<p> 
    สวัสดี คุณ {{ name }} <br/>
  ยินดีต้อนรับสู่ class {{ className }} <br/>
  ก่อนเริ่ม class กันในวันที่  {{ startDate }}  <br/>
  อยากจะให้คุณเตรียมตัวดังนี้... <br/><br/>
  แล้วเจอกับครับ
    {{ trainer }}
    </p>`

  // mockContent = mockContent
  //   .replace('{{ name }}', data.participants[0]?.firstNameTh ?? '')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Add a message, if you'd like.",
        emptyNodeClass: 'text-gray-400'
      }),
      Paragraph.configure({
        HTMLAttributes: { className: 'text-gray-400' }
      }),
      Bold.configure({
        HTMLAttributes: { className: 'font-bold' }
      }),
      Underline,
      Link.configure({
        HTMLAttributes: {
          className:
            'inline-flex items-center gap-x-1 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium'
        }
      }),
      BulletList.configure({
        HTMLAttributes: { className: 'list-disc list-inside text-gray-800' }
      }),
      OrderedList.configure({
        HTMLAttributes: { className: 'list-decimal list-inside text-gray-800' }
      }),
      ListItem,
      Blockquote.configure({
        HTMLAttributes: { className: 'text-gray-800 sm:text-xl' }
      })
    ],
    content: mockContent
  })

  if (!editor) {
    return null
  }

  const toggleModal = () => setModalOpen(!isModalOpen)

  const handlePreview = () => {
    const contentString = editor.getHTML()
    const content = (
      <div className="p-4">
        <h1 className="font-bold text-2xl">TDD Class for Company</h1>
        <p className="mt-2">1/12/2024 - 20/12/2024</p>
        <div className="flex gap-4 mt-4">
          <SendEmailPreview data={data} htmlText={contentString} setModalOpen={setModalOpen} />
        </div>
      </div>
    )
    setPreviewContent(content)
    toggleModal()
  }

  const handleSend = () => {
    if (checkedEmails.length > 0) {
      window.location.href = 'https://mail.google.com'
    } else {
      alert('กรุณาเลือกอย่างน้อย 1 คน ที่จะทำการส่งอีเมลล์')
    }
  }

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden w-full shadow-xl">
        <div id="hs-editor-tiptap">
          <div className="flex align-middle gap-x-0.5 border-b border-gray-200 p-2">
            <button
              className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              type="button"
              data-hs-editor-bold=""
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 12a4 4 0 0 0 0-8H6v8"></path>
                <path d="M15 20a4 4 0 0 0 0-8H6v8Z"></path>
              </svg>
            </button>
            <button
              className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              type="button"
              data-hs-editor-italic=""
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="19" x2="10" y1="4" y2="4"></line>
                <line x1="14" x2="5" y1="20" y2="20"></line>
                <line x1="15" x2="9" y1="4" y2="20"></line>
              </svg>
            </button>
            <button
              className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              type="button"
              data-hs-editor-underline=""
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
                <line x1="4" x2="20" y1="20" y2="20"></line>
              </svg>
            </button>
          </div>
          <EditorContent
            editor={editor}
            className="h-[60vh] overflow-auto p-4"
          />
        </div>
      </div>
      <div className="w-full flex justify-between pt-[10px]">
        <button
          onClick={() => navigate('/AllClass')}
          className="flex gap-[10px] p-[12px] rounded-[8px] text-[#2d5bb8] border-2 border-[#2d5bb8] hover:bg-[#2d5bb8] hover:text-white transition-colors duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
          <p>Back</p>
        </button>
        <div className="flex gap-[16px]">
          <button
            className="flex gap-[10px] p-[12px] rounded-[8px] bg-[#1C64F2] text-white hover:bg-[#2d5bb8] transition-colors duration-150"
            onClick={handlePreview}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fillRule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            <p>Preview</p>
          </button>
          <button
            onClick={() => handleSend()}
            className="flex gap-[10px] p-[12px] rounded-[8px] bg-[#1C64F2] text-white hover:bg-[#2d5bb8] transition-colors duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
            <p>Send</p>
          </button>
        </div>
      </div>
      {/* Modal Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="mb-4">{previewContent}</div>
          </div>
        </div>
      )}
    </div>
  )
}
