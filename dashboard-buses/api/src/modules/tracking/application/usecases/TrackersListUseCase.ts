import {
  HashRepository,
  MasgpsClientPort
} from '../../domain/ports';

import { env } from '../../../../config/env';
import { AppError } from '../../../../shared/errors/AppError';

export class TrackersListUseCase {
  constructor(
    private readonly hashRepo: HashRepository,
    private readonly masgpsClient: MasgpsClientPort
  ) {}


  async execute(): Promise<any> {
    const hash = await this.hashRepo.getHashByCredentials(
      env.TRACKING_USER,
      env.TRACKING_PASSWORD
    );

    if (!hash) {
      throw new AppError('HASH_NOT_FOUND', 'No se encontró hash para las credenciales', 404);
    }

    return await this.masgpsClient.listTrackers(hash.hash , true);
  }
}
