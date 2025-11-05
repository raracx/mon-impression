"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";

type Props = {
  onAddText: () => void;
  onUploadImage: (file: File) => void;
  onColor: (color: string) => void;
  onDelete: () => void;
  onFontFamily: (family: string) => void;
  onFontSize: (size: number) => void;
  onBold: () => void;
  onItalic: () => void;
  onAlign: (align: "left" | "center" | "right") => void;
  onStroke: (color: string) => void;
  onStrokeWidth: (w: number) => void;
  onDuplicate: () => void;
  onForward: () => void;
  onBackward: () => void;
  onToggleGrid: () => void;
  onSetSide: (s: "front" | "back") => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onExport: () => void;
};

export default function Toolbox(props: Props) {
  const t = useTranslations("toolbox");
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{t("title")}</div>
        <div className="flex gap-2">
          <button
            className="btn-primary"
            onClick={() => props.onSetSide("front")}
          >
            {t("sides.front")}
          </button>
          <button
            className="btn-primary"
            onClick={() => props.onSetSide("back")}
          >
            {t("sides.back")}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={props.onAddText}>
          {t("actions.addText")}
        </button>
        <button
          className="btn-primary"
          onClick={() => inputRef.current?.click()}
        >
          {t("actions.uploadImage")}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) props.onUploadImage(f);
            e.currentTarget.value = "";
          }}
        />
        <button className="btn-primary" onClick={props.onDuplicate}>
          {t("actions.duplicate")}
        </button>
        <button className="btn-primary" onClick={props.onForward}>
          {t("actions.bringForward")}
        </button>
        <button className="btn-primary" onClick={props.onBackward}>
          {t("actions.sendBackward")}
        </button>
        <button className="btn-primary" onClick={props.onDelete}>
          {t("actions.delete")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs text-slate-500">
            {t("properties.font")}
          </label>
          <select
            onChange={(e) => props.onFontFamily(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="Poppins">Poppins</option>
            <option value="Arial">Arial</option>
            <option value="Impact">Impact</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-500">
            {t("properties.size")}
          </label>
          <input
            type="range"
            min={10}
            max={96}
            defaultValue={28}
            onChange={(e) => props.onFontSize(parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-500">
            {t("properties.color")}
          </label>
          <input
            type="color"
            onChange={(e) => props.onColor(e.target.value)}
            className="h-10 w-full rounded-md border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-500">
            {t("properties.stroke")}
          </label>
          <input
            type="color"
            onChange={(e) => props.onStroke(e.target.value)}
            className="h-10 w-full rounded-md border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-500">
            {t("properties.strokeWidth")}
          </label>
          <input
            type="range"
            min={0}
            max={8}
            defaultValue={0}
            onChange={(e) => props.onStrokeWidth(parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-500">
            {t("properties.style")}
          </label>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={props.onBold}>
              {t("properties.bold")}
            </button>
            <button className="btn-primary" onClick={props.onItalic}>
              {t("properties.italic")}
            </button>
          </div>
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-xs text-slate-500">
            {t("properties.alignment")}
          </label>
          <div className="flex gap-2">
            <button
              className="btn-primary"
              onClick={() => props.onAlign("left")}
            >
              {t("properties.left")}
            </button>
            <button
              className="btn-primary"
              onClick={() => props.onAlign("center")}
            >
              {t("properties.center")}
            </button>
            <button
              className="btn-primary"
              onClick={() => props.onAlign("right")}
            >
              {t("properties.right")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={props.onZoomOut}>
          {t("zoom.out")}
        </button>
        <button className="btn-primary" onClick={props.onZoomIn}>
          {t("zoom.in")}
        </button>
        <button className="btn-primary" onClick={props.onResetZoom}>
          {t("zoom.reset")}
        </button>
        <button className="btn-primary" onClick={props.onToggleGrid}>
          {t("grid")}
        </button>
        <button className="btn-primary" onClick={props.onExport}>
          {t("export")}
        </button>
      </div>

      <p className="text-sm text-slate-600">{t("tip")}</p>
    </div>
  );
}
