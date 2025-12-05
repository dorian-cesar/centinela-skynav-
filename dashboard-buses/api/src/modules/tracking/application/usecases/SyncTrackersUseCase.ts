import {
  HashRepository,
  MasgpsClientPort,
  CentinelaClientPort,
  PreviousStateRepository
} from '../../domain/ports';
import {
  TrackerItem,
  TrackerGpsState,
  TrackerNormalizedPayload
} from '../../domain/models';
import { StateComparer } from '../services/StateComparer';
import { env } from '../../../../config/env';
import { AppError } from '../../../../shared/errors/AppError';
import dayjs from "dayjs";
import { EventoEnum , EstateIgnition } from "../../domain/enums"
import { formatPatente } from "../../../../shared/utils"

export class SyncTrackersUseCase {
  constructor(
    private readonly hashRepo: HashRepository,
    private readonly prevStateRepo: PreviousStateRepository,
    private readonly masgpsClient: MasgpsClientPort,
    private readonly centinelaClient: CentinelaClientPort,
    private readonly comparer: StateComparer
  ) {}

  private normalize(
    tracker: TrackerItem,
    state: TrackerGpsState
  ): TrackerNormalizedPayload {
    const patente = formatPatente(tracker.label)
    const motor: 0 | 1 = state.ignition ? EstateIgnition.on : EstateIgnition.off;

    let evento = 0;
    if (state.movement_status === 'moving' && motor === 1) {
      evento = EventoEnum.PosicionIgnicionOnMovimiento;
    } else if (state.movement_status === 'parked' && motor === 0) {
      evento = EventoEnum.PosicionIgnicionOffEstacionado;
    } else if (motor === 1 && state.movement_status !== 'moving') {
      evento = EventoEnum.IgnicionOn;
    } else if (motor === 0 && state.movement_status !== 'parked') {
      evento = EventoEnum.IgnicionOff;
    }

    const fechaHora = dayjs(state.last_update).format("DD/MM/YYYY HH:mm:ss");

    return {
      patente,
      imei: tracker.imei,
      fechaHora,
      latitud: state.lat,
      longitud: state.lng,
      altitud: state.alt,
      velocidad: state.speed,
      heading: state.heading,
      ignicion: motor,
      evento
    }
  }

  async execute(): Promise<{ total: number; enviados: number;}> {
    const hash = await this.hashRepo.getHashByCredentials(
      env.TRACKING_USER,
      env.TRACKING_PASSWORD
    );

    if (!hash) {
      throw new AppError('HASH_NOT_FOUND', 'No se encontró hash para las credenciales', 404);
    }

    const trackers = await this.masgpsClient.listTrackers(hash.hash);
    const states: TrackerNormalizedPayload[] = [];

    for (const tracker of trackers) {
      const state = await this.masgpsClient.getTrackerState(hash.hash, tracker);
      states.push(this.normalize(tracker, state));
    }

    const previous = await this.prevStateRepo.getPreviousStates();
    const updated = this.comparer.getUpdated(previous, states);

    if (updated.length > 0) {
      //await this.centinelaClient.sendPayload(updated);

      await this.prevStateRepo.saveCurrentStates(states);
    }

    return {
      total: states.length,
      enviados: 0
    };
  }
}
