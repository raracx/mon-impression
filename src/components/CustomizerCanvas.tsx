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
  setSide: (s: "front" | "back") => void;
  toggleGrid: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  exportDesign: () => string | undefined;
};

type Props = {
  baseImage: string;
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
  function CustomizerCanvas({ baseImage }, ref) {
    const { ref: containerRef, width, height } = useContainerSize();
    const stageRef = useRef<any>(null);
    const [base] = useImage(baseImage, "anonymous");

    const [side, setSide] = useState<"front" | "back">("front");
    const [itemsBySide, setItemsBySide] = useState<
      Record<"front" | "back", CanvasItem[]>
    >({ front: [], back: [] });
    const items = itemsBySide[side];
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [scale, setScale] = useState(1);
    const [showGrid, setShowGrid] = useState(true);

    const printRect = useMemo(
      () => ({
        x: width * 0.28,
        y: height * 0.2,
        w: width * 0.44,
        h: height * 0.5,
      }),
      [width, height],
    );

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
            }),
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
              }),
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
            }),
          );
          setSelectedId(id);
        },
        setColor: (color: string) => {
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, fill: color }
                : i,
            ),
          );
        },
        setFontFamily: (family: string) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, fontFamily: family }
                : i,
            ),
          ),
        setFontSize: (size: number) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, fontSize: size }
                : i,
            ),
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
                : i,
            ),
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
                : i,
            ),
          ),
        alignText: (align) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text" ? { ...i, align } : i,
            ),
          ),
        setStroke: (color: string) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, stroke: color }
                : i,
            ),
          ),
        setStrokeWidth: (w: number) =>
          setItems((arr) =>
            arr.map((i) =>
              i.id === selectedId && i.type === "text"
                ? { ...i, strokeWidth: w }
                : i,
            ),
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
            }),
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
        },
        toggleGrid: () => setShowGrid((v) => !v),
        zoomIn: () => setScale((s) => Math.min(2, +(s + 0.1).toFixed(2))),
        zoomOut: () => setScale((s) => Math.max(0.6, +(s - 0.1).toFixed(2))),
        resetZoom: () => setScale(1),
        exportDesign: () => stageRef.current?.toDataURL({ pixelRatio: 2 }),
      }),
      [selectedId, side, printRect],
    );

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
              arr.concat({ ...s, id, x: (s.x || 0) + 20, y: (s.y || 0) + 20 }),
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
      const next = clampToPrint(
        node.x(),
        node.y(),
        node.width(),
        node.height(),
      );
      node.x(next.x);
      node.y(next.y);
      setItems((arr) =>
        arr.map((i) => (i.id === id ? { ...i, x: node.x(), y: node.y() } : i)),
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
            : i,
        ),
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
          />,
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
          />,
        );
      }
      return lines;
    };

    return (
      <div ref={containerRef} className="w-full">
        <div className="card p-2">
          <Stage
            ref={stageRef}
            width={width}
            height={height}
            scaleX={scale}
            scaleY={scale}
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
                    onTransformEnd={(e) => onTransformEnd(it.id, e.target)}
                  />
                ),
              )}
              {selectedId && <SelectedTransformer />}
            </Layer>
          </Stage>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
          <div>
            Zone d’impression {Math.round(printRect.w)}×
            {Math.round(printRect.h)} px — Côté:{" "}
            <span className="font-semibold">{side}</span>
          </div>
          <div>Zoom: {Math.round(scale * 100)}%</div>
        </div>
      </div>
    );
  },
);

export default CustomizerCanvas;
