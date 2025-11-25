"use client";
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import {
  Stage,
  Layer,
  Image as KImage,
  Rect,
  Text as KText,
  Transformer,
  Group,
  Line,
} from "react-konva";
import useImage from "use-image";

// Separate component to handle image loading with useImage hook
type CanvasImageProps = {
  id: string;
  src: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  draggable: boolean;
  onClick: () => void;
  onDragMove: (e: any) => void;
  onDragEnd: (e: any) => void;
  onTransformEnd: (e: any) => void;
};

const CanvasImage = ({
  id,
  src,
  x,
  y,
  width = 180,
  height = 180,
  rotation = 0,
  draggable,
  onClick,
  onDragMove,
  onDragEnd,
  onTransformEnd,
}: CanvasImageProps) => {
  const [image] = useImage(src, "anonymous");
  return (
    <KImage
      id={id}
      image={image as any}
      x={x}
      y={y}
      width={width}
      height={height}
      rotation={rotation}
      draggable={draggable}
      onClick={onClick}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
};

export type CanvasItem = {
  id: string;
  type: "text" | "image";
  // shared
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  // text
  text?: string;
  fill?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: "normal" | "bold" | "italic" | "bold italic";
  align?: "left" | "center" | "right";
  stroke?: string;
  strokeWidth?: number;
  // image
  src?: string;
};

export type CustomizerHandle = {
  addText: () => void;
  addImage: (file: File) => void;
  addImageFromUrl: (url: string) => void;
  setColor: (color: string) => void;
  setFontFamily: (family: string) => void;
  setFontSize: (size: number) => void;
  toggleBold: () => void;
  toggleItalic: () => void;
  alignText: (align: "left" | "center" | "right") => void;
  setStroke: (color: string) => void;
  setStrokeWidth: (w: number) => void;
  duplicateSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  deleteSelected: () => void;
  setSide: (s: "front" | "back" | "left-sleeve" | "right-sleeve") => void;
  toggleGrid: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  togglePan: () => void;
  resetPan: () => void;
  exportDesign: () => string | undefined;
  // return the currently selected item or null
  getSelected: () => CanvasItem | null;
  // update the selected text content
  setSelectedText: (text: string) => void;
  // set the garment/product color
  setGarmentColor: (color: string) => void;
  // get current garment color
  getGarmentColor: () => string;
};

type Props = {
  baseImage: string;
  // optional product id so the canvas can switch base images when changing sides
  productId?: string;
  // optional callback when selection changes
  onSelectionChange?: (item: CanvasItem | null) => void;
  // optional initial garment color
  initialGarmentColor?: string;
  // optional callback when garment color changes
  onGarmentColorChange?: (color: string) => void;
};

function useContainerSize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 520, height: 520 });
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setSize({ width: w, height: w });
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientWidth });
    return () => ro.disconnect();
  }, []);
  return { ref, ...size } as const;
}

