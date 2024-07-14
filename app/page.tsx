"use client"
import LeftSideBar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSideBar from "@/components/RightSidebar";
import { useEffect, useRef, useState } from "react";
import { type fabric } from 'fabric'
import { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleCanvasObjectModified, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { ActiveElement, CustomFabricObject, ShapeData, ShapeType } from "@/types/type";
import { useMutation, useStorage } from "@/liveblocks.config";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<ShapeType>('rectangle');
  const activeObjectRef = useRef<CustomFabricObject | null>(null);
  const canvasObjects = useStorage(root => root.canvasObjects)
  const syncShapeInStorage = useMutation(({ storage }, object: CustomFabricObject) => {
    if (!object) return
    const { objectId } = object
    const shapeData = object.toJSON() as any
    shapeData.objectId = objectId
    const canvasObjects = storage.get('canvasObjects')
    canvasObjects.set(objectId!, shapeData)
  }, [])
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
    canvas.on("mouse:move", (options) => {
      handleCanvasMouseMove({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
        syncShapeInStorage
      })
    })
    canvas.on("mouse:up", (options) => {
      handleCanvasMouseUp({
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef
      })
    })
    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({ options, syncShapeInStorage })
    })

    window.addEventListener('resize', () => {
      handleResize({ canvas: fabricRef.current })
    })
  }, [])

  useEffect(() => {
    if (!canvasObjects) return
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef
    })
  }, [canvasObjects])

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
