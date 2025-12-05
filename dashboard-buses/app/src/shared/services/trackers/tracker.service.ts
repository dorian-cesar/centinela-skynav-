import { httpClient } from "../http/httpClient";
import type {
    ApiTrackerListItemResponse,
    ApiTrackerDetailResponse,
} from "./types";
import { mapTrackerItem, mapTrackerDetail } from "./mapper";

export const TrackerService = {
    async list() {
        const res = await httpClient.get<ApiTrackerListItemResponse[]>("/tracker_list");

        return res.data.map((item) => mapTrackerItem(item));
    },

    async showDetail(id: number, label: string) {
        const res = await httpClient.get<ApiTrackerDetailResponse>(
            `/show_tracker/${id}`
        );

        return mapTrackerDetail(id, res.data, label);
    },
};
