// 客户端激活：创建Vue实例并挂载到DOM
import { createApp } from './main'

// 客户端渲染逻辑：获取服务端注入的预取数据
const { app, router, store } = createApp()

// 从window.__INITIAL_STATE__恢复状态
if (window.__INITIAL_STATE__) {
  // 同步服务端注入的状态到客户端store
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  // 挂载路由钩子，处理异步组件
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    
    // 找出差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (prevMatched[i] !== c && (diffed = true))
    })
    
    if (!activated.length) {
      return next()
    }
    
    // 加载异步组件
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    })).then(() => {
      next()
    }).catch(next)
  })
  
  // 路由就绪后挂载
  app.$mount('#app')
})
