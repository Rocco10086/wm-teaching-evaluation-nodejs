// 客户端打包配置
const baseConfig = require('./webpack.base.js');
const join = require('path').join;
const { merge } = require('webpack-merge');
const VueClientPlugin = require('vue-server-renderer/client-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

const isProd = process.env.NODE_ENV === 'production';
function resolve(path) {
  return join(__dirname, '..', path);
}
const config = merge(baseConfig, {
  mode: isProd ? 'production' : 'development',
  entry: {
    app: resolve('src/entry.client.js'),
  },
  module: {
    rules: [
      {
        test: /\.(c|le)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: isProd ? [
    new CleanWebpackPlugin(),
    new VueClientPlugin(),
    new ModuleFederationPlugin({
      name: "consumer",
      filename: "remoteEntry.js",
      remotes: {
        WmRemoteUI: `WmRemoteUI@${process.env.REMOTE_UI_ENTRY_URL}`,
      },
    }),
    new ModuleFederationPlugin({
      name: "consumer",
      filename: "remoteEntry.js",
      remotes: {
        WmRemotePeople: `WmRemotePeople@${process.env.REMOTE_PEOPLE_ENTRY_URL}`,
      },
    }),
  ] : [
    new VueClientPlugin(),
    new ModuleFederationPlugin({
      name: "consumer",
      filename: "remoteEntry.js",
      remotes: {
        WmRemoteUI: `WmRemoteUI@${process.env.REMOTE_UI_ENTRY_URL}`,
      },
    }),
    new ModuleFederationPlugin({
      name: "consumer",
      filename: "remoteEntry.js",
      remotes: {
        WmRemotePeople: `WmRemotePeople@${process.env.REMOTE_PEOPLE_ENTRY_URL}`,
      },
    }),
  ],
});

if (isProd) {
  const productConfig = merge(config, {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: (module) => /node_modules/.test(module.context)
              && !/node_modules\/view-design\/dist/.test(module.context)
              && !/node_modules\/iview\/dist/.test(module.context)
              && !/\.css$/.test(module.request),
            name: 'vendors',
            minChunks: 1,
            chunks: 'initial',
            priority: -1,
          },
          viewDesign: {
            test: (module) => /node_modules\/view-design\/dist/.test(module.context) && !/\.css$/.test(module.request),
            name: 'view-design',
            minChunks: 1,
            chunks: 'initial',
            priority: -2,
          },
          iview: {
            test: (module) => /node_modules\/iview\/dist/.test(module.context) && !/\.css$/.test(module.request),
            name: 'iview',
            minChunks: 1,
            chunks: 'initial',
            priority: -3,
          },
        },
      },
      runtimeChunk: {
        name: 'manifest',
      },
    },
  });

  return module.exports = productConfig;
}

module.exports = config;
