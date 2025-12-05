import type { FC, ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: ReactNode;
  description?: string;
}

export const KpiCard: FC<KpiCardProps> = ({ title, value, description }) => (
  <div className="border border-slate-200 bg-white px-6 py-4">
    <p className="text-sm font-medium text-slate-700">{title}</p>
    <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    {description && (
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    )}
  </div>
);
