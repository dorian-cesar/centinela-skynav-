import { MasgpsClientPort } from '../../domain/ports';
import { TrackerItem, TrackerGpsState } from '../../domain/models';
import { HttpClient } from '../../../../shared/infra/http/httpClient';
import { env } from '../../../../config/env';
import { TrackerListResponse, TrackerStateResponse } from '../../domain/responses'

export class MasgpsClient implements MasgpsClientPort {
  constructor(private readonly http: HttpClient) {}

  async listTrackers(hash: string, allData: boolean = false): Promise<TrackerItem[]> {
    const headers = {
        Origin: env.MASGPS_TRACKER_LIST_ORIGIN,
        Referer: `${env.MASGPS_TRACKER_LIST_ORIGIN}/`,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
        Connection: 'keep-alive',
        Cookie: `_ga=GA1.2.728367267.1665672802; locale=es; _gid=GA1.2.967319985.1673009696; _gat=1; session_key=${env.MASGPS_TRACKER_LIST_SESSION_KEY}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    }

    const response = await this.http.get<TrackerListResponse>(`${env.MASGPS_TRACKER_LIST_URL}?hash=${hash}`, {
      headers 
    });

    /**
    //Api allTrackerState, retorna http 429
    */
    if (allData) {
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      const trackers = [];


      for (const tracker of response.list) {
        let state: TrackerStateResponse | null = null;

        try {
          state = await this.allTrackerState(hash, tracker.id);
        } catch {
          state = null;
        }

        trackers.push({ ...tracker, state });

        await sleep(200);
      }

      return trackers;

      /*const trackers = await Promise.all(
        response.list.map(async (tracker) => {
          const state = await this.allTrackerState(hash, tracker.id);
          return { ...tracker, state };
        })
      );

      return trackers;*/
    }

    /*if (allData) {
      return response.list
    }*/

    return response.list.map(item => ({
      id: item.id,
      imei: item.source.device_id,
      label: item.label
    }));
  }

  async getTrackerState(hash: string, tracker: TrackerItem): Promise<TrackerGpsState> {
    const res = await this.http.post<TrackerStateResponse>(env.MASGPS_GET_STATE_URL, {
      hash,
      tracker_id : tracker.id
    });

    const gps = res.state.gps;

    return {
      alt: gps.alt,
      lat: gps.location.lat,
      lng: gps.location.lng,
      speed: gps.speed,
      heading: gps.heading,
      signal_level: gps.signal_level,
      movement_status: res.state.movement_status,
      ignition: !!res.state.inputs[0],
      last_update: res.state.last_update
    };
  }

  async allTrackerState(hash: string, tracker_id: string): Promise<TrackerStateResponse> {
    const res = await this.http.post<TrackerStateResponse>(env.MASGPS_GET_STATE_URL, {
      hash,
      tracker_id
    });

    return res
  }
}
