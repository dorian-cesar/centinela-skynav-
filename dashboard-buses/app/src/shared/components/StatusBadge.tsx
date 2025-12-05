import type { FC } from "react";
import type { ConnectionStatus , MovementStatus} from "../types";

interface StatusBadgeProps {
  status: ConnectionStatus | MovementStatus
}

const mapStatusToStyle: Record<
  ConnectionStatus,
  { label: string; classes: string }
> = {
  active: {
    label: "En línea",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  inactive: {
    label: "Inactivo",
    classes: "bg-slate-50 text-slate-700 border-slate-100",
  },
};

const movementMap: Record<
  MovementStatus,
  { label: string; classes: string }
> = {
  moving: {
    label: "En movimiento",
    classes: "bg-blue-50 text-blue-700 border-blue-100",
  },
  parked: {
    label: "Detenido",
    classes: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
};

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const isConnection = (status as ConnectionStatus) in mapStatusToStyle;

  const cfg = isConnection
    ? mapStatusToStyle[status as ConnectionStatus]
    : movementMap[status as MovementStatus];

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
};
