"use client";

import type { FC } from "react";

interface ScreenLoaderProps {
    open: boolean;
}

export const ScreenLoader: FC<ScreenLoaderProps> = ({ open }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-1200 flex items-center justify-center bg-slate-900/60 backdrop-blur-[1px]">
            <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full border-2 border-blue-600"></div>
            <div className="absolute h-full w-full animate-ping rounded-full border-2 border-blue-600 [animation-delay:-0.5s]"></div>
            </div>
        </div>
    );
};
