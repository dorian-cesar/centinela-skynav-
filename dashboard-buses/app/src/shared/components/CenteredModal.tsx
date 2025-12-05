"use client";

import type { FC, ReactNode } from "react";

interface CenteredModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const CenteredModal: FC<CenteredModalProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-hidden bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          {title ? (
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[calc(90vh-64px)] overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};
