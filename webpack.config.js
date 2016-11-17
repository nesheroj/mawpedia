import path from 'path';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import webpack from 'webpack';

const postcssOptions = {
  plugins: () => [
    autoprefixer({ browsers: ['last 2 versions'] })
  ]
};

const config = {
  cache: false,
  context: path.resolve('./src'),
  devtool: 'eval',
  entry: [
    './client/index.js'
  ],
  output: {
    filename: 'main.js?[hash]',
    path: path.resolve('./static')
  },
  module: {
    rules: [{
      test: /\.js$/i,
      exclude: /node_modules/i,
      loader: 'babel-loader',
      query: {
        plugins: ['transform-runtime', 'transform-decorators-legacy'],
        presets: [['es2015', { modules: false }], 'es2016', 'es2017', 'stage-1']
      }
    }, {
      test: /\.json$/i,
      loader: 'json-loader'
    }, {
      test: /\.html$/i,
      loader: 'html-loader'
    }, {
      test: /\.css$/i,
      loaders: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.scss$/i,
      exclude: [
        /src(\\|\/)+client(\\|\/)+index\.scss$/i
      ],
      loaders: [
        'raw-loader',
        {
          loader: 'postcss-loader',
          options: postcssOptions
        },
        'sass-loader'
      ]
    }, {
      test: /\.scss$/i,
      include: [
        /src(\\|\/)+client(\\|\/)+index\.scss$/i
      ],
      loaders: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        },
        {
          loader: 'postcss-loader',
          options: postcssOptions
        },
        'sass-loader'
      ]
    }, {
      test: /\.(jpe?g|png|gif)$/i,
      loader: 'file-loader',
      query: {
        name: '[path][name].[ext]?[hash]'
      }
    }, {
      test: /\.(ttf|woff|eot)$/i,
      loader: 'file-loader',
      query: {
        name: '[path][name].[ext]?[hash]'
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'client/index.html'
    }),
    new webpack.DefinePlugin({
      __DEVELOPMENT__,
      __PRODUCTION__
    }),
    new StatsPlugin(path.join('..', 'webpack-stats.json'), {
      chunkModules: true
    })
  ]
};

if (__PRODUCTION__) {

  config.plugins.push(new webpack.optimize.UglifyJsPlugin());

}

export default config;
