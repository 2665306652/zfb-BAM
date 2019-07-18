import request from '../utils/request';
import url from '../utils/url';
// import Api from '../utils/api';
export default {

  namespace: 'vipList',

  state: {
    data: {},
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {

    *updateList({ payload }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getuserlist, {
        method: 'POST',
        // body: JSON.stringify(payload),
        body:payload,
        // headers: { 'Content-Type': 'application/json' }
       });
      if (res.success) {
        yield put({ type: 'save', payload: { data: res.data } })
      }
    },
    *del({ payload,callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.deluser, { method: 'POST', body: payload });
      if (res.success) {
        yield callback()
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

};
