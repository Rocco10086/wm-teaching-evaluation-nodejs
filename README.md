# 科目評估Web

## 安裝

### 編譯依賴

這個項目使用 [node](https://nodejs.org/) 和 [yarn](https://yarnpkg.com/)。請確保你本地安裝了它們。

- node 需要 [14.18.x](https://nodejs.org/en/download/) 或以上TLS版本（v16.x以上未測試，不建議使用）
- yarn 需要 [1.22.x](https://yarnpkg.com/getting-started/install) 或以上版本

### 服務器依賴

1. Redis 服務器

   服務運行時需使用 Redis 相關服務，請確保已準備。

2. 外部依賴服務項

   服務運行時會訪問以下相關的外部依服資源，請務必先拿到相關信息，具體如下表所示：


| 依賴服務           | 項目名稱                                                     | 備註                                                       |
| ------------------ | ------------------------------------------------------------ | ---------------------------------------------------------- |
| CAS                | [wm_cas](https://wm-git.must.edu.mo/wemust/wm_cas)           | 統一身份認證                                               |
| 科目評估接口       | [wm-teaching-evaluation](https://wm-git.must.edu.mo/wemust/wm-teaching-evaluation) | 科目評估業務數據交互                                       |
| 數據中心接口       | [wm_dc_api](https://wm-git.must.edu.mo/wemust/wm_dc_api)     | 申請/刷新 Token 數據交互                                   |
| 數據中心新版本接口 | [wm-dc-api-new](https://wm-git.must.edu.mo/wemust/wm-dc-api-new) | 一些通用功能數據交互，如：應用列表、最近使用應用等         |
| OA 接口            | [wm_oa](https://wm-git.must.edu.mo/wemust/wm_oa)             | 一些關於教職員的功能數據交互，如：個人信息、未讀消息數量等 |
| 公共選人組件接口   | [wm-select-person](https://wm-git.must.edu.mo/wemust/wm-select-person) | 選擇人員業務數據交互                                       |
| 公共導出接口       | [wm-export](https://wm-git.must.edu.mo/wemust/wm-export)     | 導出數據業務數據交互                                       |
| 公共導入接口       | [wm-extract](https://wm-git.must.edu.mo/wemust/wm-extract)   | 導入數據業務數據交互                                       |
| 遠程 UI 入口文件   | [wm-remote-ui-nodejs](https://wm-git.must.edu.mo/wemust/wm-remote-ui-nodejs) | 前端資源，引入遠程公用的頭部 UI，Webpack Module Federation |


## 運行示例（測試用）

1. 克隆代碼，執行命令 ```git clone git@172.16.124.48:wemust/wm-teaching-evaluation-nodejs.git```
2. 進入工程文件夾，執行命令 ```cd wm-teaching-evaluation-nodejs```
3. 安裝項目依賴，執行命令 ```yarn install --production=false```
4. 配置 [.env](#.env配置文件說明) 配置項
5. 啟動示例，執行命令 ```yarn run dev```

## 構建（生產用）

1. 克隆代碼，執行命令 ```git clone git@172.16.124.48:wemust/wm-teaching-evaluation-nodejs.git```
2. 進入工程文件夾，執行命令 ```cd wm-teaching-evaluation-nodejs```
3. 安裝項目 Webpack 依賴，執行命令 ```yarn install --production=false```
4. 配置 [.env](#.env配置文件說明) 配置項
5. Webpack 構建，執行命令 ```yarn run build```
6. 刪除臨時依賴，執行命令 ```rm -rf ./node_modules```
7. 安裝生產使用依賴，執行命令 ```yarn install --production=true```

## 部署

### 複製環境生產使用文件

生產環境下，只需要使用部分文件夾和文件，具體如下：

| 路徑                | 備註                 |
| ------------------- | -------------------- |
| build/              |                      |
| dist/               |                      |
| node_modules/       |                      |
| server/             |                      |
| 404.html            |                      |
| 500.html            |                      |
| .env                | 非必要，環境變量配置 |
| ecosystem.config.js | 非必要，PM2 配置文件 |
| index.html          |                      |
| package.json        |                      |

### 在生產環境啟動項目

- 使用 PM2 進程管理工具啟動

  建議使用 [PM2](https://pm2.keymetrics.io/) 做為 node 進程管理工具（非必須），項目帶有文件名為 ecosystem.config.js 的默認 PM2 配置文件，可直接用於啟動。

  - PM2需要 [3.x](https://pm2.keymetrics.io/docs/usage/quick-start/) 或以上版本

  執行命令 ```pm2 start ./ecosystem.config.js --env production```

- 直接啟動

  執行命令 ```yarn run server```

### 配置 nginx

建議項，非必要。

由於構建完後，會生成 dist/static/ 文件夾，該文件夾內容為靜態訪問資源，通過 nginx 配置，可減少 node 端負載。

找到 nginx 配置文件，具體修改如下：

```
server {
  ...

  location /static/ { /* 靜態資源訪問路徑 */
    alias /home/webapp/wm-teaching-evaluation-nodejs/dist/static/; /* 構建輸出dist⽂件夾下的靜態資源文件夾路徑 */
  }
}
```


## .env配置文件說明

項目運行前需要配置 .env 文件，.env 文件不存在項目的版本管理系統(git)當中，需要單獨創建，.env 配置文件需存放在項目根目錄中。

项目提供配置對照文件 .env.sample，可複制該文件創建 .env 文件。

請注意，提供 .env 配置文件的目的，是為了不能修改直接系統環境變量的情況下，做為補充的配置手段。如果你已經在環境變量配置對應的項，則可以不用創建 .env 文件。

### 項目 .env 文件所需的配置選項

| 鍵值                     | 備註                                 | 必填 | 默認值                          | 示例                      | 構建時使用 | 說明                                                         | 最後修改時間 |
| ------------------------ | ------------------------------------ | ---- | ------------------------------- | ------------------------- | ---------- | ------------------------------------------------------------ | ------------ |
| EXPRESS_PORT             | Express 運行端口號                   |      | 8080                            | 8080                      |            |                                                              |              |
| SERVICE_URL              | 外網服務訪問 URL                     |      | http://localhost:{EXPRESS_PORT} | https://example.com:8080  |            | 不包含根目錄<br>如果該值沒有填寫，將默認值為 http://localhost: 加上 EXPRESS_PORT 配置值 |              |
| PUBLIC_PATH              | 根目錄                               |      | /                               | /test-folder/             | ✓          | 與 SERVICE_URL 組成完整的訪問路徑，<br>如：http://example.com:8080/test-folder/ |              |
| SERVICE_CODE             | 服務編碼                             | ✓    |                                 | S-WM-TEACHING-EVALUATION  | ✓          | 數據中心应用管理對應配置                                     |              |
| CLIENT_ID                | 客戶端 ID                            | ✓    |                                 |                           |            | 數據中心客戶端對應配置                                       |              |
| CLIENT_SECRET            | 客戶端密鑰                           | ✓    |                                 |                           |            | 數據中心客戶端對應配置                                       |              |
| SESSION_ID_COOKIE_KEY    | 用於儲存 Session ID 的 Cookie 鍵值   | ✓    |                                 | wm.teaching-evalution.sid |            | 本應用使用                                                   |              |
| ACCESS_TOKEN_COOKIE_KEY  | 用於儲存 Access Token 的 Cookie 鍵值 | ✓    |                                 | wm.teaching-evalution.at  | ✓          | 本應用使用                                                   |              |
| USER_CATEGORY_COOKIE_KEY | 用於儲存用戶類型的 Cookie 鍵值       | ✓    |                                 | wm.user-category          |            | 全局使用，建議全局配置一致                                   |              |
| LOCALE_COOKIE_KEY        | 用於儲存多語言的 Cookie 鍵值         | ✓    |                                 | wm.locale                 | ✓          | 全局使用，建議全局配置一致                                   |              |

#### 接口相關配置

| 鍵值                         | 備註                         | 必填 | 默認值 | 示例                                                        | 構建時使用 | 說明                                            | 最後修改時間 |
| ---------------------------- | ---------------------------- | ---- | ------ | ----------------------------------------------------------- | ---------- | ----------------------------------------------- | ------------ |
| TEACHING_EVALUATION_API_BASE_URL | 科目評估接口 URL             | ✓    |        | https://mustdev.doocom.cn/teaching-evaluation-api |            | 具體生產配置地址請找運維諮詢                    |              |
| DATA_CENTER_API_BASE_URL     | 數據中心接口 URL             | ✓    |        | http://dc.doocom.net                                        |            | 用於 Token 申請<br>具體生產配置地址請找運維諮詢 |              |
| DATA_CENTER_NEW_API_BASE_URL | 數據中心新版本接口 URL       | ✓    |        | http://wmdcapinew.doocom.net:8081                           |            | 具體生產配置地址請找運維諮詢                    |              |
| OA_API_BASE_URL              | OA 接口 URL                  | ✓    |        | http://wmoa.doocom.net                                      |            | 具體生產配置地址請找運維諮詢                    |              |
| STUDENT_API_BASE_URL         | 學生接口 URL                 | ✓    |        | https://mustdev.doocom.cn/student-api                       |            | 具體生產配置地址請找運維諮詢                    |              |
| SELECT_PERSON_API_BASE_URL   | 公共選人組件接口 URL         | ✓    |        | http://wmselectperson.doocom.net:8081                       |            | 具體生產配置地址請找運維諮詢                    |              |
| EXPORT_API_BASE_URL          | 公共導出接口 URL             | ✓    |        | http://wmexport.doocom.net:8085                             |            | 具體生產配置地址請找運維諮詢                    |              |
| IMPORT_API_BASE_URL          | 公共導入接口 URL             | ✓    |        | http://wmextract.doocom.net:8085                            |            | 具體生產配置地址請找運維諮詢                    |              |
| REMOTE_UI_ENTRY_URL          | 遠程 UI 入口文件 URL         | ✓    |        | https://mustdev.doocom.cn/remote-ui/remoteEntry.js | ✓          | 具體生產配置地址請找運維諮詢                    |              |

#### CAS相關配置

| 鍵值         | 備註         | 必填 | 默認值 | 示例                   | 構建時使用 | 說明                         | 最後修改時間 |
| ------------ | ------------ | ---- | ------ | ---------------------- | ---------- | ---------------------------- | ------------ |
| CAS_BASE_URL | CAS 服務 URL | ✓    |        | https://cas.doocom.net |            | 具體生產配置地址請找運維諮詢 |              |
| CAS_VERSION  | CAS 版本     | ✓    |        | 5.2.3                  |            | 預留                         |              |

#### Redis相關配置

| 鍵值           | 備註                      | 必填 | 默認值 | 示例                              | 構建時使用 | 說明                                                         | 最後修改時間        |
| -------------- | ------------------------- | ---- | ------ | --------------------------------- | ---------- | ------------------------------------------------------------ | ------------------- |
| REDIS_CLUSTER  | 是否開啟 Redis Cluster    |      | off    | on                                |            | 值必須是 on 才開啟                                           | 2022-04-07 16:17:00 |
| REDIS_URL      | Redis 節點連接 URL        | ✓    |        | redis://root:123456@10.0.0.1:6379 |            | 當開啟 Redis Cluster 時，支持多個 Redis 節點，使用英文逗號分隔<br>如：REDIS_URL=redis://root:123456@10.0.0.1:6379, redis://root:123456@10.0.0.2:6379, redis://root:123456@10.0.0.3:6379<br>當不開啟 Redis Cluster 時，直接配置連接 URL<br>如：REDIS_URL=redis://root:123456@10.0.0.1:6379<br>具體生產配置地址請找運維諮詢 |                     |
| REDIS_PASSWORD | Redis 連接密码            |      |        |                                   |            | 當開啟 Redis Cluster 時，節點連接會 fallback 密碼至此密碼    |                     |
| REDIS_NAT_MAP  | Redis Cluster NAT Mapping |      |        | 10.0.0.1:30001=>39.97.185.28:6379 |            | Sometimes the cluster is hosted within a internal network<br>that can only be accessed via a NAT (Network Address Translation) instance.<br>Link: https://github.com/luin/ioredis#nat-mapping<br>當開啟 Redis Cluster 時，同時存在內外網映射，此時需要配置該項<br>輸入格式為規定格式：內網IP:端口號=>外網IP/域:端口號，支持多個映射，使用英文逗號分隔<br>10.0.0.1:30001=>39.97.185.28:6379<br>10.0.0.1:30001=>external-host-1.io:6379<br>如：REDIS_NAT_MAP=10.0.0.1:30001=>external-host-1.io:6379, 10.0.0.2:30002=>external-host-2.io:6379<br>具體生產配置地址請找運維諮詢 |                     |
| REDIS_PREFIX   | Redis 存儲時的鍵值前綴    |      |        | wm:teaching-evalution:            |            | 用於為所有已用鍵添加前綴的字符串，避免與其他應用重複         |                     |

## 主要使用技術框架

- [webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [Express](http://expressjs.com/)
- [Vue.js](https://vuejs.org/)
- [vue-router](https://router.vuejs.org/)
- [vue-server-renderer](https://ssr.vuejs.org/)
- [vue-i18n](https://kazupon.github.io/vue-i18n/)
