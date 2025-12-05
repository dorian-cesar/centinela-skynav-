import { FastifyInstance } from 'fastify';
import { SyncTrackersUseCase } from '../../application/usecases/SyncTrackersUseCase';
import { TrackersListUseCase } from '../../application/usecases/TrackersListUseCase';
import { ShowTrackerUseCase } from '../../application/usecases/ShowTrackerUseCase';
import { MysqlHashRepository } from '../repositories/MysqlHashRepository';
// TODO: implementar repositorio concreto para previous states
// import { MysqlPreviousStateRepository } from '../repositories/MysqlPreviousStateRepository';
import { MasgpsClient } from '../clients/MasgpsClient';
import { CentinelaClient } from '../clients/CentinelaClient';
import { FetchHttpClient } from '../../../../shared/infra/http/httpClient';
import { StateComparer } from '../../application/services/StateComparer';
import { AppError } from '../../../../shared/errors/AppError';

export async function registerTrackingRoutes(fastify: FastifyInstance) {
  fastify.post('/sync', async (_request, reply) => {
    try {
      const httpClient = new FetchHttpClient();
      const hashRepo = new MysqlHashRepository();
      
      const prevStateRepo = {
        async getPreviousStates() {
          return []; // TODO: léelo de tu base
        },
        async saveCurrentStates(_states: any[]) {
          // TODO: guarda en base
        }
      };

      const masgpsClient = new MasgpsClient(httpClient);
      const centinelaClient = new CentinelaClient(httpClient);
      const comparer = new StateComparer();

      const useCase = new SyncTrackersUseCase(
        hashRepo,
        prevStateRepo,
        masgpsClient,
        centinelaClient,
        comparer
      );

      const result = await useCase.execute();

      return reply.code(200).send(result);
    } catch (err: any) {
      if (err instanceof AppError) {
        return reply.code(err.statusCode).send({ error: err.code, message: err.message });
      }

      fastify.log.error(err);
      return reply.code(500).send({ error: 'INTERNAL_ERROR', message: 'Error inesperado' });
    }
  });

  fastify.get('/tracker_list', async (_request, reply) => {
    try {
      const httpClient = new FetchHttpClient();
      const hashRepo = new MysqlHashRepository();
      
      const masgpsClient = new MasgpsClient(httpClient);

      const useCase = new TrackersListUseCase(
        hashRepo,
        masgpsClient
      );

      const result = await useCase.execute();

      return reply.code(200).send(result);
    } catch (err: any) {
      if (err instanceof AppError) {
        return reply.code(err.statusCode).send({ error: err.code, message: err.message });
      }

      fastify.log.error(err);
      return reply.code(500).send({ error: 'INTERNAL_ERROR', message: 'Error inesperado' });
    }
  });

  fastify.get<{
    Params: { id_tracker: string }
  }>('/show_tracker/:id_tracker', async (_request, reply) => {
    try {
      const httpClient = new FetchHttpClient();
      const hashRepo = new MysqlHashRepository();
      const masgpsClient = new MasgpsClient(httpClient);
      
      const {id_tracker} = _request.params

      const useCase = new ShowTrackerUseCase(
        hashRepo,
        masgpsClient,
        id_tracker
      );

      const result = await useCase.execute();

      return reply.code(200).send(result);
    } catch (err: any) {
      if (err instanceof AppError) {
        return reply.code(err.statusCode).send({ error: err.code, message: err.message });
      }

      fastify.log.error(err);
      return reply.code(500).send({ error: 'INTERNAL_ERROR', message: 'Error inesperado' });
    }
  });
}
