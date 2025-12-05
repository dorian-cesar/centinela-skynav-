import { CentinelaClientPort } from '../../domain/ports';
import { TrackerNormalizedPayload } from '../../domain/models';
import { HttpClient } from '../../../../shared/infra/http/httpClient';
import { env } from '../../../../config/env';

export class CentinelaClient implements CentinelaClientPort {
  constructor(private readonly http: HttpClient) {}

  async sendPayload(payload: TrackerNormalizedPayload[]): Promise<void> {
    await this.http.post(env.CENTINELA_TRANSMISION_URL, payload, {
      headers: {
        Authorization: `Bearer ${env.CENTINELA_TRANSMISION_BEARER}`
      }
    });
  }
}
