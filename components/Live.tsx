import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@/liveblocks.config'
import LiveCursors from './cursor/LiveCursors'
import { useCallback, useEffect, useState } from 'react'
import CursorChat from './cursor/CursorChat'
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type'
import ReactionSelector from './reaction/ReactionButton'
import FlyingReaction from './reaction/FlyingReaction'
import useInterval from '@/hooks/useInterval'

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}

const Live = ({ canvasRef }: Props) => {
  const others = useOthers()
  const [{ cursor }, updateMyPresence] = useMyPresence()
  const broadcast = useBroadcastEvent();
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  })
  const [reactions, setReactions] = useState<Reaction[]>([])

  // 处理实时Reaction
  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false })
  }, [])

  // 每过100ms收集Reaction,并且在鼠标按下是收集,并且广播给其他人
  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      // 收集Reaction
      setReactions((reactions) => reactions.concat([{
        point: { x: cursor.x, y: cursor.y },
        value: cursorState.reaction,
        timestamp: Date.now()
      }]))

      // 广播
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100)

  // Remove reactions that are not visible anymore (every 1 sec)
  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 1000);

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
    setCursorState({ mode: CursorMode.Hidden })
    updateMyPresence({ cursor: null, message: null })
  }, [updateMyPresence])

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
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

  // 其他人的实时Reaction收集，被广播后触发
  useEventListener((eventData) => {
    // ReactionEvent
    const event = eventData.event
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });
  return (
    <div
      id="canvas"
      className="flex h-screen w-full items-center justify-center text-center relative"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <canvas ref={canvasRef} />


      {reactions.map((reaction) => {
        return (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        );
      })}
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      {cursor && cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
          cursor={cursor}
          setReaction={(reaction) => {
            setReaction(reaction)
          }}
        />
      )}
      {cursor && cursorState.mode === CursorMode.Reaction && (
        <div className="pointer-events-none absolute top-3.5 left-1 select-none" style={{
          transform: `translateX(${cursor.x + 4}px) translateY(${cursor.y + 4}px)`,
        }}>
          {cursorState.reaction}
        </div>
      )}
      <LiveCursors others={others} />
    </div>
  )
}

export default Live
