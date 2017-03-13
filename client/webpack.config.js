var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var HappyPack = require('happypack');
var BundleTracker = require('webpack-bundle-tracker');

var srcPath = './src';

var getEntry = function(env) {
  var entry = [];

  var vendor = Object.keys(require('./package.json').dependencies).filter(function(a) {
    if (['vision', 'hapi-react-views'].includes(a)) {
      return false;
    }
    try {
      require(a);
      return true;
    } catch(e) {
      return false;
    }
  });

  var srcDirs = fs.readdirSync(srcPath)
                  .filter(function(file) {
                    return fs.statSync(path.join(srcPath, file)).isDirectory();
                  });

  var entry = srcDirs.filter(function(directory) {
                return !/^[\._]/.test(directory);
              })
              .reduce(function(obj, directory) {
                console.log(obj, directory)
                obj[directory] = ['./src/' + directory + '/index'];
                return obj;
              }, { vendor: vendor });

  if(!env.production) {
    _.each(entry, function(e) {
      // e.unshift('./src/_common/debug');
      e.unshift('webpack-hot-middleware/client?path=/__webpack_hmr');
    });
  }

  return entry;
};

var getPlugins = function(env) {
  var plugins = [];

  if (env.production) {
    plugins.push(
      new webpack.EnvironmentPlugin({
        NODE_ENV: env.production ? 'production' : 'development'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    );
  } else {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    );
  }

  return plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor-[hash].js' }),
    new BundleTracker({ filename: './webpack-stats.json' }),
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory=true'],
      tempDir: '.happypack/' + (env.production ? 'production' : 'development'),
      threads: 4
    })
  ]);
};

module.exports = function(env) {
  process.env.NODE_ENV = env.production ? 'production' : 'development';
  return {
    devtool: env.production ? 'source-map' : 'cheap-module-eval-source-map',
    entry: getEntry(env),
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    output: {
      path: path.resolve('./public/bundles/'),
      filename: '[name]-[hash].js',
      publicPath: '/public/bundles/'
    },
    plugins: getPlugins(env),
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: path.join(__dirname, 'src'),
          use: [{
            loader: 'happypack/loader',
            options: {
              id: 'babel'
            }
          }]
        },
        {
          test: /\.s?(a|c)ss$/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve(__dirname, 'node_modules/bourbon/app/assets/stylesheets'),
                path.resolve(__dirname, 'node_modules/bourbon-neat/app/assets/stylesheets')
              ]
            }
          }]
        },
        {
          test: /\.(ttf)$/,
          use: [{
            loader: 'file-loader'
          }]
        }
      ]
    }
  };
};
