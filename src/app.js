import Server from './server';


(async function app() {

  const server = new Server();

  await server.start();

})();
