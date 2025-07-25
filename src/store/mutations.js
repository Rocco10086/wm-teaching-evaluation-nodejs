/* const mutations = {
};
export default mutations; */

// 方法
const mutations = {
  initAuths(state) {
    state.authLoaded = true;
  },

  // 禁止登錄界面
  changeUserForbidden(state, value) {
    state.userForbidden = value;
  },
};

export default mutations;
