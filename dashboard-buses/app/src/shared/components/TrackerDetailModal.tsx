"use client";

import type { FC } from "react";
import type { TrackerDetail } from "../types";
import { CenteredModal } from "./CenteredModal";
import { StatusBadge } from "./StatusBadge";
import { EstateIgnition, EventoEnum } from "@/shared/enums"
import { getEventoDescripcion } from "@/shared/utils"
import dayjs from "dayjs";
import { TrackerJsonViewer } from "@/shared/components/TrackerJsonViewer"
import dynamic from "next/dynamic";


const MapView = dynamic(
  () => import("@/shared/components/MapView").then((m) => m.MapView),
  { ssr: false }
);

interface TrackerDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: TrackerDetail | null;
  loading: boolean;
}

export const TrackerDetailModal: FC<TrackerDetailModalProps> = ({
  open,
  onClose,
  data,
  loading
}) => {
  if (!data) return null;

  const connectionStatus = data.state.connection_status === "active" ? "active" : "inactive"

  const movementStatus = data.state.movement_status === "moving" ? "moving" : "parked"

  const gmsRoaming = data.state.gsm.roaming ? "Si" : "No"

  const motor: 0 | 1 = data.state.ignition ? EstateIgnition.on : EstateIgnition.off;

  let evento = 0;

  if (movementStatus === 'moving' && motor === 1) {
    evento = EventoEnum.PosicionIgnicionOnMovimiento;
  } else if (movementStatus === 'parked' && motor === 0) {
    evento = EventoEnum.PosicionIgnicionOffEstacionado;
  } else if (motor === 1 && movementStatus !== 'moving') {
    evento = EventoEnum.IgnicionOn;
  } else if (motor === 0 && movementStatus !== 'parked') {
    evento = EventoEnum.IgnicionOff;
  }

  const fecha_hora = dayjs(data.state.last_update).format("DD/MM/YYYY HH:mm:ss");

  data = {...data, evento , fecha_hora , motor }

  console.log( data.evento )

  if (loading) {
    return (
      <CenteredModal open={open} onClose={onClose} title="Cargando detalle...">
        <p className="py-4 text-center text-slate-600">Cargando información...</p>
      </CenteredModal>
    );
  }

  return (
    <CenteredModal
      open={open}
      onClose={onClose}
      title={`Detalle del bus ${data.label}`}
    >
      <div className="space-y-4 text-sm text-slate-800">
        <MapView center={[data.state.gps.location.lat, data.state.gps.location.lng]} zoom={15} height={500} />

        <TrackerJsonViewer detail={data} />

        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">
            Dispositivo
          </h3>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-slate-500">Última actualización</p>
                <p className="font-medium">{data.state.last_update}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-slate-500">Estado de conexión</p>
                <StatusBadge status={connectionStatus} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-slate-500">Movimiento</p>
                <StatusBadge status={movementStatus} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-slate-500">Velocidad</p>
                <span className="text-xs text-slate-600">
                  {data.state.gps.speed} km/h
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-slate-500">Ignición</p>
                <p className="font-medium">
                  {data.state.ignition ? "ON" : "OFF"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-slate-500">Nivel de bateria</p>
                <p className="font-medium">{data.state.battery_level}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">
            GPS
          </h3>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <div>
              <p className="text-xs text-slate-500">Última actualización</p>
              <p className="font-medium">{data.state.gps.updated}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Nivel de señal</p>
              <p className="font-medium">{data.state.gps.signal_level}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Latitud</p>
              <p className="font-medium">{data.state.gps.location.lat}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Longitud</p>
              <p className="font-medium">{data.state.gps.location.lng}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Heading</p>
              <p className="font-medium">{data.state.gps.heading}°</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Velocidad</p>
              <p className="font-medium">{data.state.gps.speed}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Altitud</p>
              <p className="font-medium">{data.state.gps.alt} m</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">
            GSM
          </h3>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <div>
              <p className="text-xs text-slate-500">Última actualización</p>
              <p className="font-medium">{data.state.gsm.updated}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Nivel de señal</p>
              <p className="font-medium">
                {data.state.gsm.signal_level} / 100
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Operador</p>
              <p className="font-medium">{data.state.gsm.network_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Roaming</p>
              <p className="font-medium">{gmsRoaming}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">
            Entradas
          </h3>
          <ul className="list-inside list-disc space-y-0.5">
            {data.state.inputs.map((value, index) => (
              <li key={index}>
                Entrada {index + 1}:{" "}
                <span className="font-medium">
                  {value ? "Activada" : "Desactivada"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">
            Salidas
          </h3>
          <ul className="list-inside list-disc space-y-0.5">
            {data.state.outputs.map((value, index) => (
              <li key={index}>
                Salida {index + 1}:{" "}
                <span className="font-medium">
                  {value ? "Activada" : "Desactivada"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase text-slate-500">
            Tipo de evento
          </h3>

          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
            <p className="text-sm text-slate-700 italic">
              Según el motor y movimiento (moving o parked)
            </p>
          </div>
          
          <p className="font-medium">Evento: {evento} - {getEventoDescripcion(evento)} </p>
        </section>

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
