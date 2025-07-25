// 用于前端 Vue 代码，作为 Axios 请求的基础路径，确保前端发起的请求路径与后端代理规则匹配。

const publicPath = process.env.PUBLIC_PATH || '/';

export const API_SALT = 'teaching-evaluation';
export const LOCAL_DATA_CENTER_API_BASE_URL = `${publicPath}x-dc-api`; // 數據中心API
export const LOCAL_DATA_CENTER_NEW_API_BASE_URL = `${publicPath}x-dc-new-api`; // 新數據中心API
export const LOCAL_OA_API_BASE_URL = `${publicPath}x-oa-api`; // OA API
export const LOCAL_STUDENT_API_BASE_URL = `${publicPath}x-student-api`; // 學生API
export const LOCAL_TEACHING_EVALUATION_API_BASE_URL = `${publicPath}x-teaching-evalution-api`; // 科目评估API
export const LOCAL_SELECT_PERSON_API_BASE_URL = `${publicPath}x-select-person-api`; // 選人組件API
export const LOCAL_EXPORT_API_BASE_URL = `${publicPath}x-export-api`; // 導出API
export const LOCAL_IMPORT_API_BASE_URL = `${publicPath}x-import-api`; // 導入API
