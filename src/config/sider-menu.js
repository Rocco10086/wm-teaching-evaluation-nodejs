// 具体路由常量配置，导入RouterName,作为键，配置键值对,传入路由meta信息中
import { RouterName } from './router';

const SiderMenu = Object.freeze({
  EvalutionList: 'Menu-Survey', // 評估列表(本科評估列表)
  SystemSetting: 'Menu-System-Setup', // 系统设置
  PostgraduateEvalutionList: 'Menu-Survey-Postgraduate', // 研究生評估列表
  PushSettings: 'Menu-Push-Setting', // 推送设置
  EvalutionNight: 'Menu-Survey-Dege', // 評估列表(博雅(夜间)评估列表)
  PostgraduateSend: 'Menu-Postgraduate-push', // 研究生科目推送
  EvalutionSend: 'Menu-Undergraduate-course-push', // 本科/先進班科目推送
  EvalutionBoya: 'Menu-Dege-Subject-Push', // 博雅(夜间)科目推送
  StatisticalRules: 'Menu-Setting', // 統計規則
  TeachingOutstandingStatistics: 'Menu-Teaching-Excellence', // 教學傑出獎
});

export { SiderMenu };

const SM = SiderMenu;

// 子级节点由 children 控制，最多包含一级子菜单，全部总两级，超过两级会自动忽略
export const SiderMenuItemsMap = new Map([
  [SM.EvalutionList, { // 評估列表(本科評估列表)
    routeName: RouterName.EvalutionList,
  }],
  [SM.SystemSetting, { // 系统设置
    routeName: RouterName.SystemSetting,
  }],
  [SM.PostgraduateEvalutionList, { // 研究生評估列表
    routeName: RouterName.PostgraduateEvalutionList,
  }],
  [SM.EvalutionNight, { // 博雅评估列表
    routeName: RouterName.EvalutionNight,
  }],
  [SM.StatisticalRules, { // 统计规则
    routeName: RouterName.StatisticalRules,
  }],
  [SM.PushSettings, { // 推送设置
    routeName: RouterName.PushSettings,
  }],
  [SM.PostgraduateSend, { //  推送设置-研究生
    routeName: RouterName.PostgraduateSend,
  }],
  [SM.EvalutionSend, { //  推送设置-本科
    routeName: RouterName.EvalutionSend,
  }],
  [SM.EvalutionBoya, { //  推送设置-博雅
    routeName: RouterName.EvalutionBoya,
  }],
  [SM.TeachingOutstandingStatistics, { //  教學傑出獎
    routeName: RouterName.TeachingOutstandingStatistics,
  }],
]);
