const path = require('path');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const IORedis = require('ioredis');
const connectRedis = require('connect-redis');
const session = require('express-session');
const Redlock = require('redlock');
require('./env-config');
const createProxyMiddlewares = require('./middlewares/proxy');
const ssrRenderMiddleware = require('./middlewares/vue-ssr');
const createLocaleMiddleware = require('./middlewares/locale');
const createUserCategoryMiddleware = require('./middlewares/user-category');
const createUnlessMiddleware = require('./middlewares/unless');
const CASAuthentication = require('./middlewares/cas');
const createCasTicketMiddlewares = require('./middlewares/cas/ticket');
const createTokenMiddlewares = require('./middlewares/token');
const { SESSION_SECRET, REDIS_TTL } = require('./config');
const proxyTable = require('./config/proxy-table');


const resolve = (...args) => path.resolve(__dirname, ...args);
const publicPath = process.env.PUBLIC_PATH || '/';

const app = express();

app.use(logger('combined'));

app.use('favicon.ico', express.static(resolve('../public/favicon.ico')));
app.use(express.static(resolve('../src/assets')));
app.use(express.static(resolve('../dist')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let redisClient;
if (process.env.REDIS_CLUSTER === 'on') {
  let nodes = [];
  if (process.env.REDIS_URL) {
    const urls = process.env.REDIS_URL.split(',');
    nodes = urls.map((url) => url.trim());
  }

  const redisClientOptions = {};
  if (process.env.REDIS_PASSWORD) {
    Object.assign(redisClientOptions, {
      redisOptions: {
        password: process.env.REDIS_PASSWORD,
      },
    });
  }

  if (process.env.REDIS_NAT_MAP) {
    const natMap = {};
    let rawNatMapParis = process.env.REDIS_NAT_MAP.split(',');
    rawNatMapParis = rawNatMapParis.map((rawNatMapPari) => rawNatMapPari.trim());
    const reg = /^(\d{1,3}(\.\d{1,3}){3}:\d+)\=\>((\w|.)+):(\d+)$/;
    rawNatMapParis.forEach((rawNatMapPari) => {
      const matchs = reg.exec(rawNatMapPari);
      if (matchs && matchs.length === 6) {
        const from = matchs[1];
        const host = matchs[3];
        const port = matchs[5];
        natMap[from] = { host, port };
      }
    });
    if (Object.keys(natMap).length > 0) {
      Object.assign(redisClientOptions, { natMap });
    }
  }

  if (process.env.REDIS_PREFIX) {
    Object.assign(redisClientOptions, {
      keyPrefix: process.env.REDIS_PREFIX,
    });
  }

  redisClient = new IORedis.Cluster(nodes, redisClientOptions);
} else {
  const redisClientOptions = {};

  if (process.env.REDIS_PREFIX) {
    Object.assign(redisClientOptions, {
      keyPrefix: process.env.REDIS_PREFIX,
    });
  }

  redisClient = new IORedis(process.env.REDIS_URL, redisClientOptions);
}

redisClient.on('ready', () => {
  console.log('Redis is ready');
});
redisClient.on('error', err => {
  console.error('Redis client error', err);
});

const RedisStore = connectRedis(session);
const redisStore = new RedisStore({
  client: redisClient,
  ttl: REDIS_TTL, // Session有效期
});

// Set up an Express session, which is required for CASAuthentication.
const sessionOptions = {
  store: redisStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};
if (process.env.SESSION_ID_COOKIE_KEY) {
  Object.assign(sessionOptions, {
    name: process.env.SESSION_ID_COOKIE_KEY,
  });
}
app.use(session(sessionOptions));

// 在CAS认证之前，把Ticket与SessionID做对照，在CAS SLO时，执行删除
const { casTicketSessionMapperMiddleware, casSloMiddleware } = createCasTicketMiddlewares({ redisClient });
app.use(casTicketSessionMapperMiddleware);
app.post('*', casSloMiddleware);

// 设置通过不执行中间件逻辑
const pass = (req) => {
  const whitelist = [
    `^${publicPath}favicon.ico$`, // favicon图标，浏览器会自动访问该地址
    `^${publicPath}static/\\S+$`, // 静态文件目录
    '^/app.js$', // DEV生成文件
    '^/\\S+.hot-update.js(on)?$', // 热更新文件
    '^/__webpack_hmr$' // 热更新文件
  ];
  let flag = 0;
  whitelist.forEach((rule) => {
    const reg = new RegExp(rule, 'g');
    if (reg.test(req.url)) {
      flag += 1;
    }
  });
  return flag > 0;
};

// Create a new instance of CASAuthentication.
const port = process.env.EXPRESS_PORT || 8080;
const localHostUrl = (port === 80) ? 'http://localhost' :  `http://localhost:${port}`;
const serviceUrl = process.env.SERVICE_URL || localHostUrl;
const cas = new CASAuthentication({
  cas_url: process.env.CAS_BASE_URL,
  // cas_version: process.env.CAS_VERSION,
  service_url: serviceUrl,
});

// 分布式锁
const redlock = new Redlock(
  // you should have one client for each independent redis node
  // or cluster
  [redisClient],
  {
    // the expected clock drift; for more details
    // see http://redis.io/topics/distlock
    driftFactor: 0.01, // multiplied by lock ttl to determine drift time

    // the max number of times Redlock will attempt
    // to lock a resource before erroring
    retryCount:  10,

    // the time in ms between attempts
    retryDelay:  200, // time in ms

    // the max time in ms randomly added to retries
    // to improve performance under high contention
    // see https://www.awsarchitectureblog.com/2015/03/backoff.html
    retryJitter:  200 // time in ms
  }
);

// Token中间件
const tokenMiddlewareOptions = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  baseUrl: `${process.env.DATA_CENTER_API_BASE_URL}/api/v1`,
  casUserSessionKey: cas.session_name,
  accessTokenCookieKey: process.env.ACCESS_TOKEN_COOKIE_KEY,
  userCategoryCookieKey: process.env.USER_CATEGORY_COOKIE_KEY,
  redisPrefix: process.env.REDIS_PREFIX,
  redlock: redlock,
};
const {
  blockTokenMiddleware,
  renewTokenMiddleware,
  replaceRequestTokenMiddleware,
  removeTokenMiddleware,
} = createTokenMiddlewares(tokenMiddlewareOptions);
app.use(createUnlessMiddleware(pass, blockTokenMiddleware)); // 当用户CAS身份失效时执行，返回401状态码
app.use(createUnlessMiddleware(pass, renewTokenMiddleware)); // 刷新Token
app.use(createUnlessMiddleware(pass, replaceRequestTokenMiddleware)); // 替换AJAX请求Token

// HTTP代理中间件
const proxyMiddlewareOptions = { proxyTable };
const proxyMiddlewares = createProxyMiddlewares(proxyMiddlewareOptions);
app.use(proxyMiddlewares);

// 语言中间件
const localeMiddlewareOptions = {
  localeCookieKey: process.env.LOCALE_COOKIE_KEY,
};
const localeMiddleware = createLocaleMiddleware(localeMiddlewareOptions);
app.use(localeMiddleware);

// 用户类型中间件
const userCategoryMiddlewareOptions = {
  userCategoryCookieKey: process.env.USER_CATEGORY_COOKIE_KEY,
};
const userCategoryMiddleware = createUserCategoryMiddleware(userCategoryMiddlewareOptions);
app.use(userCategoryMiddleware);

// CAS中间件
app.use(createUnlessMiddleware(pass, cas.bounce));

// 登出
app.get(`${publicPath}logout`, removeTokenMiddleware, cas.logout);

// UEditor上传配置，部分项目没有UEditor后端对应接口，故做一个空接口
app.get(`${publicPath}x-upload-config`, (req, res) => {
  res.send('{}');
});

// SSR泻染
ssrRenderMiddleware(app);

app.on('error', (err) => {
  console.error('Server error: \n%s\n%s ', err.stack || '');
});

app.listen(port, () => {
  console.log(`Express server listen in ${port}`);
});
