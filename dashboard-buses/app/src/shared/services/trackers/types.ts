export interface TrackerItemSource {
    status_listing_id : string|undefined|null;
    id : number;
    creation_date : string;
    blocked : boolean;
    device_id : string;
    tariff_id : number;
    model : string;
    tariff_end_date : string;
    phone : string;
}

export interface ApiTrackerListItemResponse {
    id: number;
    label: string;
    group_id: number;
    source: TrackerItemSource;
    tag_bindings: any[];
    clone: boolean;
}

export interface ApiTrackerDetailState {
    source_id: number;
    gps: {
        updated: string;
        signal_level: number;
        location: { lat: number; lng: number };
        heading: number;
        speed: number;
        alt: number;
    };
    connection_status: string;
    movement_status: string;
    movement_status_update: string;
    ignition: boolean;
    ignition_update: string;
    inputs: boolean[];
    inputs_update?: string;
    outputs: boolean[];
    outputs_update?: string;
    last_update: string;
    gsm: {
        updated: string;
        signal_level: number;
        network_name: string;
        roaming: boolean;
    };
    battery_level: number;
    battery_update: string;
    additional: {
        event_code: {
        value: string;
        updated: string;
        };
    };
    actual_track_update: string;
}

export interface ApiTrackerDetailResponse {
    user_time: string;
    state: ApiTrackerDetailState;
    success: boolean;
}
