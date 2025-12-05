"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";

import { KpiCard } from "@/shared/components/KpiCard";
import { TrackersTable } from "@/shared/components/TrackersTable";
import { TrackerDetailModal } from "@/shared/components/TrackerDetailModal";
import { TrackerDeviceModal } from "@/shared/components/TrackerDeviceModal";
import { ScreenLoader } from "@/shared/components/ScreenLoader";
import { RefreshButton } from "@/shared/components/RefreshButton";

import type { TrackerSummary, TrackerDetail } from "@/shared/types";
import { TrackerService } from "@/shared/services/trackers/tracker.service";
import { TrackerItemSource } from '@/shared/services/trackers/types'
import type {
    ApiTrackerDetailResponse
} from "../shared/services/trackers/types";

export default function DashboardPage() {
  // -----------------------------
  // Estados
  // -----------------------------
  const [trackers, setTrackers] = useState<TrackerSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const [detail, setDetail] = useState<TrackerDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [screenLoading, setScreenLoading] = useState(false);

  // -----------------------------
  // Cargar lista de trackers
  // -----------------------------
  const loadTrackers = async () => {
    setScreenLoading(true);

    try {
      const list = await TrackerService.list();
      setTrackers(list);
    } catch (err) {
      console.error("Error cargando trackers:", err);
    } finally {
      setLoadingList(false);
      setScreenLoading(false);
    }
  };

  useEffect(() => {
    loadTrackers();
  }, []);

  const CONCURRENCY = 4;

  const loadedIdsRef = useRef<Set<number>>(new Set());
  const loadingRef = useRef(false);

  const resetDetailLoading = useCallback(() => {
    loadedIdsRef.current = new Set();
    loadingRef.current = false;
  }, []);

  useEffect(() => {
    if (!trackers.length) return;
    if (loadingRef.current) return;

    const queue = trackers.filter((t) => !loadedIdsRef.current.has(t.id));
    if (!queue.length) return;

    loadingRef.current = true;
    let cancelled = false;

    const runWorker = async () => {
      if (cancelled) return;

      const tracker = queue.shift();
      if (!tracker) return;

      loadedIdsRef.current.add(tracker.id);

      try {
        const detail = await TrackerService.showDetail(tracker.id, "", true);

        setTrackers((prev) =>
          prev.map((t) =>
            t.id === tracker.id
              ? {
                  ...t,
                  state: detail as ApiTrackerDetailResponse,
                }
              : t
          )
        );
      } catch (e) {
        // opcional: marcar error
      }

      if (queue.length > 0 && !cancelled) {
        await runWorker();
      }
    };

    const workersCount = Math.min(CONCURRENCY, queue.length);

    for (let i = 0; i < workersCount; i++) {
      runWorker();
    }

    return () => {
      cancelled = true;
      loadingRef.current = false;
    };
  }, [trackers, setTrackers]);

  // -----------------------------
  // KPI (recomputados automáticamente)
  // -----------------------------
  const kpis = useMemo(() => {
    if (!trackers || trackers.length === 0) {
      return {
        total: 0,
        online: 0,
        offline: 0,
      };
    }

    const total = trackers.length;

    const online = trackers.filter(
      (t) => t.state?.state.connection_status === "active"
    ).length;

    const offline = total - online;

    return { total, online, offline };
  }, [trackers]);

  // -----------------------------
  // Handler al dar clic en "Ver"
  // -----------------------------
  const handleSelect = async (id: number, label: string, source: TrackerItemSource) => {
    setSelectedId(id);
    setSelectedLabel(label);
    setLoadingDetail(true);
    setScreenLoading(true);

    try {
      const detailResponse = await TrackerService.showDetail(id, label, false);

      setDetail({
        label,
        source,
        user_time: detailResponse.user_time,
        state: detailResponse.state,
      } as TrackerDetail);
    } finally {
      setLoadingDetail(false);
      setScreenLoading(false);
    }
  };

  // -----------------------------
  // Handler al dar clic en "Ver Dispositivo"
  // -----------------------------
  const [selectedDevice, setSelectedDevice] = useState<TrackerItemSource | null>(null);
  const [openDeviceModal, setOpenDeviceModal] = useState(false);

  const handleSelectDevice = (source: TrackerItemSource) => {
    setScreenLoading(true);

    try {
      setSelectedDevice(source);
      setOpenDeviceModal(true);
    } finally {
      setScreenLoading(false);
    }
  };

  const handleCloseDeviceModal = () => {
    setOpenDeviceModal(false);
    setSelectedDevice(null);
  };

  // -----------------------------
  // Cerrar modal
  // -----------------------------
  const handleCloseModal = () => {
    setSelectedId(null);
    setSelectedLabel(null);
    setDetail(null);
    setLoadingDetail(false);
  };

  // -----------------------------
  // Render del Dashboard
  // -----------------------------
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl bg-white p-6 shadow-sm">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Monitoreo de buses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Estado en tiempo real – Datos actualizados desde API
          </p>
        </header>

        {/* KPIs */}
        <section className="grid gap-4 md:grid-cols-3">
          <KpiCard
            title="Buses en línea"
            value={loadingList ? "..." : kpis.online}
            description={loadingList ? "Cargando..." : "Actualizado ahora"}
          />
          <KpiCard
            title="Buses fuera de línea"
            value={loadingList ? "..." : kpis.offline}
            description={loadingList ? "Cargando..." : "Actualizado ahora"}
          />
          <KpiCard
            title="Total de buses"
            value={loadingList ? "..." : kpis.total}
            description="Trackers registrados"
          />
        </section>

        {/* Tabla de Trackers */}
        <div className="mt-6">
          {loadingList ? (
            <p className="text-center text-slate-500 py-6">Cargando lista...</p>
          ) : (
            <>
              <RefreshButton
                loading={loadingList || screenLoading}
                onClick={async () => {
                  resetDetailLoading();
                  setScreenLoading(true);
                  await loadTrackers();
                  setScreenLoading(false);
                }}
              />

              <TrackersTable
                data={trackers}
                onSelect={handleSelect}
                onSelectDevice={handleSelectDevice}
              />
            </>
          )}
        </div>
      </div>

      <TrackerDetailModal
        open={!!selectedId}
        onClose={handleCloseModal}
        data={detail}
        loading={loadingDetail}
      />

      <TrackerDeviceModal
        open={openDeviceModal}
        onClose={handleCloseDeviceModal}
        source={selectedDevice}
      />

      <ScreenLoader open={screenLoading} />
    </main>
  );
}
