// 服务端打包配置
const path = require('path')
const merge = require('lodash.merge')
const nodeExternals = require('webpack-node-externals')
const { resolve, styleLoaders } = require('./utils')
const baseConfig = require('./webpack.base.conf')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
  // 目标环境：Node.js（服务端运行）
  target: 'node',

  // 入口：服务端渲染逻辑
  entry: './src/entry-server.js',

  // 输出：服务端 bundle（CommonJS 模块）
  output: {
    path: resolve('dist/server'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2' // 输出为 Node 可识别的模块格式
  },

  // 外置化 node_modules（避免打包第三方依赖，服务端可直接 require）
  externals: nodeExternals({
    // 例外：不外置化 .vue 和样式文件（确保正确处理）
    allowlist: [/\.vue$/, /\.css$/, /\.less$/, /iview/]
  }),

  // 服务端特有模块规则（样式不提取，仅在服务端注入 class）
  module: {
    rules: styleLoaders({ sourceMap: false, extract: false })
  },

  // 服务端特有插件：生成服务端 bundle
  plugins: [
    new VueSSRServerPlugin() // 生成 vue-ssr-server-bundle.json
  ]
})
