import { ApiTrackerDetailResponse } from "@/shared/services/trackers/types";

export const mockStateDefault : ApiTrackerDetailResponse = {
  user_time: '0000-00-00 00:00:00',
  success: true,
  state: {
    source_id: 0,
    gps: {
        updated: '0000-00-00 00:00:00',
        signal_level: 0,
        location: {
            lat: -0,
            lng: -0
        },
        heading: 0,
        speed: 0,
        alt: 0
    },
    connection_status: "inactive",
    movement_status: "parked",
    movement_status_update: '0000-00-00 00:00:00',
    ignition: false,
    ignition_update: '0000-00-00 00:00:00',
    inputs: [
        false,
        false,
        false,
        false
    ],
    inputs_update: '0000-00-00 00:00:00',
    outputs: [
        false,
        false,
        false
    ],
    outputs_update: '0000-00-00 00:00:00',
    last_update: '0000-00-00 00:00:00',
    gsm: {
        updated: '0000-00-00 00:00:00',
        signal_level: 0,
        network_name: "",
        roaming: false
    },
    battery_level: 0,
    battery_update: '0000-00-00 00:00:00',
    additional: {
        event_code: {
            value: "0",
            updated: "0000-00-00 00:00:00"
        }
    },
    actual_track_update: '0000-00-00 00:00:00'
  }
}