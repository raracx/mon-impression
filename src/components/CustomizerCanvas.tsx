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
import Konva from "konva";
import { products } from "@/data/products";

// Helper function to load image from URL or data URL
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Render a specific side to image without UI state changes
const renderSideToImage = async (
  sideName: string,
  items: CanvasItem[],
  baseImage: string,
  width: number,
  height: number,
  garmentColor: string,
): Promise<string> => {
  // Create an offscreen stage
  const offscreenStage = new Konva.Stage({
    container: document.createElement("div"),
    width: width,
    height: height,
  });

  const layer = new Konva.Layer();
  offscreenStage.add(layer);

  // Load and add base image
  try {
    const baseImg = await loadImage(baseImage);
    const baseKonvaImage = new Konva.Image({
      image: baseImg,
      width: width,
      height: height,
      listening: false,
    });
    layer.add(baseKonvaImage);
  } catch (error) {
    console.error("Failed to load base image:", error);
  }

  // Add garment color overlay if not white
  if (garmentColor && garmentColor !== "#FFFFFF") {
    const colorOverlay = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: garmentColor,
      globalCompositeOperation: "source-atop",
      listening: false,
    });
    layer.add(colorOverlay);
  }

  // Add all items (images and text) for this side
  for (const item of items) {
    if (item.type === "image" && item.src) {
      try {
        const img = await loadImage(item.src);
        const konvaImage = new Konva.Image({
          image: img,
          x: item.x,
          y: item.y,
          width: item.width || 180,
          height: item.height || 180,
          rotation: item.rotation || 0,
          listening: false,
        });
        layer.add(konvaImage);
      } catch (error) {
        console.error(`Failed to load image for item ${item.id}:`, error);
      }
    } else if (item.type === "text") {
      const konvaText = new Konva.Text({
        x: item.x,
        y: item.y,
        text: item.text || "",
        fontSize: item.fontSize || 28,
        fontFamily: item.fontFamily || "Poppins",
        fill: item.fill || "#111827",
        align: item.align || "left",
        rotation: item.rotation || 0,
        fontStyle: item.fontStyle || "normal",
        stroke: item.stroke,
        strokeWidth: item.strokeWidth || 0,
        listening: false,
      });
      layer.add(konvaText);
    }
  }

  // Draw and export
  layer.draw();
  const dataUrl = offscreenStage.toDataURL({ pixelRatio: 2 });

  // Cleanup
  offscreenStage.destroy();

  return dataUrl;
};

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
  source?: "upload" | "library"; // Track if image is user upload or platform library
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
  // get which sides have been customized
  getCustomizedSides: () => (
    | "front"
    | "back"
    | "left-sleeve"
    | "right-sleeve"
  )[];
  // export all sides that have been customized, keyed by side
  exportAllSides: () => Promise<Record<string, string>>;
  // get all raw assets used (separate user uploads from library assets)
  getRawAssets: () => {
    userUploads: Array<{ id: string; src: string; side: string }>;
    libraryAssets: Array<{ id: string; src: string; side: string }>;
  };
  // get the current canvas state for saving to cart
  getCanvasState: () => {
    itemsBySide: Record<string, CanvasItem[]>;
    garmentColor: string;
    uploadedAssets: Array<{
      id: string;
      file: File;
      dataUrl: string;
      side: string;
    }>;
  };
  // load a canvas state for editing
  loadCanvasState: (state: {
    itemsBySide: Record<string, CanvasItem[]>;
    garmentColor: string;
  }) => void;
};

type Props = {
  baseImage: string;
  // optional product id so the canvas can switch base images when changing sides
  productId?: string;
  // optional selected color id for the product
  selectedColor?: string;
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
      const w = Math.min(el.clientWidth, 560);
      setSize({ width: w, height: w });
    });
    ro.observe(el);
    setSize({
      width: Math.min(el.clientWidth, 560),
      height: Math.min(el.clientWidth, 560),
    });
    return () => ro.disconnect();
  }, []);
  return { ref, ...size } as const;
}

