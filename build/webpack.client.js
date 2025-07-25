// 客户端打包配置
const path = require('path')
const merge = require('lodash.merge')
const webpack = require('webpack')
const { resolve } = require('./utils')
const baseConfig = require('./webpack.base.conf')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 生产环境标记
const isProd = process.env.NODE_ENV === 'production'

module.exports = merge(baseConfig, {
  // 入口：客户端激活逻辑
  entry: {
    app: isProd 
      ? './src/entry-client.js' 
      : ['webpack-hot-middleware/client?reload=true', './src/entry-client.js']
  },

  // 输出：客户端资源
  output: {
    path: resolve('dist/client'),
    filename: isProd ? 'static/js/[name].[chunkhash:8].js' : 'static/js/[name].js',
    chunkFilename: isProd ? 'static/js/[name].[chunkhash:8].chunk.js' : 'static/js/[name].chunk.js',
    publicPath: '/'
  },

  // 开发工具：生产环境关闭 source-map，开发环境开启
  devtool: isProd ? false : 'cheap-module-eval-source-map',

  // 客户端特有插件
  plugins: [
    // 提取 CSS 到单独文件（生产环境）
    isProd && new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      allChunks: true
    }),

    // 生成客户端 manifest（供服务端渲染使用）
    new VueSSRClientPlugin(),

    // 开发环境热更新
    !isProd && new webpack.HotModuleReplacementPlugin(),

    // 生成 HTML 模板（仅用于开发环境，生产环境由服务端渲染生成）
    !isProd && new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.template.html',
      inject: true
    })
  ].filter(Boolean) // 过滤掉 false 的插件（如生产环境不加载热更新插件）,

  // 代码分割配置（优化加载性能）
  optimization: isProd ? {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  } : {}
})
