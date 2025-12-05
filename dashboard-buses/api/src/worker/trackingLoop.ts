import 'dotenv/config';
import { env } from '../config/env';
import { FetchHttpClient } from '../shared/infra/http/httpClient';
import { MysqlHashRepository } from '../modules/tracking/infra/repositories/MysqlHashRepository';
import { MasgpsClient } from '../modules/tracking/infra/clients/MasgpsClient';
import { CentinelaClient } from '../modules/tracking/infra/clients/CentinelaClient';
import { StateComparer } from '../modules/tracking/application/services/StateComparer';
import { SyncTrackersUseCase } from '../modules/tracking/application/usecases/SyncTrackersUseCase';
import { PreviousStateRepository } from '../modules/tracking/domain/ports';
import { TrackerNormalizedPayload } from '../modules/tracking/domain/models';

let previousStates: TrackerNormalizedPayload[] = [];

const prevStateRepo: PreviousStateRepository = {
    async getPreviousStates(): Promise<TrackerNormalizedPayload[]> {
        return previousStates;
    },
    async saveCurrentStates(states: TrackerNormalizedPayload[]): Promise<void> {
        previousStates = states;
    }
};

async function buildUseCase(): Promise<SyncTrackersUseCase> {
    const httpClient = new FetchHttpClient();
    const hashRepo = new MysqlHashRepository();
    const masgpsClient = new MasgpsClient(httpClient);
    const centinelaClient = new CentinelaClient(httpClient);
    const comparer = new StateComparer();

    return new SyncTrackersUseCase(
        hashRepo,
        prevStateRepo,
        masgpsClient,
        centinelaClient,
        comparer
    );
}

const INTERVAL_MS = 30_000;

async function runOnce(useCase: SyncTrackersUseCase) {
    try {
        //console.log("➡️  [ANTES] previousStates:", previousStates);

        const result = await useCase.execute();

        //console.log("⬅️  [DESPUÉS] previousStates:", previousStates);

        console.log(
        `[trackingLoop] total=${result.total} enviados=${result.enviados} at ${new Date().toISOString()}`
        );
    } catch (err) {
        console.error('[trackingLoop] Error en ejecución:', err);
    }
}

async function loop() {
    const useCase = await buildUseCase();

    const tick = async () => {
        await runOnce(useCase);
        setTimeout(tick, INTERVAL_MS);
    };

    await tick();
}

loop().catch(err => {
    console.error('[trackingLoop] Error fatal al iniciar loop:', err);
    process.exit(1);
});
