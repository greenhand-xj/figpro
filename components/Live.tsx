import { useMyPresence, useOthers } from '@/liveblocks.config'
import LiveCursors from './cursor/LiveCursors'
import { useCallback, useEffect, useState } from 'react'
import CursorChat from './cursor/CursorChat'
import { CursorMode, CursorState, Reaction } from '@/types/type'
import ReactionSelector from './reaction/ReactionButton'

const Live = () => {
  const others = useOthers()
  const [{ cursor }, updateMyPresence] = useMyPresence()
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  })
  const [reactions, setReactions] = useState<Reaction[]>([])

  // 处理实时Reaction
  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false })
  }, [])

  // 处理实时光标位置
  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault()
    if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
      const { clientX, clientY, currentTarget } = event
      const x = clientX - currentTarget.getBoundingClientRect().x
      const y = clientY - currentTarget.getBoundingClientRect().y
      updateMyPresence({ cursor: { x, y } })
    }
  }, [cursor, cursorState, updateMyPresence])
  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    // console.log('event-leave', event)
    // event.preventDefault()
    setCursorState({ mode: CursorMode.Hidden })
    updateMyPresence({ cursor: null, message: null })
  }, [updateMyPresence])

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    // console.log('event-down', event)
    const { clientX, clientY, currentTarget } = event
    const x = clientX - currentTarget.getBoundingClientRect().x
    const y = clientY - currentTarget.getBoundingClientRect().y
    updateMyPresence({ cursor: { x, y } })

    setCursorState((state) =>
      cursorState.mode === CursorMode.Reaction
        ? { ...state, isPressed: true }
        : state
    )
  }, [cursorState.mode, updateMyPresence])

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    setCursorState((state) =>
      cursorState.mode === CursorMode.Reaction
        ? { ...state, isPressed: false }
        : state
    )
  }, [cursorState.mode])

  // 处理实时聊天input框
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '',
        })
      } else if (e.key === 'Escape') {
        updateMyPresence({ message: '' })
        setCursorState({ mode: CursorMode.Hidden })
      } else if (e.key === 'e') {
        setCursorState({ mode: CursorMode.ReactionSelector })
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
    <div
      className="flex h-screen w-full items-center justify-center text-center"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <h1 className="text-2xl text-white">Live Blocks</h1>
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
          cursor={cursor}
          setReaction={(reaction) => {
            setReaction(reaction)
          }}
        />
      )}
      {cursorState.mode === CursorMode.Reaction && (
        <div className="pointer-events-none absolute top-3.5 left-1 select-none">
          {cursorState.reaction}
        </div>
      )}
      <LiveCursors others={others} />
    </div>
  )
}

export default Live
