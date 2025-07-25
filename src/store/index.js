// Store配置
import Vue from 'vue';
import Vuex from 'vuex';

// 封装后在分别导入
import state from './state';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex);

function createStore() {
  return new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules: {
    },
  });
}

export default createStore;
