// 客户端入口
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Cookies from 'js-cookie';
import { Locale } from '@consts/locale';
import { initWmSelectPeople } from '@plugins/wm-select-people';
import { createApp } from './main';


const { app, router, store, i18n } = createApp();

const locale = Cookies.get(process.env.LOCALE_COOKIE_KEY) || Locale.ZH_MO;
i18n.locale = locale;

// eslint-disable-next-line no-underscore-dangle
if (window.__INITIAL_STATE__) {
  // eslint-disable-next-line no-underscore-dangle
  store.replaceState(window.__INITIAL_STATE__);
}

initWmSelectPeople();

router.onReady(() => {
  app.$mount('#app');
});
