"use client";

import {
  useRef,
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Stage, Layer, Image as KImage, Text as KText } from "react-konva";
import useImage from "use-image";

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

type LogoPosition = {
  x: number; // percentage (0-1)
  y: number; // percentage (0-1)
  w: number; // percentage (0-1)
  h: number; // percentage (0-1)
};

type Props = {
  baseImage: string;
  logoImage?: string;
  side?: "front" | "back";
  logoPosition?: LogoPosition;
  frontText?: string;
  frontTextPosition?: {
    x: number; // percentage (0-1)
    y: number; // percentage (0-1)
    fontSize: number; // percentage of canvas width (0-1)
  };
  backLogoImage?: string;
  backLogoPosition?: LogoPosition;
};

export type ProductPreviewHandle = {
  exportImage: () => string | undefined;
};

const ProductPreviewCanvas = forwardRef<ProductPreviewHandle, Props>(
  function ProductPreviewCanvas(
    {
      baseImage,
      logoImage = "/assets/logo-defaults/youtube-logo.svg",
      side = "front",
      logoPosition = { x: 0.22, y: 0.28, w: 0.15, h: 0.15 },
      frontText = "",
      frontTextPosition = { x: 0.5, y: 0.65, fontSize: 0.06 },
      backLogoImage = "/assets/logo-defaults/youtube-long-logo.svg",
      backLogoPosition = { x: 0.2, y: 0.35, w: 0.6, h: 0.15 },
    }: Props,
    ref,
  ) {
    const { ref: containerRef, width, height } = useContainerSize();
    const stageRef = useRef<any>(null);
    const [base] = useImage(baseImage, "anonymous");
    const [logo] = useImage(logoImage, "anonymous");
    const [backLogo] = useImage(backLogoImage, "anonymous");

    // Logo position on left chest (configurable via props)
    const logoRect = useMemo(
      () => ({
        x: width * logoPosition.x,
        y: height * logoPosition.y,
        w: width * logoPosition.w,
        h: height * logoPosition.h,
      }),
      [width, height, logoPosition],
    );

    useImperativeHandle(
      ref,
      () => ({
        exportImage: () => stageRef.current?.toDataURL({ pixelRatio: 2 }),
      }),
      [],
    );

    return (
      <div ref={containerRef} className="w-full">
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          className="w-full h-full"
        >
          <Layer>
            {/* Base product image */}
            {base && (
              <KImage
                image={base as any}
                width={width}
                height={height}
                listening={false}
              />
            )}

            {/* Logo overlay - only show on front side */}
            {side === "front" && logo && (
              <KImage
                image={logo as any}
                x={logoRect.x}
                y={logoRect.y}
                width={logoRect.w}
                height={logoRect.h}
                listening={false}
                opacity={0.9}
              />
            )}

            {/* Front text - only show on front side */}
            {side === "front" && frontText && (
              <KText
                text={frontText}
                x={width * frontTextPosition.x}
                y={height * frontTextPosition.y}
                fontSize={width * frontTextPosition.fontSize}
                fontFamily="Arial"
                fontStyle="bold"
                fill="#000000"
                align="center"
                width={width * 0.8}
                offsetX={(width * 0.8) / 2}
                listening={false}
              />
            )}

            {/* Back long logo - only show on back side */}
            {side === "back" && backLogo && (
              <KImage
                image={backLogo as any}
                x={width * backLogoPosition.x}
                y={height * backLogoPosition.y}
                width={width * backLogoPosition.w}
                height={height * backLogoPosition.h}
                listening={false}
                opacity={0.9}
              />
            )}
          </Layer>
        </Stage>
      </div>
    );
  },
);

export default ProductPreviewCanvas;
