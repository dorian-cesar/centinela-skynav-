"use client";

import { FC } from "react";
import type { TrackerSummary } from "../types";
import { BiDetail } from "react-icons/bi";
import { MdDevices } from "react-icons/md";
import { StatusBadge } from "./StatusBadge";
import { mockStateDefault } from "@/shared/mocks"

interface TrackersTableProps {
  data: TrackerSummary[];
  onSelect: (id: number, label: string, source: TrackerSummary["source"] ) => void;
  onSelectDevice?: (source: TrackerSummary["source"]) => void;
}

export const TrackersTable: FC<TrackersTableProps> = ({ data, onSelect , onSelectDevice }) => {
  return (
    <div className="mt-6 border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm text-slate-800">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
          <tr>
            <th className="px-4 py-2">Bus</th>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">En linea</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tracker) => {
            if( typeof tracker.state === "undefined" ){
              tracker = {...tracker, state: mockStateDefault}
            }

            const connectionStatus = tracker.state?.state.connection_status === "active" ? "active" : "inactive"

            return (
              <tr
                key={tracker.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-4 py-2 text-sm font-medium text-slate-900">
                  {tracker.label}
                </td>
                <td className="px-4 py-2 text-sm text-slate-700">
                  {tracker.id}
                </td>
                <td className="px-4 py-2 text-sm text-slate-700">
                  <StatusBadge status={connectionStatus} />
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Botón: Ver Detalles */}
                    <button
                      type="button"
                      onClick={() => onSelect(tracker.id, tracker.label , tracker.source )}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs cursor-pointer"
                    >
                      <BiDetail className="text-blue-600 text-sm" />
                      Ver Detalles
                    </button>

                    {/* Botón: Ver Dispositivo */}
                    {onSelectDevice && (
                      <button
                        type="button"
                        onClick={() => onSelectDevice(tracker.source)}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs cursor-pointer"
                      >
                        <MdDevices className="text-indigo-600 text-sm" />
                        Ver Dispositivo
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-sm text-slate-500"
              >
                No hay buses para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
