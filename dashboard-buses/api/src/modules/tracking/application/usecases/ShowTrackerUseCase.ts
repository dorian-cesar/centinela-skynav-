import {
  HashRepository,
  MasgpsClientPort
} from '../../domain/ports';

import { env } from '../../../../config/env';
import { AppError } from '../../../../shared/errors/AppError';

export class ShowTrackerUseCase {
  constructor(
    private readonly hashRepo: HashRepository,
    private readonly masgpsClient: MasgpsClientPort,
    private readonly id_tracker: string
  ) {}


  async execute(): Promise<any> {
    const hash = await this.hashRepo.getHashByCredentials(
      env.TRACKING_USER,
      env.TRACKING_PASSWORD
    );

    if (!hash) {
      throw new AppError('HASH_NOT_FOUND', 'No se encontró hash para las credenciales', 404);
    }

    return await this.masgpsClient.allTrackerState(hash.hash , this.id_tracker);
  }
}
