"use client"
import LeftSideBar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSideBar from "@/components/RightSidebar";
import { useEffect, useRef, useState } from "react";
import { type fabric } from 'fabric'
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";
import { ActiveElement, ShapeType } from "@/types/type";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<ShapeType>('rectangle');
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: ''
  });

  const handleActiveElement = (ele: ActiveElement) => {
    setActiveElement(ele)
    selectedShapeRef.current = ele.value as ShapeType
  }

  useEffect(() => {
    // initialize fabric canvas
    // 找到id为canvas的DOM元素，创建fabric canvas的实例
    const canvas = initializeFabric({ fabricRef, canvasRef });
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      })
    })

    window.addEventListener('resize', () => {
      handleResize({ canvas: fabricRef.current })
    })
  }, [])

  return (
    <main className="h-screen overflow-hidden">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
      />
      <section className="h-full flex flex-row">
        <LeftSideBar />
        <Live canvasRef={canvasRef} />
        <RightSideBar />
      </section>
    </main>
  );
}
