// 公共基础配置（客户端和服务端共用）
require('../server/env-config');
const path = require('path');
const VueLoaderConfig = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const resolve = (...args) => {
  return path.resolve(__dirname, ...args);
};

const dotenvFilePath = () => {
  const f = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
  return resolve('../', f);
};

const config = {
target: ['web', 'es5'],
output: {
    path: resolve('../dist'), // 出口文件路径
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[name].[chunkhash].js',
    publicPath: process.env.PUBLIC_PATH || '/',
},
  module: {
    rules: [
      {
        // JS 转译（使用 Babel）
        test: /\.js$/,
        exclude: file => /node_modules/.test(file) && !/(\.vue|\.js)/.test(file),
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        // Vue 组件加载
        test: /\.vue$/,
        loader: 'vue-loader', // vue文件编译
      },
      {
        // 图片加载
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/[name].[ext]',
          esModule: false,
        },
        type: 'javascript/auto',
      },
      {
        // 字体加载
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[ext]',
          esModule: false,
        },
        type: 'javascript/auto',
      },
    ],
  },

plugins: [
    new VueLoaderConfig(), // vue文件加载插件
    // ESLint 插件：在构建时自动检查 JS/Vue 文件
    new ESLintPlugin({
      extensions: ['js', 'vue'], // 校验的文件类型
    }),
    // 可选：启用后将校验样式文件
    // new StylelintPlugin({
    //   files: ['**/*.{vue,css,less}'], // 校验 Vue、CSS、LESS 文件
    // }),
    new Dotenv({
      path: dotenvFilePath(),
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[name].[contenthash].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: resolve('../public/'),
          to: resolve('../dist/static/'),
        },
      ],
    }),
  ],  
// 模块解析规则
resolve: {
    // 自动补全扩展名
    extensions: ['.js', '.vue', '.json', '.less'],
    // 路径别名（简化导入）
    alias: {
        '~': resolve('../node_modules'),
        '@': resolve('src'),
                '@api': resolve('../src/api'),
    '@assets': resolve('../src/assets'),
    '@components': resolve('../src/components'),
    '@config': resolve('../src/config'),
    '@consts': resolve('../src/consts'),
    '@filters': resolve('../src/filters'),
    '@helps': resolve('../src/helps'),
    '@i18n': resolve('../src/i18n'),
    '@mixins': resolve('../src/mixins'),
    '@plugins': resolve('../src/plugins'),
    '@styles': resolve('../src/styles'),
    '@user': resolve('../src/user'),
    '@utils': resolve('../src/utils'),
    '@views': resolve('../src/views'),
    }
},
performance: {
    hints: false
  }
}
if (isProd) {
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  if (process.env.npm_config_report) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin());
  }
}

module.exports = config;
