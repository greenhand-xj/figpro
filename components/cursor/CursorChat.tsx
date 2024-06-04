import CursorSVG from "@/public/assets/CursorSVG";
import { CursorChatProps, CursorMode } from "@/types/type";


const CursorChat = ({ cursor, cursorState, setCursorState, updateMyPresence }: CursorChatProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCursorState({
        message: '',
        // @ts-ignore
        previousMessage: cursorState.message,
        mode: CursorMode.Chat
      })
    } else if (e.key === 'Escape') {
      setCursorState({
        mode: CursorMode.Hidden
      })
    }

  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: e.target.value })
    setCursorState({
      message: e.target.value,
      previousMessage: null,
      mode: CursorMode.Chat
    })
  }
  return (
    <div className="absolute top-0 left-0" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}>
      {cursorState.mode === CursorMode.Chat && (
        <>
          <CursorSVG color="#000" />
          <div className="absolute top-2 left-5 bg-blue-500 px-4 py-2 text-sm leading-relaxed rounded-[20px] text-white">
            {cursorState.previousMessage && (
              <div>{cursorState.previousMessage}</div>
            )}
            <input className="z-10 w-60 border-none bg-transparent text-white placeholder-blue-300 outline-none" autoFocus={true} onChange={handleChange} onKeyDown={handleKeyDown} placeholder={cursorState.previousMessage ? '' : '输入一些文字吧...'} maxLength={50} value={cursorState.message} />
          </div>
        </>
      )}
    </div>
  )
}

export default CursorChat