/* const getters = {
};
export default getters; */

// 计算属性
const getters = {
  routes: (state) => state.routes,
  userForbidden: (state) => state.userForbidden,
};

export default getters;
