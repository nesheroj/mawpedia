// import autoprefixer from 'autoprefixer';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import webpack from 'webpack';

export default {
  cache: false,
  context: path.resolve('./src'),
  devtool: 'eval',
  entry: './client/index.js',
  output: {
    filename: 'main.js?[hash]',
    path: path.resolve('./static')
  },
  module: {
    loaders: [{
      test: /\.js$/i,
      exclude: /node_modules/i,
      loader: 'babel',
      query: {
        plugins: ['transform-decorators-legacy'],
        presets: ['es2015-webpack', 'stage-1']
      }
    }, {
      test: /\.json$/i,
      loader: 'json'
    }, {
      test: /\.html$/i,
      loader: 'html'
    }, {
      test: /\.css$/i,
      loader: 'raw'
    }, {
      test: /\.scss$/i,
      loaders: [
        'raw',
        {
          loader: 'sass',
          query: {
            name: '[path][name].[ext]?[hash]'
          }
        }]
    }, {
      test: /\.(jpe?g|png|gif)$/i,
      loader: 'file',
      query: {
        name: '[path][name].[ext]?[hash]'
      }
    }, {
      test: /\.(ttf|woff|eot)$/i,
      loader: 'file',
      query: {
        name: '[path][name].[ext]?[hash]'
      }
    }],
    noParse: [path.join(__dirname, 'node_modules', 'angular2', 'bundles')]
  },
  // postcss: () => {
  //   return {
  //     defaults: [autoprefixer({ browsers: ['last 2 versions'] })]
  //   };
  // },
  progress: true,
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'client/index.html'
    }),
    new webpack.DefinePlugin({
      __DEVELOPMENT__
    }),
    new StatsPlugin(path.join('..', 'webpack-stats.json'), {
      chunkModules: true
    })
  ]
};
