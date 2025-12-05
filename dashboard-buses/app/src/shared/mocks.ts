import type { TrackerDetail, TrackerSummary } from "./types";

export const MOCK_TRACKERS: TrackerSummary[] = [
  {
    id: 10185765,
    label: "KCRW-47 / 3639",
    connectionStatus: "online",
    movementStatus: "moving",
    lastUpdate: "11:20:46",
  },
  {
    id: 10133287,
    label: "KNB2-56 / 4679",
    connectionStatus: "offline",
    movementStatus: "stopped",
    lastUpdate: "10:30:23",
  },
  {
    id: 10105866,
    label: "ESQM-47 / 4633",
    connectionStatus: "online",
    movementStatus: "moving",
    lastUpdate: "11:20:38",
  },
  {
    id: 10187765,
    label: "FCBX-93 / 5374",
    connectionStatus: "offline",
    movementStatus: "idle",
    lastUpdate: "10:30:46",
  },
];

export const MOCK_TRACKER_DETAILS: Record<number, TrackerDetail> = {
  10185765: {
    id: 10185765,
    label: "KCRW-47 / 3639",
    user_time: "2025-12-03 11:20:49",
    state: {
      source_id: 10111625,
      gps: {
        updated: "2025-12-03 10:50:04",
        signal_level: 100,
        location: { lat: -23.32907, lng: -69.8388816 },
        heading: 165,
        speed: 45,
        alt: 1036,
      },
      connection_status: "online",
      movement_status: "moving",
      movement_status_update: "2025-12-03 10:04:41",
      ignition: true,
      ignition_update: "2025-12-03 07:44:29",
      inputs: [true, false, false, false],
      outputs: [false, false, false],
      last_update: "2025-12-03 11:20:46",
      gsm: {
        updated: "2025-12-03 10:50:04",
        signal_level: 38,
        network_name: "Movistar",
        roaming: false,
      },
      battery_level: 100,
      battery_update: "2025-12-03 10:50:04",
      additional: {
        event_code: { value: "0", updated: "2025-12-03 10:50:04" },
      },
      actual_track_update: "2025-12-03 10:04:41",
    },
  },
};
