const Vision = require('vision');
const HapiReactViews = require('hapi-react-views');


export async function attach(server) {

  await server.register(Vision);

  server.views({
      engines: {
        jsx: HapiReactViews
      },
      compileOptions: {},
      relativeTo: __dirname,
      path: 'src'
  });

};


export default {
  attach
};
