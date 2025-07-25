// 路由配置（多角色路由）
import Vue from 'vue';
import Router from 'vue-router';

import { RouterName } from '@config/router';
import { SiderMenu } from '@config/sider-menu';
import TheRoot from '@components/the-root.vue';
import { beforeEach } from '@helps/navigation';

// 解决控制台提示"NavigationDuplicated"警告
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = Router.prototype.push;
Router.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject);
  }
  return originalReplace.call(this, location).catch((err) => err);
};

Vue.use(Router);

function createRouter() {
  const routes = [
    {
      path: `${process.env.PUBLIC_PATH || '/'}`,
      name: RouterName.Root,
      component: TheRoot,
      children: [
        // 本科评估列表
        {
          path: 'evaluation-list',
          name: 'EvaluationList',
          component: () => import('@views/evaluation-list/index.vue'),
          meta: {
            activeCodes: [SiderMenu.EvaluationList],
          },
        },
      ],
    },
  ];

  const router = new Router({
    mode: 'history',
    caseSensitive: true, // 严格区分 URL 中的大小写
    routes,
  });

  router.beforeEach(beforeEach);

  return router;
}

export default createRouter;
