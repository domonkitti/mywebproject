
import { Class } from "../interfaces/MainInterface";

interface RichTextEditorProps {
  htmlText: string
  data: Class
  setModalOpen: (param: boolean) => void
}

export default function SendEmailPreview({
  htmlText,
  data,
  setModalOpen
}: RichTextEditorProps) {
  const newData = htmlText
  .replace('{{ name }}', data.participants[0]?.firstNameTh ?? '')
  .replace('{{ className }}', data?.classCourseName ?? '')
  .replace('{{ startDate }}', data?.startDate ?? '')
  .replace('{{ trainer }}', data.trainers[0].nickName ?? '')
  

  return (
    <div className="w-full">
      <div className="bg-white w-full">
        <div dangerouslySetInnerHTML={{ __html: newData }} />
      </div>
      <div className="w-full flex justify-end pt-[10px]">
        <div className="flex gap-[16px]">
          <button
            onClick={() => setModalOpen(false)}
            className="flex gap-[10px] py-3 px-8 rounded-[8px] bg-red-700 text-white transition-colors duration-150"
          >
            <p>X Close</p>
          </button>
        </div>
      </div>
    </div>
  )
}
