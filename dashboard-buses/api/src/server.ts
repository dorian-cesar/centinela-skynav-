import Fastify from 'fastify';
import { env } from './config/env';
import { registerTrackingRoutes } from './modules/tracking/infra/http/sync.controller';
import fastifyCors from '@fastify/cors';

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  });

  await fastify.register(fastifyCors, {
    origin: '*'
  });

  fastify.get('/health', async () => ({ status: 'ok' }));

  await registerTrackingRoutes(fastify);

  await fastify.listen({ host: '0.0.0.0', port: env.PORT });
}

bootstrap().catch(err => {
  console.error('Error al iniciar servidor', err);
  process.exit(1);
});
