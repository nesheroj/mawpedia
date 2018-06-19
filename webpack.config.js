const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/client/index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              forceEnv: 'browser',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      // {
      //   test: /\.(gif|png|jpe?g)$/,
      //   include: path.resolve(__dirname, 'src/public/images'),
      //   use: ['file-loader?name=images/[name].[ext]'],
      // },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: /tesco-modern-fonts/,
        use: ['file-loader?name=fonts/[name].[ext]'],
      },
      {
        test: /\.svg$/,
        exclude: /tesco-modern-fonts/,
        use: ['file-loader?name=svg/[name].[ext]'],
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'dist', 'static'),
    publicPath: '/data-portability/',
    filename: '[name]-[chunkhash].js',
  },
  mode: process.env.NODE_ENV,
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'bundle',
          test: /\.scss$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/client/index.html',
    }),
  ],
};

// import path from 'path';
// import autoprefixer from 'autoprefixer';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import StatsPlugin from 'stats-webpack-plugin';
// import webpack from 'webpack';

// const postcssOptions = {
//   plugins: () => [
//     autoprefixer({ browsers: ['last 2 versions'] })
//   ]
// };

// const config = {
//   cache: false,
//   context: path.resolve('./src'),
//   devtool: 'eval',
//   entry: [
//     './client/index.js'
//   ],
//   output: {
//     filename: 'main.js?[hash]',
//     path: path.resolve('./static')
//   },
//   module: {
//     rules: [{
//       test: /\.js$/i,
//       exclude: /node_modules/i,
//       loader: 'babel-loader',
//       query: {
//         plugins: ['transform-runtime', 'transform-class-properties', 'transform-decorators-legacy'],
//         presets: [['env', {
//           modules: false,
//           targets: {
//             browsers: 'last 2 versions'
//           },
//           useBuiltIns: true
//         }], 'stage-3']
//       }
//     }, {
//       test: /\.json$/i,
//       loader: 'json-loader'
//     }, {
//       test: /\.html$/i,
//       loader: 'html-loader'
//     }, {
//       test: /\.css$/i,
//       loaders: [
//         'style-loader',
//         'css-loader'
//       ]
//     }, {
//       test: /\.scss$/i,
//       exclude: [
//         /src(\\|\/)+client(\\|\/)+index\.scss$/i
//       ],
//       loaders: [
//         'raw-loader',
//         {
//           loader: 'postcss-loader',
//           options: postcssOptions
//         },
//         'sass-loader'
//       ]
//     }, {
//       test: /\.scss$/i,
//       include: [
//         /src(\\|\/)+client(\\|\/)+index\.scss$/i
//       ],
//       loaders: [
//         'style-loader',
//         {
//           loader: 'css-loader',
//           options: { importLoaders: 1 }
//         },
//         // {
//         //   loader: 'postcss-loader',
//         //   options: postcssOptions
//         // },
//         'sass-loader'
//       ]
//     }, {
//       test: /\.(jpe?g|png|gif)$/i,
//       loader: 'file-loader',
//       query: {
//         name: '[path][name].[ext]?[hash]'
//       }
//     }, {
//       test: /\.(ttf|woff|eot)$/i,
//       loader: 'file-loader',
//       query: {
//         name: '[path][name].[ext]?[hash]'
//       }
//     }]
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       filename: 'index.html',
//       template: 'client/index.html'
//     }),
//     new webpack.DefinePlugin({
//       __DEVELOPMENT__,
//       __PRODUCTION__
//     }),
//     new StatsPlugin(path.join('..', 'webpack-stats.json'), {
//       chunkModules: true
//     })
//   ]
// };

// if (__PRODUCTION__) {

//   config.plugins.push(new webpack.optimize.UglifyJsPlugin());

// }

// export default config;
