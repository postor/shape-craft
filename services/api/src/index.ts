import { ServiceBroker, ServiceSchema } from 'moleculer';
import ApiGateway from 'moleculer-web';
import { assetService } from './asset.service.ts';
import { sceneService } from './scene.service.ts';

const broker = new ServiceBroker({
  logLevel: 'info',
  transporter: null,
});

const gateway = ApiGateway as unknown as ServiceSchema;

broker.createService(gateway, {
  settings: {
    port: 3000,
    routes: [
      {
        path: '/api',
        aliases: {
          'GET /assets': 'assets.list',
          'GET /assets/:id': 'assets.get',
          'POST /assets': 'assets.create',
          'PUT /assets/:id': 'assets.update',
          'DELETE /assets/:id': 'assets.remove',
          'GET /scenes': 'scenes.list',
          'GET /scenes/:id': 'scenes.get',
          'POST /scenes': 'scenes.create',
          'PUT /scenes/:id': 'scenes.update',
          'DELETE /scenes/:id': 'scenes.remove',
        },
        mappingPolicy: 'restrict',
        bodyParsers: {
          json: { limit: '10mb' },
        },
      },
    ],
  },
} as Partial<ServiceSchema>);

broker.createService(assetService as unknown as ServiceSchema);
broker.createService(sceneService as unknown as ServiceSchema);

broker.start().then(() => {
  broker.logger.info('ShapeCraft API listening on http://localhost:3000/api');
});
