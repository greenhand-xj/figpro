"use client"
import LeftSideBar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSideBar from "@/components/RightSidebar";
import { useEffect, useRef } from "react";
import { type fabric } from 'fabric'
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>('rectangle');

  useEffect(() => {
    // initialize fabric canvas
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
      <Navbar />
      <section className="h-full flex flex-row">
        <LeftSideBar />
        <Live canvasRef={canvasRef} />
        <RightSideBar />
      </section>
    </main>
  );
}
