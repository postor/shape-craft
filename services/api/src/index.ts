import { ServiceBroker, ServiceSchema } from 'moleculer';
import ApiGateway from 'moleculer-web';
import { assetService } from './asset.service.ts';

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
        },
        mappingPolicy: 'restrict',
        bodyParsers: {
          json: true,
        },
      },
    ],
  },
} as Partial<ServiceSchema>);

broker.createService(assetService as unknown as ServiceSchema);

broker.start().then(() => {
  broker.logger.info('ShapeCraft API listening on http://localhost:3000/api');
});
