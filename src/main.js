// 公共逻辑：创建Vue实例、router、store（供客户端和服务端共用）
import Vue from 'vue';

import i18n from '@i18n';
import { setupIView } from '@plugins/iview';
import { createAuthMixin } from '@mixins/auth';
import createRouter from './router';
import createStore from './store';
import App from './App.vue';

import './styles/app.less';
import './styles/customize.less';
import './styles/we-iview.less';

import prototypeUtils from './plugins/prototype-utils';
import { setupWmUI } from './plugins/wm-ui';

import TextButton from './components/common/we-text-button.vue';

import mixin from './mixins';

Vue.component('TextButton', TextButton);
Vue.config.productionTip = false;

Vue.use(setupWmUI);
Vue.use(prototypeUtils);
Vue.use(setupIView);
Vue.mixin(createAuthMixin());
Vue.mixin(mixin);


// 导出工厂函数，避免单例模式（SSR需要为每个请求创建新实例）
export function createApp() {
  const router = createRouter();
  const store = createStore();
  const app = new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
  });

  return {
    app,
    store,
    router,
    i18n,
  };
}

export default createApp;
