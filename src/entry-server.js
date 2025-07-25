// 服务端渲染：创建Vue实例工厂，返回Promise（支持路由预取数据）
import { createApp } from './main'

export default context => {
  // 为每个请求创建新的应用实例
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    
    // 设置路由, 服务端路由跳转
    router.push(context.url)
    
    // 路由就绪后处理
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      
      // 调用组件的asyncData方法获取数据
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 将store状态注入上下文，供模板渲染
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
