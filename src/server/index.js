import debug from 'debug';

import Hapi from 'hapi';
import Blankie from 'blankie';
import Scooter from 'scooter';

import Core from '../core';
import Client from '../../client';

import indexRoute from './routes/index';


export default class Server {

  constructor() {

    this.core = new Core();

    this.server = new Hapi.Server();

    this.server.connection({
      port: 5000
    });

  }

  async start() {

    const { server, core } = this;

    await server.register([
      Scooter,
      Blankie
    ]);

    await Client.attach(server);

    server.route([
      indexRoute
    ]);

    await core.start();
    await server.start();

    debug('server')('started');

  }

}
