"use client";

import type { FC } from "react";
import type { TrackerItemSource } from "@/shared/services/trackers/types";
import { CenteredModal } from "./CenteredModal";

interface TrackerDeviceModalProps {
  open: boolean;
  onClose: () => void;
  source: TrackerItemSource | null;
}

export const TrackerDeviceModal: FC<TrackerDeviceModalProps> = ({
  open,
  onClose,
  source,
}) => {
  if (!open || !source) return null;

  const blockedLabel = source.blocked ? "Sí" : "No";
  const blockedClasses = source.blocked
    ? "bg-rose-50 text-rose-700 border-rose-100"
    : "bg-emerald-50 text-emerald-700 border-emerald-100";

  return (
    <CenteredModal open={open} onClose={onClose} title="Detalle del dispositivo">
      <div className="space-y-4 text-sm text-slate-800">
        {/* Resumen principal */}
        <section className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">ID interno</p>
            <p className="font-medium">{source.id}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">ID de dispositivo (IMEI)</p>
            <p className="font-medium">{source.device_id}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Modelo</p>
            <p className="font-medium">{source.model}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Teléfono</p>
            <p className="font-medium">{source.phone}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Bloqueado</p>
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${blockedClasses}`}
            >
              {blockedLabel}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-500">Status listing ID</p>
            <p className="font-medium">
              {source.status_listing_id ?? "—"}
            </p>
          </div>
        </section>

        {/* Información de tarifa */}
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">
            Información de tarifa
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">ID de tarifa</p>
              <p className="font-medium">{source.tariff_id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Fin de tarifa</p>
              <p className="font-medium">{source.tariff_end_date}</p>
            </div>
          </div>
        </section>

        {/* Metadatos */}
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">
            Metadatos
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Fecha de creación</p>
              <p className="font-medium">{source.creation_date}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer inline-flex items-center justify-center border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </CenteredModal>
  );
};
