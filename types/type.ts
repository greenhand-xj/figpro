import { BaseUserMeta, LiveMap, User } from "@liveblocks/client";
import { Gradient, Pattern } from "fabric/fabric-impl";

export enum CursorMode {
  Hidden,
  Chat,
  ReactionSelector,
  Reaction,
}

export type CursorState =
  | {
    mode: CursorMode.Hidden;
  }
  | {
    mode: CursorMode.Chat;
    message: string;
    previousMessage: string | null;
  }
  | {
    mode: CursorMode.ReactionSelector;
  }
  | {
    mode: CursorMode.Reaction;
    reaction: string;
    isPressed: boolean;
  };

export type Reaction = {
  value: string;
  timestamp: number;
  point: { x: number; y: number };
};

export type ReactionEvent = {
  x: number;
  y: number;
  value: string;
};

export type ShapeData = {
  type: string;
  width: number;
  height: number;
  fill: string | Pattern | Gradient;
  left: number;
  top: number;
  objectId: string | undefined;
};

export type Attributes = {
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  stroke: string;
};

export type ActiveElement = {
  name: string;
  value: string | ActiveElement[];
  icon: string;
};

export type MustBeArrayActiveElement = Omit<ActiveElement, 'value'> & {
  value: ActiveElement[];
}
export interface CustomFabricObject<T extends fabric.Object = fabric.Object>
  extends fabric.Object {
  objectId?: string;
}

export type ShapeType = "rectangle" | "triangle" | "circle" | "line" | "text" | 'freeform' | 'select' | 'image';

export type SpecificShapeType = Exclude<ShapeType, 'freeform' | 'select' | 'image'>
export type Pointer = { x: number; y: number };
export type ShapePropertiesType = Exclude<ShapeType, 'select' | 'text' | 'freeform'>
export type ShapeProperties = Record<ShapePropertiesType, (shapeRef: CanvasMouseMove['shapeRef'], pointer: Pointer) => any>;

export type ModifyShape = {
  canvas: fabric.Canvas;
  property: string;
  value: any;
  activeObjectRef: React.MutableRefObject<fabric.Object | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type ElementDirection = {
  canvas: fabric.Canvas;
  direction: string;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type ImageUpload = {
  file: File;
  canvas: React.MutableRefObject<fabric.Canvas>;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type RightSidebarProps = {
  elementAttributes: Attributes;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
  fabricRef: React.RefObject<fabric.Canvas | null>;
  activeObjectRef: React.RefObject<fabric.Object | null>;
  isEditingRef: React.MutableRefObject<boolean>;
  syncShapeInStorage: (obj: any) => void;
};

export type NavbarProps = {
  activeElement: ActiveElement;
  imageInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleActiveElement: (element: ActiveElement) => void;
};

export type ShapesMenuProps = {
  item: {
    name: string;
    icon: string;
    value: ActiveElement[];
  };
  activeElement: ActiveElement;
  handleActiveElement: any;
  handleImageUpload: any;
  imageInputRef: any;
};

export type Presence = any;

export type LiveCursorProps = {
  others: readonly User<Presence, BaseUserMeta>[];
};

export type CanvasMouseDown = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedShapeRef: React.MutableRefObject<ShapeType>;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: React.MutableRefObject<fabric.Object | null>;
};

export type CanvasMouseMove = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  selectedShapeRef: React.MutableRefObject<ShapeType>;
  shapeRef: React.MutableRefObject<CustomFabricObject | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type CanvasMouseUp = {
  canvas: fabric.Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: React.MutableRefObject<CustomFabricObject | null>;
  activeObjectRef: React.MutableRefObject<CustomFabricObject | null>;
  selectedShapeRef: React.MutableRefObject<ShapeType | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
  setActiveElement: React.Dispatch<React.SetStateAction<ActiveElement>>;
};

export type CanvasObjectModified = {
  options: fabric.IEvent;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type CanvasPathCreated = {
  options: (fabric.IEvent & { path: CustomFabricObject<fabric.Path> }) | any;
  syncShapeInStorage: (shape: fabric.Object) => void;
};

export type CanvasSelectionCreated = {
  options: fabric.IEvent;
  isEditingRef: React.MutableRefObject<boolean>;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type CanvasObjectScaling = {
  options: fabric.IEvent;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type RenderCanvas = {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasObjects: ReadonlyMap<string, CustomFabricObject & { [key: string]: any }>;
  activeObjectRef: React.MutableRefObject<CustomFabricObject | null>;
};

export type CursorChatProps = {
  cursor: { x: number; y: number };
  cursorState: CursorState;
  setCursorState: (cursorState: CursorState) => void;
  updateMyPresence: (
    presence: Partial<{
      cursor: { x: number; y: number };
      cursorColor: string;
      message: string;
    }>
  ) => void;
};
