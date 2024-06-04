import { useMyPresence, useOthers } from "@/liveblocks.config";
import LiveCursors from "./cursor/LiveCursors";
import { useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode } from "@/types/type";

const Live = () => {
  const others = useOthers()
  const [{ cursor }, updateMyPresence] = useMyPresence()
  const [cursorState, setCursorState] = useState({ mode: CursorMode.Hidden })

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    // console.log('event-move', event)

    event.preventDefault()
    const { clientX, clientY, currentTarget } = event
    const x = clientX - currentTarget.getBoundingClientRect().x
    const y = clientY - currentTarget.getBoundingClientRect().y
    updateMyPresence({ cursor: { x, y } })
  }, [])
  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    // console.log('event-leave', event)
    // event.preventDefault()
    setCursorState({ mode: CursorMode.Hidden })
    updateMyPresence({ cursor: null, message: null })
  }, [])

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    // console.log('event-down', event)
    const { clientX, clientY, currentTarget } = event
    const x = clientX - currentTarget.getBoundingClientRect().x
    const y = clientY - currentTarget.getBoundingClientRect().y
    updateMyPresence({ cursor: { x, y } })
  }, [])

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === '/') {
        // @ts-ignore
        setCursorState({ mode: CursorMode.Chat, previousMessage: null, message: '' })
      } else if (e.key === 'Escape') {
        updateMyPresence({ message: "" })
        setCursorState({ mode: CursorMode.Hidden })
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault()
      }
    }
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [updateMyPresence])
  return (
    <div className="flex h-screen w-full items-center justify-center text-center" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onPointerDown={handlePointerDown}>
      <h1 className="text-2xl text-white">Live Blocks</h1>
      {cursor && (
        // @ts-ignore
        <CursorChat cursor={cursor} cursorState={cursorState} setCursorState={setCursorState} updateMyPresence={updateMyPresence} />
      )}
      <LiveCursors others={others} />
    </div>
  );
};

export default Live;