const CustomizerCanvas = forwardRef<CustomizerHandle, Props>(
  function CustomizerCanvas({ baseImage, productId, onSelectionChange, initialGarmentColor, onGarmentColorChange }, ref) {
    const { ref: containerRef, width, height } = useContainerSize();
    const stageRef = useRef<any>(null);
    // allow switching the base depending on the selected side for some products
    const [currentBaseImage, setCurrentBaseImage] = useState<string>(baseImage);
    useEffect(() => setCurrentBaseImage(baseImage), [baseImage]);
    const [base] = useImage(currentBaseImage, "anonymous");
    // garment color state - default to white (no tint)
    const [garmentColor, setGarmentColorState] = useState<string>(initialGarmentColor || "#FFFFFF");

    const [side, setSide] = useState<
      "front" | "back" | "left-sleeve" | "right-sleeve"
    >("front");
    const [itemsBySide, setItemsBySide] = useState<
      Record<"front" | "back" | "left-sleeve" | "right-sleeve", CanvasItem[]>
    >({ front: [], back: [], "left-sleeve": [], "right-sleeve": [] });
    const items = itemsBySide[side];
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [scale, setScale] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [rotation, setRotation] = useState(0);
    // pan (hand tool) mode
    const [panMode, setPanMode] = useState(false);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    const printRect = useMemo(() => {
      // Adjust print area based on which side is being customized
      switch (side) {
        case "back":
          return {
            x: width * 0.28,
            y: height * 0.2,
            w: width * 0.44,
            h: height * 0.5,
          };
        case "left-sleeve":
        case "right-sleeve":
          return {
            x: width * 0.35,
            y: height * 0.15,
            w: width * 0.3,
            h: height * 0.3,
          };
        default: // front
          return {
            x: width * 0.28,
            y: height * 0.2,
            w: width * 0.44,
            h: height * 0.5,
          };
      }
    }, [width, height, side]);

    const setItems = (updater: (prev: CanvasItem[]) => CanvasItem[]) => {
      setItemsBySide((map) => ({ ...map, [side]: updater(map[side]) }));
    };

    const selected = items.find((i) => i.id === selectedId) || null;
    const clampToPrint = (x: number, y: number, w = 50, h = 20) => {
      const minX = printRect.x;
      const minY = printRect.y;
      const maxX = printRect.x + printRect.w - w;
      const maxY = printRect.y + printRect.h - h;
      return {
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y)),
      };
    };

    useImperativeHandle(
      ref,
      () => ({
        addText: () => {
          const id = crypto.randomUUID();
          setItems((arr) =>
            arr.concat({
              id,
              type: "text",
              text: "Votre texte",
              fill: "#111827",
              x: printRect.x + 20,
              y: printRect.y + 20,
              fontFamily: "Poppins",
              fontSize: 28,
              align: "left",
              fontStyle: "normal",
            })
          );
          setSelectedId(id);
        },
        addImage: (file: File) => {
          const reader = new FileReader();
          reader.onload = () => {
            const id = crypto.randomUUID();
            setItems((arr) =>
              arr.concat({
                id,
                type: "image",
                src: reader.result as string,
                x: printRect.x + 40,
                y: printRect.y + 40,
                width: 180,
                height: 180,
              })
            );
            setSelectedId(id);
          };
          reader.readAsDataURL(file);
        },
        addImageFromUrl: (url: string) => {
          const isRemote = url.startsWith("http");
          const safe = isRemote
            ? `/api/img?url=${encodeURIComponent(url)}`
            : url;
          const id = crypto.randomUUID();
          setItems((arr) =>
            arr.concat({
              id,
              type: "image",
              src: safe,
              x: printRect.x + 40,
              y: printRect.y + 40,
              width: 180,
              height: 180,
            })
          );
          setSelectedId(id);
        },
        setColor: (color: string) => {
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, fill: color }
                : i
            )
          );
        },
        setFontFamily: (family: string) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, fontFamily: family }
                : i
            )
          ),
        setFontSize: (size: number) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, fontSize: size }
                : i
            )
          ),
        toggleBold: () =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? {
                    ...i,
                    fontStyle: i.fontStyle?.includes("bold")
                      ? i.fontStyle?.includes("italic")
                        ? "italic"
                        : "normal"
                      : i.fontStyle?.includes("italic")
                        ? "bold italic"
                        : "bold",
                  }
                : i
            )
          ),
        toggleItalic: () =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? {
                    ...i,
                    fontStyle: i.fontStyle?.includes("italic")
                      ? i.fontStyle?.includes("bold")
                        ? "bold"
                        : "normal"
                      : i.fontStyle?.includes("bold")
                        ? "bold italic"
                        : "italic",
                  }
                : i
            )
          ),
        alignText: (align) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text" ? { ...i, align } : i
            )
          ),
        setStroke: (color: string) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, stroke: color }
                : i
            )
          ),
        setStrokeWidth: (w: number) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, strokeWidth: w }
                : i
            )
          ),
        duplicateSelected: () => {
          if (!selected) return;
          const id = crypto.randomUUID();
          setItems((arr) =>
            arr.concat({
              ...selected,
              id,
              x: (selected.x || 0) + 20,
              y: (selected.y || 0) + 20,
            })
          );
          setSelectedId(id);
        },
        bringForward: () =>
          setItems((arr) => {
            const idx = arr.findIndex((i) => i.id === selectedId);
            if (idx === -1) return arr;
            const copy = arr.slice();
            const [it] = copy.splice(idx, 1);
            copy.splice(Math.min(copy.length, idx + 1), 0, it);
            return copy;
          }),
        sendBackward: () =>
          setItems((arr) => {
            const idx = arr.findIndex((i) => i.id === selectedId);
            if (idx <= 0) return arr;
            const copy = arr.slice();
            const [it] = copy.splice(idx, 1);
            copy.splice(Math.max(0, idx - 1), 0, it);
            return copy;
          }),
        deleteSelected: () => {
          setItems((arr) => arr.filter((i) => i.id !== selectedId));
          setSelectedId(null);
        },
        setSide: (s) => {
          setSide(s);
          setSelectedId(null);
          // Animate rotation based on side
          const rotations = {
            front: 0,
            back: 180,
            // avoid rotating 90deg which makes the canvas edge-on and invisible — keep 0 for sleeves
            "left-sleeve": 0,
            "right-sleeve": 0,
          };
          setRotation(rotations[s] || 0);

          // For t-shirt product, switch the base image to show the selected side
          if (productId === "tshirt") {
            const mapping: Record<string, string> = {
              front: "/assets/tshirt/TShirtFront.png",
              back: "/assets/tshirt/TShirtBack.png",
              "left-sleeve": "/assets/tshirt/TShirtLeftSide.png",
              "right-sleeve": "/assets/tshirt/TShirtRightSide.png",
              // use front for heart side as fallback
              // heart-side removed; left/right will use their dedicated images
            };
            setCurrentBaseImage(mapping[s] || baseImage);
          }
        },
        toggleGrid: () => setShowGrid((v) => !v),
        zoomIn: () => setScale((s) => Math.min(2, +(s + 0.1).toFixed(2))),
        zoomOut: () => setScale((s) => Math.max(0.6, +(s - 0.1).toFixed(2))),
        resetZoom: () => {
          setScale(1);
          setStagePos({ x: 0, y: 0 });
        },
        togglePan: () => setPanMode((v) => !v),
        resetPan: () => setStagePos({ x: 0, y: 0 }),
        exportDesign: () => stageRef.current?.toDataURL({ pixelRatio: 2 }),
        getSelected: () => (selected ? selected : null),
        setSelectedText: (text: string) => {
          if (!selected || selected.type !== "text") return;
          setItems((arr) =>
            arr.map((i) => (i.id === selectedId ? { ...i, text } : i))
          );
        },
        setGarmentColor: (color: string) => {
          setGarmentColorState(color);
          onGarmentColorChange?.(color);
        },
        getGarmentColor: () => garmentColor,
      }),
      [selectedId, side, printRect, selected, garmentColor, onGarmentColorChange]
    );

    // inform parent component about selection changes
    useEffect(() => {
      onSelectionChange?.(selected || null);
    }, [selectedId, items, selected, onSelectionChange]);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          setItems((arr) => arr.filter((i) => i.id !== selectedId));
          setSelectedId(null);
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
          e.preventDefault();
          const s = items.find((i) => i.id === selectedId);
          if (s) {
            const id = crypto.randomUUID();
            setItems((arr) =>
              arr.concat({ ...s, id, x: (s.x || 0) + 20, y: (s.y || 0) + 20 })
            );
            setSelectedId(id);
          }
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [selectedId, items]);

    const onDragMove = (id: string, e: any) => {
      const node = e.target;
      const w = node.width() * (node.scaleX() || 1);
      const h = node.height() * (node.scaleY() || 1);
      const next = clampToPrint(node.x(), node.y(), w, h);
      node.x(next.x);
      node.y(next.y);
    };

    const onDragEnd = (id: string, e: any) => {
      const node = e.target;
      setItems((arr) =>
        arr.map((i) => (i.id === id ? { ...i, x: node.x(), y: node.y() } : i))
      );
    };

    const onTransformEnd = (id: string, node: any) => {
      const width = Math.max(10, node.width() * node.scaleX());
      const height = Math.max(10, node.height() * node.scaleY());
      node.scaleX(1);
      node.scaleY(1);
      const pos = clampToPrint(node.x(), node.y(), width, height);
      node.x(pos.x);
      node.y(pos.y);
      setItems((arr) =>
        arr.map((i) =>
          i.id === id
            ? {
                ...i,
                x: node.x(),
                y: node.y(),
                width,
                height,
                rotation: node.rotation(),
              }
            : i
        )
      );
    };

    const SelectedTransformer = () => {
      const trRef = useRef<any>(null);
      useEffect(() => {
        const stage = stageRef.current as any;
        const layer = trRef.current?.getLayer();
        const node = stage?.findOne(`#node-${selectedId}`);
        if (trRef.current && node) {
          trRef.current.nodes([node]);
          trRef.current.getLayer()?.batchDraw();
        }
        return () => {
          layer?.batchDraw();
        };
      }, [selectedId, items, scale]);
      return <Transformer ref={trRef} rotateEnabled={true} anchorSize={8} />;
    };

    const drawGrid = () => {
      const lines = [];
      if (!showGrid) return null;
      const step = 20;
      for (let x = printRect.x; x <= printRect.x + printRect.w; x += step) {
        lines.push(
          <Line
            key={`vx-${x}`}
            points={[x, printRect.y, x, printRect.y + printRect.h]}
            stroke="#e5e7eb"
            strokeWidth={1}
            listening={false}
          />
        );
      }
      for (let y = printRect.y; y <= printRect.y + printRect.h; y += step) {
        lines.push(
          <Line
            key={`hz-${y}`}
            points={[printRect.x, y, printRect.x + printRect.w, y]}
            stroke="#e5e7eb"
            strokeWidth={1}
            listening={false}
          />
        );
      }
      return lines;
    };

    return (
      <div ref={containerRef} className="w-full">
        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-3 relative overflow-hidden">
          <div
            className="transition-transform duration-700 ease-in-out"
            style={{ transform: `rotateY(${rotation}deg)` }}
          >
            <Stage
              ref={stageRef}
              width={width}
              height={height}
              scaleX={scale}
              scaleY={scale}
              x={stagePos.x}
              y={stagePos.y}
              draggable={panMode}
              onDragEnd={(e) => {
                setStagePos({ x: e.target.x(), y: e.target.y() });
              }}
              style={{ cursor: panMode ? "grab" : "default" }}
              className="bg-white rounded-md"
            >
              <Layer>
                {base && (
                  <KImage
                    image={base as any}
                    width={width}
                    height={height}
                    listening={false}
                  />
                )}
                {/* Garment color overlay - uses multiply blend mode to tint the garment */}
                {garmentColor && garmentColor !== "#FFFFFF" && (
                  <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill={garmentColor}
                    opacity={0.85}
                    globalCompositeOperation="multiply"
                    listening={false}
                  />
                )}
                {/* Print area and grid */}
                <Group listening={false}>
                  {drawGrid()}
                  <Rect
                    x={printRect.x}
                    y={printRect.y}
                    width={printRect.w}
                    height={printRect.h}
                    stroke="#ef4444"
                    dash={[6, 4]}
                    cornerRadius={6}
                    opacity={0.7}
                  />
                </Group>

                {items.map((it) =>
                  it.type === "image" ? (
                    <CanvasImage
                      key={it.id}
                      id={`node-${it.id}`}
                      src={it.src!}
                      x={it.x}
                      y={it.y}
                      width={it.width}
                      height={it.height}
                      rotation={it.rotation}
                      draggable
                      onClick={() => setSelectedId(it.id)}
                      onDragMove={(e) => onDragMove(it.id, e)}
                      onDragEnd={(e) => onDragEnd(it.id, e)}
                      onTransformEnd={(e) => onTransformEnd(it.id, e.target)}
                    />
                  ) : (
                    <KText
                      key={it.id}
                      id={`node-${it.id}`}
                      text={it.text || ""}
                      x={it.x}
                      y={it.y}
                      fill={it.fill || "#111827"}
                      fontFamily={it.fontFamily || "Poppins"}
                      fontStyle={it.fontStyle || "normal"}
                      fontSize={it.fontSize || 28}
                      align={it.align || "left"}
                      stroke={it.stroke}
                      strokeWidth={it.strokeWidth}
                      draggable
                      onClick={() => setSelectedId(it.id)}
                      onDragMove={(e) => onDragMove(it.id, e)}
                      onDragEnd={(e) => onDragEnd(it.id, e)}
                      onTransformEnd={(e) => onTransformEnd(it.id, e.target)}
                    />
                  )
                )}
                {selectedId && <SelectedTransformer />}
              </Layer>
            </Stage>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span>
              Zone d'impression {Math.round(printRect.w)}×
              {Math.round(printRect.h)} px
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
              {side === "front" && "Avant"}
              {side === "back" && "Arrière"}
              {side === "left-sleeve" && "Manche gauche"}
              {side === "right-sleeve" && "Manche droite"}
            </span>
          </div>
          <div className="font-medium">Zoom: {Math.round(scale * 100)}%</div>
        </div>
      </div>
    );
  }
);

export default CustomizerCanvas;
