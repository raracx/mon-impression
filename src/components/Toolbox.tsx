"use client";
import React, { useRef } from "react";
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
  onSetSide: (s: "front" | "back" | "left-sleeve" | "right-sleeve") => void;
  productId?: string;
  // selected text value (if an editable text node is selected)
  selectedText?: string;
  // whether the selected item is a text node
  isTextSelected?: boolean;
  // callback to update the selected text
  onEditText?: (text: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onTogglePan: () => void;
  panMode?: boolean;
  onExport: () => void;
};

export default function Toolbox(props: Props) {
  const t = useTranslations("toolbox");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeSide, setActiveSide] = React.useState<string>("front");
  const [editingText, setEditingText] = React.useState<string>("");

  const handleSetSide = (
    side: "front" | "back" | "left-sleeve" | "right-sleeve"
  ) => {
    setActiveSide(side);
    props.onSetSide(side);
  };

  React.useEffect(() => {
    if (props.isTextSelected) setEditingText(props.selectedText || "");
  }, [props.isTextSelected, props.selectedText]);

  const isTshirt = props.productId === "tshirt";

  const Thumb = ({ src, label }: { src: string; label: string }) => (
    <div className="flex flex-col items-center gap-2 w-full">
      <img
        src={src}
        alt={label}
        className="w-24 h-24 object-contain rounded-md border border-slate-200"
      />
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* View Selection */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          {t("viewSection")}
        </h3>
        {/* 2x2 grid for the 4 side selectors so they're not all in one row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
          <button
            className={`py-2.5 px-3 text-xs font-medium rounded-lg border-2 transition-all ${
              activeSide === "front"
                ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
            onClick={() => handleSetSide("front")}
          >
            {isTshirt ? (
              <div className="flex items-center gap-3">
                <Thumb
                  src="/assets/tshirt/TShirtFront.png"
                  label={t("sides.front")}
                />
              </div>
            ) : (
              t("sides.front")
            )}
          </button>
          <button
            className={`py-2.5 px-3 text-xs font-medium rounded-lg border-2 transition-all ${
              activeSide === "back"
                ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
            onClick={() => handleSetSide("back")}
          >
            {isTshirt ? (
              <div className="flex items-center gap-3">
                <Thumb
                  src="/assets/tshirt/TShirtBack.png"
                  label={t("sides.back")}
                />
              </div>
            ) : (
              t("sides.back")
            )}
          </button>
          <button
            className={`py-2.5 px-3 text-xs font-medium rounded-lg border-2 transition-all ${
              activeSide === "left-sleeve"
                ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
            onClick={() => handleSetSide("left-sleeve")}
          >
            {isTshirt ? (
              <div className="flex items-center gap-3">
                <Thumb
                  src="/assets/tshirt/TShirtLeftSide.png"
                  label={t("sides.leftSleeve")}
                />
              </div>
            ) : (
              t("sides.leftSleeve")
            )}
          </button>
          <button
            className={`py-2.5 px-3 text-xs font-medium rounded-lg border-2 transition-all ${
              activeSide === "right-sleeve"
                ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
            onClick={() => handleSetSide("right-sleeve")}
          >
            {isTshirt ? (
              <div className="flex items-center gap-3">
                <Thumb
                  src="/assets/tshirt/TShirtRightSide.png"
                  label={t("sides.rightSleeve")}
                />
              </div>
            ) : (
              t("sides.rightSleeve")
            )}
          </button>
          {/* no heart-side */}
        </div>
      </div>

      {/* Add Elements */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          {t("addSection")}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={props.onAddText}
            className="py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {t("actions.addText")}
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
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
        </div>
      </div>

      {/* Layer Controls */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          {t("layersSection")}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={props.onDuplicate}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all"
          >
            {t("actions.duplicate")}
          </button>
          <button
            onClick={props.onForward}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all"
          >
            {t("actions.forward")}
          </button>
          <button
            onClick={props.onBackward}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all"
          >
            {t("actions.backward")}
          </button>
          <button
            onClick={props.onDelete}
            className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition-all"
          >
            {t("actions.delete")}
          </button>
        </div>
      </div>

      {/* Text Properties */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          {t("textSection")}
        </h3>
        {props.isTextSelected && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              {t("properties.editTextLabel")}
            </label>
            <input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onBlur={() => props.onEditText?.(editingText)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  props.onEditText?.(editingText);
                }
              }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              {t("properties.font")}
            </label>
            <select
              onChange={(e) => props.onFontFamily(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Poppins">Poppins</option>
              <option value="Arial">Arial</option>
              <option value="Impact">Impact</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              {t("properties.size")}
            </label>
            <input
              type="range"
              min={10}
              max={96}
              defaultValue={28}
              onChange={(e) => props.onFontSize(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                {t("properties.color")}
              </label>
              <input
                type="color"
                onChange={(e) => props.onColor(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                {t("properties.stroke")}
              </label>
              <input
                type="color"
                onChange={(e) => props.onStroke(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              {t("properties.strokeWidth")}
            </label>
            <input
              type="range"
              min={0}
              max={8}
              defaultValue={0}
              onChange={(e) => props.onStrokeWidth(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={props.onBold}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
            >
              {t("properties.bold")}
            </button>
            <button
              onClick={props.onItalic}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs italic rounded-lg transition-all"
            >
              {t("properties.italic")}
            </button>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          {t("viewControls")}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={props.onZoomOut}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all"
          >
            −
          </button>
          <button
            onClick={props.onZoomIn}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all"
          >
            +
          </button>
          <button
            onClick={props.onResetZoom}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all col-span-2"
          >
            {t("zoom.reset")}
          </button>
        </div>
        <button
          onClick={props.onToggleGrid}
          className="mt-2 w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all"
        >
          {t("grid")}
        </button>
        <button
          onClick={props.onTogglePan}
          className={`mt-2 w-full py-2 px-3 text-xs font-medium rounded-lg transition-all ${
            props.panMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          {t("pan")}
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800 leading-relaxed">{t("tip")}</p>
      </div>
    </div>
  );
}
