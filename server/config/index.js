// 用于后端 Express 服务
// 配合 server/config/proxy-table.js 实现 API 代理
// （将前端请求的本地路径转发到真实的后端服务地址）。

const SESSION_SECRET = 'wemust_teaching_evaluation';
const REDIS_TTL = 60 * 60 * 2; // Session有效期為2h
// const REDIS_TTL = 60 * 5; // 測試暫時修改為5分鐘

// 本地API，會轉發至API服務器
const publicPath = process.env.PUBLIC_PATH || '/';
const LOCAL_DATA_CENTER_API_BASE_URL = `${publicPath}x-dc-api`; // 數據中心API
const LOCAL_DATA_CENTER_NEW_API_BASE_URL = `${publicPath}x-dc-new-api`; // 新數據中心API
const LOCAL_OA_API_BASE_URL = `${publicPath}x-oa-api`; // OA API
const LOCAL_STUDENT_API_BASE_URL = `${publicPath}x-student-api`; // 學生API
const LOCAL_TEACHING_EVALUATION_API_BASE_URL = `${publicPath}x-teaching-evalution-api`; // 科目评估API
const LOCAL_SELECT_PERSON_API_BASE_URL = `${publicPath}x-select-person-api`; // 選人組件API
const LOCAL_EXPORT_API_BASE_URL = `${publicPath}x-export-api`; // 導出API
const LOCAL_IMPORT_API_BASE_URL = `${publicPath}x-import-api`; // 導入API


module.exports = {
  SESSION_SECRET,
  REDIS_TTL,
  LOCAL_DATA_CENTER_API_BASE_URL,
  LOCAL_DATA_CENTER_NEW_API_BASE_URL,
  LOCAL_OA_API_BASE_URL,
  LOCAL_STUDENT_API_BASE_URL,
  LOCAL_TEACHING_EVALUATION_API_BASE_URL,
  LOCAL_SELECT_PERSON_API_BASE_URL,
  LOCAL_EXPORT_API_BASE_URL,
  LOCAL_IMPORT_API_BASE_URL,
};
