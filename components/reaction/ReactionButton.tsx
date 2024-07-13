import { useLayoutEffect, useRef, useState } from 'react';

type Props = {
  setReaction: (reaction: string) => void
  cursor: { x: number; y: number } | null
}

export default function ReactionSelector({ setReaction, cursor }: Props) {
  const divRef = useRef<HTMLDivElement>(null)
  const [transformValue, setTransformValue] = useState(``)
  // 利用同步的方式更新光标位置，不然用useEffect会有闪烁
  useLayoutEffect(() => {
    if (cursor && divRef.current) {
      const { width, height } = divRef.current!.getBoundingClientRect()
      setTransformValue(`translate(${cursor.x - width / 2}px, ${cursor.y - height / 2}px)`)
    }
  }, [cursor])

  return (
    <div
      ref={divRef}
      className='absolute top-0 left-0 rounded-full bg-white px-2'
      style={{
        boxShadow:
          '0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transform: transformValue,
      }}
      onPointerMove={(e) => e.stopPropagation()}
    >
      <ReactionButton reaction="👍" onSelect={setReaction} />
      <ReactionButton reaction="🔥" onSelect={setReaction} />
      <ReactionButton reaction="😍" onSelect={setReaction} />
      <ReactionButton reaction="👀" onSelect={setReaction} />
      <ReactionButton reaction="😱" onSelect={setReaction} />
      <ReactionButton reaction="🙁" onSelect={setReaction} />
    </div>
  )
}

function ReactionButton({
  reaction,
  onSelect,
}: {
  reaction: string
  onSelect: (reaction: string) => void
}) {
  return (
    <button
      className="transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none"
      onPointerDown={() => onSelect(reaction)}
    >
      {reaction}
    </button>
  )
}
