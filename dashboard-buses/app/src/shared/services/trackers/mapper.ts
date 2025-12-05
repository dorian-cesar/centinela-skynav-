import type {
    ApiTrackerDetailResponse,
} from "./types";

import type {
    TrackerSummary,
    TrackerDetail,
} from "@/shared/types";

export function mapTrackerItem(item: any): TrackerSummary {
    return {
        id: item.id,
        label: item.label,
        source: item.source,
        state: item.state
    };
}

export function mapTrackerDetail(
    id: number,
    api: ApiTrackerDetailResponse,
    label: string,
    allData: boolean = false
): TrackerDetail | ApiTrackerDetailResponse {
    if( allData ){
        return api
    }

    return {
        id,
        label,
        user_time: api.user_time,
        state: api.state,
    };
}
