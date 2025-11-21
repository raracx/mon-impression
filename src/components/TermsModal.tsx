"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function TermsModal({
  isOpen,
  onClose,
  onConfirm,
}: TermsModalProps) {
  const t = useTranslations("termsModal");
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
      setIsChecked(false); // Reset for next time
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-semibold">{t("title")}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 leading-relaxed">{t("message")}</p>

          {/* Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="terms-checkbox"
              className="text-sm text-gray-800 cursor-pointer"
            >
              {t("checkbox")} <span className="text-red-600">*</span>
            </label>
          </div>

          {/* Confirm Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleConfirm}
              disabled={!isChecked}
              className={`px-8 py-3 rounded-md font-semibold text-white transition-colors ${
                isChecked
                  ? "bg-black hover:bg-gray-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {t("confirmButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

