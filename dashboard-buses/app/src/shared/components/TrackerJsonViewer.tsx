"use client";

import { FC, useMemo, useState } from "react";
import { BsFiletypeJson } from "react-icons/bs";
import type { TrackerDetail } from "@/shared/types";

interface TrackerJsonViewerProps {
    detail: TrackerDetail;
}

export const TrackerJsonViewer: FC<TrackerJsonViewerProps> = ({ detail }) => {
    const [open, setOpen] = useState(false);

    const jsonPayload = useMemo(
        () => ({
        patente: detail.label,
        imei: detail.source.device_id,
        latitud: detail.state.gps.location.lat,
        longitud: detail.state.gps.location.lng,
        altitud: detail.state.gps.alt,
        evento: detail.evento,
        velocidad: detail.state.gps.speed,
        heading: detail.state.gps.heading,
        fechaHora: detail.fecha_hora,
        ignicion: detail.motor,
        }),
        [detail],
    );

    return (
        <section>
            <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">
                Visualizar json enviado al centinela
            </h3>

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs cursor-pointer"
            >
                <BsFiletypeJson className="text-blue-600 text-sm" />
                {open ? "Ocultar JSON" : "Ver JSON"}
            </button>

            {open && (
                <div className="mt-2 rounded border border-slate-200 bg-slate-900/95">
                <pre className="max-h-64 overflow-auto p-3 text-xs text-slate-100">
                    {JSON.stringify(jsonPayload, null, 2)}
                </pre>
                </div>
            )}
        </section>
    );
};
