"use client";

import { FiRefreshCw } from "react-icons/fi";

interface RefreshButtonProps {
    loading?: boolean;
    onClick: () => void;
}

export const RefreshButton = ({ loading = false, onClick }: RefreshButtonProps) => {
    return (
        <button
        onClick={onClick}
        disabled={loading}
        className={`
            flex items-center gap-1 px-3 py-1.5 text-sm font-medium
            border border-slate-300 rounded-md
            text-blue-600 hover:text-blue-800
            hover:bg-slate-100
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
            cursor-pointer
        `}
        >
            <FiRefreshCw className={`text-blue-600 ${loading ? "animate-spin" : ""} `}/>
            Actualizar
        </button>
    );
};
