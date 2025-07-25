// 服务器打包配置

const baseConfig = require('./webpack.base');
const path = require('path');
const { merge } = require('webpack-merge');
const VueServerPlugin = require('vue-server-renderer/server-plugin');
const nodeExternals = require('webpack-node-externals');
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

module.exports = merge(baseConfig, {
  mode: 'production',
  // mode: 'development',
  entry: path.resolve(__dirname, '../src/entry.server.js'),
  target: 'node',
  externalsPresets: { node: true },
  externals: nodeExternals({
    allowlist: [/\.css$/, 'webpack/hot/dev-server', 'WmRemoteUI'],
  }),
  module: {
    rules: [
      {
        test: /\.(c|le)ss$/,
        use: [
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
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new VueServerPlugin(),
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
