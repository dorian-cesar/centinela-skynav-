import {
  TrackerHash,
  TrackerItem,
  TrackerGpsState,
  TrackerNormalizedPayload
} from './models';
import { TrackerStateResponse } from '../domain/responses'

export interface HashRepository {
  getHashByCredentials(user: string, password: string): Promise<TrackerHash | null>;
}

export interface PreviousStateRepository {
  getPreviousStates(): Promise<TrackerNormalizedPayload[]>;
  saveCurrentStates(states: TrackerNormalizedPayload[]): Promise<void>;
}

export interface MasgpsClientPort {
  listTrackers(hash: string, allData?: boolean ): Promise<TrackerItem[]>;
  getTrackerState(hash: string, tracker: TrackerItem): Promise<TrackerGpsState>;
  allTrackerState(hash: string, tracker_id: string): Promise<TrackerStateResponse>;
}

export interface CentinelaClientPort {
  sendPayload(payload: TrackerNormalizedPayload[]): Promise<void>;
}
