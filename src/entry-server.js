// 服务端入口

import { Locale } from '@consts/locale';
import { createApp } from './main';


export default (ctx) => new Promise((resolve, reject) => {
  const { app, router, store, i18n } = createApp();
  i18n.locale = ctx.appLocale || Locale.ZH_MO;

  router.push(ctx.url);
  // eslint-disable-next-line consistent-return
  router.onReady(() => {
    const matched = router.getMatchedComponents();
    if (matched.length === 0) {
      const err = new Error('Router has not matched compoinents found');
      err.code = 404;
      reject(err);
      return;
    }

    Promise.all(matched.map((component) => component.asyncData && component.asyncData({
      router: router.currentRoute,
      store,
      locale: ctx.appLocale,
    }))).then(() => {
      Object.assign(ctx, {
        state: store.state,
        title: i18n.t('title'),
      });

      resolve(app);
    }).catch(reject);
  }, reject);
});
