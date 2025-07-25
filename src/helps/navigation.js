// 路由前置守卫
// 记录路由的 “来源”，方便在目标页面中判断用户是从哪个页面跳转过来的
import { RouterName, FROM_ROUTE_NAME_KEY } from '@config/router';


export function beforeEach(to, from, next) {
  Object.assign(to.meta, {
    [FROM_ROUTE_NAME_KEY]: from.name,
  });

  next();
}

export const isCurrentRoot = (router) => {
  return RouterName.Root === router.currentRoute.name;
};

export const backToRoot = (router) => {
  router.replace({ name: RouterName.Root });
};

export const isCurrentForbidden = (router) => {
  return RouterName.Forbidden === router.currentRoute.name;
};

export const goForbidden = (router) => {
  router.replace({ name: RouterName.Forbidden });
};

export const goBack = (router) => {
  router.go(-1);
};
