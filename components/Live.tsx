import { useMyPresence, useOthers } from "@/liveblocks.config";
import LiveCursors from "./cursor/LiveCursors";
import { useCallback } from "react";

const Live = () => {
  const others = useOthers()
  const [{ cursor }, updateMyPresence] = useMyPresence()
  // updateMyPresence({x: 0, y: 0})
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
    event.preventDefault()
    updateMyPresence({ cursor: null, message: null })
  }, [])

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    // console.log('event-down', event)
    const { clientX, clientY, currentTarget } = event
    const x = clientX - currentTarget.getBoundingClientRect().x
    const y = clientY - currentTarget.getBoundingClientRect().y
    updateMyPresence({ cursor: { x, y } })
  }, [])
  return (
    <div className="flex h-screen w-full items-center justify-center text-center" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onPointerDown={handlePointerDown}>
      <h1 className="text-2xl text-white">Live Blocks</h1>

      <LiveCursors others={others} />
    </div>
  );
};

export default Live;