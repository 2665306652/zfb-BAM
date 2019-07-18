import request from '../utils/request';
import url from '../utils/url';
// import Api from '../utils/api';
export default {

  namespace: 'artCategory',

  state: {
    data: [],

    // 父级分类数据
    classifyData: [],
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {

    *artCategory({ payload }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getarticlecategorylist, { method: 'POST', body: payload });
      if (res.success) {
        yield put({ type: 'save', payload: { data: res.data } })
      }
    },
    *del({ payload,callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.delarticlecategory, { method: 'POST', body: payload });
      if (res.success) {
        yield callback()
      }
    },
    *classifyData({ payload }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getfcategorylist, { method: 'POST', body: payload });
      if (res.success) {
        yield put({ type: 'save', payload: { classifyData: res.data } })
      }
    },

    *savearticlecategory({ payload,callback}, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.savearticlecategory, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.success) {
        yield callback();
      }
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

};
