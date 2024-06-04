import CursorSVG from "@/public/assets/CursorSVG";

type Props = {
  color: string,
  x: number,
  y: number,
  message: string
}
const Cursor = ({ color, x, y, message }: Props) => {
  return (
    <div className="pointer-events-none top-0 left-0 absolute" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <CursorSVG color={color} />
    </div>
  );
}

export default Cursor