const CustomizerCanvas = forwardRef<CustomizerHandle, Props>(
  function CustomizerCanvas(
    {
      baseImage,
      productId,
      selectedColor,
      onSelectionChange,
      initialGarmentColor,
      onGarmentColorChange,
    },
    ref,
  ) {
    const { ref: containerRef, width, height } = useContainerSize();
    const stageRef = useRef<any>(null);
    // allow switching the base depending on the selected side for some products
    const [currentBaseImage, setCurrentBaseImage] = useState<string>(baseImage);
    useEffect(() => setCurrentBaseImage(baseImage), [baseImage]);
    const [base] = useImage(currentBaseImage, "anonymous");
    // garment color state - default to white (no tint)
    const [garmentColor, setGarmentColorState] = useState<string>(
      initialGarmentColor || "#FFFFFF",
    );

    const [side, setSide] = useState<
      "front" | "back" | "left-sleeve" | "right-sleeve"
    >("front");
    const [itemsBySide, setItemsBySide] = useState<
      Record<"front" | "back" | "left-sleeve" | "right-sleeve", CanvasItem[]>
    >({ front: [], back: [], "left-sleeve": [], "right-sleeve": [] });
    const items = itemsBySide[side];
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [scale, setScale] = useState(1);
    const [showGrid, setShowGrid] = useState(false);
    const [rotation, setRotation] = useState(0);
    // pan (hand tool) mode
    const [panMode, setPanMode] = useState(false);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    const printRect = useMemo(() => {
      // Make the entire image editable area
      return {
        x: 0,
        y: 0,
        w: width,
        h: height,
      };
    }, [width, height]);

    const setItems = (updater: (prev: CanvasItem[]) => CanvasItem[]) => {
      setItemsBySide((map) => ({ ...map, [side]: updater(map[side]) }));
    };

    const selected = items.find((i) => i.id === selectedId) || null;
    const clampToPrint = (x: number, y: number, w = 50, h = 20) => {
      // Allow placement anywhere on the full image
      const minX = 0;
      const minY = 0;
      const maxX = width - w;
      const maxY = height - h;
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
                source: "upload", // Mark as user upload
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
              source: "library", // Mark as library asset
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
          // Don't use CSS rotation - base image switching handles the view changes
          setRotation(0);

          // Switch the base image to show the selected side using products data
          if (productId) {
            const product = products.find((p) => p.id === productId);
            if (product && product.colors && product.colors.length > 0) {
              const color =
                product.colors.find((c) => c.id === selectedColor) ||
                product.colors[0];
              const sideImage =
                color.images[s] || color.images.front || baseImage;
              setCurrentBaseImage(sideImage);
            } else {
              // Fallback for products without colors
              setCurrentBaseImage(baseImage);
            }
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
            arr.map((i) => (i.id === selectedId ? { ...i, text } : i)),
          );
        },
        setGarmentColor: (color: string) => {
          setGarmentColorState(color);
          onGarmentColorChange?.(color);
        },
        getGarmentColor: () => garmentColor,
        getCustomizedSides: () => {
          // Return array of sides that have items
          const customizedSides: (
            | "front"
            | "back"
            | "left-sleeve"
            | "right-sleeve"
          )[] = [];
          (
            Object.keys(itemsBySide) as (
              | "front"
              | "back"
              | "left-sleeve"
              | "right-sleeve"
            )[]
          ).forEach((s) => {
            if (itemsBySide[s].length > 0) {
              customizedSides.push(s);
            }
          });
          return customizedSides;
        },
        exportAllSides: async () => {
          // Export design for all customized sides by rendering directly
          const exports: Record<string, string> = {};
          const customizedSides = (
            Object.keys(itemsBySide) as (
              | "front"
              | "back"
              | "left-sleeve"
              | "right-sleeve"
            )[]
          ).filter((s) => itemsBySide[s].length > 0);

          // Get base image for each side from products data
          const getBaseImageForSide = (
            sideName: "front" | "back" | "left-sleeve" | "right-sleeve",
          ): string => {
            if (productId) {
              const product = products.find((p) => p.id === productId);
              if (product && product.colors && product.colors.length > 0) {
                const color =
                  product.colors.find((c) => c.id === selectedColor) ||
                  product.colors[0];
                return (
                  color.images[sideName] || color.images.front || baseImage
                );
              } else if (product) {
                // Fallback for products without colors - use defaultImage
                return product.defaultImage || baseImage;
              }
            }
            return baseImage;
          };

          for (const s of customizedSides) {
            try {
              const sideBaseImage = getBaseImageForSide(s);
              const dataUrl = await renderSideToImage(
                s,
                itemsBySide[s],
                sideBaseImage,
                width,
                height,
                garmentColor,
              );
              if (dataUrl) {
                exports[s] = dataUrl;
              }
            } catch (error) {
              console.error(`Failed to export side ${s}:`, error);
            }
          }

          return exports;
        },
        getRawAssets: () => {
          const userUploads: Array<{ id: string; src: string; side: string }> =
            [];
          const libraryAssets: Array<{
            id: string;
            src: string;
            side: string;
          }> = [];

          // Iterate through all sides
          (
            Object.keys(itemsBySide) as (
              | "front"
              | "back"
              | "left-sleeve"
              | "right-sleeve"
            )[]
          ).forEach((sideName) => {
            const items = itemsBySide[sideName];
            items.forEach((item) => {
              if (item.type === "image" && item.src) {
                const asset = { id: item.id, src: item.src, side: sideName };
                if (item.source === "upload") {
                  userUploads.push(asset);
                } else if (item.source === "library") {
                  libraryAssets.push(asset);
                } else {
                  // If source is not set, try to determine from src
                  // Data URLs are user uploads, paths are library assets
                  if (item.src.startsWith("data:")) {
                    userUploads.push(asset);
                  } else {
                    libraryAssets.push(asset);
                  }
                }
              }
            });
          });

          return { userUploads, libraryAssets };
        },
        getCanvasState: () => {
          // Collect uploaded assets (files with data URLs) with side information
          const uploadedAssets: Array<{
            id: string;
            file: File;
            dataUrl: string;
            side: string;
          }> = [];

          // Iterate through all items to find uploaded images
          Object.entries(itemsBySide).forEach(([sideName, sideItems]) => {
            sideItems.forEach((item) => {
              if (
                item.type === "image" &&
                item.src &&
                item.src.startsWith("data:") &&
                item.source === "upload"
              ) {
                // For uploaded images, we need to reconstruct the File object
                // Since we can't store File objects directly, we'll store the dataUrl
                // and create a placeholder File when loading
                uploadedAssets.push({
                  id: item.id,
                  file: new File([], "uploaded-image"), // Placeholder, will be reconstructed
                  dataUrl: item.src,
                  side: sideName,
                });
              }
            });
          });

          return {
            itemsBySide,
            garmentColor,
            uploadedAssets,
          };
        },
        loadCanvasState: (state) => {
          setItemsBySide(state.itemsBySide);
          setGarmentColorState(state.garmentColor);
        },
      }),
      [
        selectedId,
        side,
        printRect,
        selected,
        garmentColor,
        onGarmentColorChange,
        itemsBySide,
        baseImage,
        width,
        height,
        productId,
        selectedColor,
      ],
    );

    // inform parent component about selection changes
    useEffect(() => {
      onSelectionChange?.(selected || null);
    }, [selectedId, items, selected, onSelectionChange]);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        const isEditingField =
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          tag === "OPTION" ||
          target?.isContentEditable;

        // Avoid deleting the entire text block when user is typing in an input/textarea
        if (isEditingField) return;

        if (e.key === "Delete" || e.key === "Backspace") {
          setItems((arr) => arr.filter((i) => i.id !== selectedId));
          setSelectedId(null);
        }
        if (e.key === "Escape") {
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
      e.cancelBubble = true;
      const node = e.target;
      const w = node.width() * (node.scaleX() || 1);
      const h = node.height() * (node.scaleY() || 1);
      const next = clampToPrint(node.x(), node.y(), w, h);
      node.x(next.x);
      node.y(next.y);
    };

    const onDragEnd = (id: string, e: any) => {
      e.cancelBubble = true;
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
      for (let x = 0; x <= width; x += step) {
        lines.push(
          <Line
            key={`vx-${x}`}
            points={[x, 0, x, height]}
            stroke="#e5e7eb"
            strokeWidth={1}
            listening={false}
          />
        );
      }
      for (let y = 0; y <= height; y += step) {
        lines.push(
          <Line
            key={`hz-${y}`}
            points={[0, y, width, y]}
            stroke="#e5e7eb"
            strokeWidth={1}
            listening={false}
          />
        );
      }
      return lines;
    };

    return (
      <div ref={containerRef} className="flex justify-center">
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
              onClick={(e) => {
                // Deselect if clicking on empty space (stage background)
                if (e.target === e.target.getStage()) {
                  setSelectedId(null);
                }
              }}
              {...(panMode && {
                onDragEnd: (e: any) => {
                  setStagePos({ x: e.target.x(), y: e.target.y() });
                },
              })}
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
                <Group listening={false}>{drawGrid()}</Group>

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
      </div>
    );
  },
);

export default CustomizerCanvas;
