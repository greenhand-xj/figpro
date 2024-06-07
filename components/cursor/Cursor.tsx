import CursorSVG from '@/public/assets/CursorSVG'

type Props = {
  color: string
  x: number
  y: number
  message: string
}
const Cursor = ({ color, x, y, message }: Props) => {
  return (
    <div
      className="pointer-events-none top-0 left-0 absolute"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <CursorSVG color={color} />

      {message && (
        <div className="absolute top-5 left-2 px-4 py-2 rounded-3xl" style={{ backgroundColor: color }}>
          <p className='text-white whitespace-nowrap leading-relaxed text-sm'>{message}</p>
        </div>
      )}
    </div>
  )
}

export default Cursor
