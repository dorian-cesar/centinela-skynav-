import { TrackerItemSource, ApiTrackerDetailResponse } from '@/shared/services/trackers/types'

export type ConnectionStatus = "active" | "inactive";

export type MovementStatus = "moving" | "parked";

export interface TrackerSummary {
  id: number;
  label: string;
  source: TrackerItemSource;
  state?: ApiTrackerDetailResponse;
}

export interface TrackerDetailStateGps {
  updated: string;
  signal_level: number;
  location: { lat: number; lng: number };
  heading: number;
  speed: number;
  alt: number;
}

export interface TrackerDetailStateGsm {
  updated: string;
  signal_level: number;
  network_name: string;
  roaming: boolean;
}

export interface TrackerDetail {
  id: number;
  label: string;
  user_time: string;
  source: TrackerItemSource;
  evento?: number;
  fecha_hora?: string;
  motor?: number;
  state: {
    source_id: number;
    gps: TrackerDetailStateGps;
    connection_status: string;
    movement_status: string;
    movement_status_update: string;
    ignition: boolean;
    ignition_update: string;
    inputs: boolean[];
    outputs: boolean[];
    last_update: string;
    gsm: TrackerDetailStateGsm;
    battery_level: number;
    battery_update: string;
    additional: {
      event_code: { value: string; updated: string };
    };
    actual_track_update: string;
  };
}

