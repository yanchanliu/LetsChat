import path from 'path';
import webpack from 'webpack';
import BundleTracker from 'webpack-bundle-tracker';
import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      'webpack-hot-middleware/client?path=/__webpack_hmr',
      'app.jsx'
    ]
  },
  resolve: {
    root: [
      path.resolve(__dirname, 'src')
    ],
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: '[name]-[hash].js',
    publicPath: './'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-[hash].js'),
    new BundleTracker({ filename: './webpack-stats.json' }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    })
  ],
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, 'node_modules/bourbon/app/assets/stylesheets'),
      path.resolve(__dirname, 'node_modules/bourbon-neat/app/assets/stylesheets')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.s?(a|c)ss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.(ttf)$/,
        loader: 'file-loader'
      }
    ]
  }
};
