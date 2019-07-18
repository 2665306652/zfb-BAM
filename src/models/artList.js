import request from '../utils/request';
import url from '../utils/url';
// import Api from '../utils/api';
export default {

  namespace: 'artList',

  state: {
    data: {},
    // 父级分类数据
    classifyData:[] ,
    detailData:[]
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {

    *getarticlelist({ payload }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getarticlelist, {
        method: 'POST',
        // body: JSON.stringify(payload),
        body:payload,
        // headers: { 'Content-Type': 'application/json' }
       });
      if (res.success) {
        yield put({ type: 'save', payload: { data: res.data } })
      }
    },
    *delarticle({ payload,callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.delarticle, { method: 'POST', body: payload });
      if (res.success) {
        yield callback()
      }
    },

    *classifyData({ payload }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getfArticlecategorylist, { method: 'POST', body: payload });
      if (res.success) {
        yield put({ type: 'save', payload: { classifyData: res.data } })
        
      }
    },

    *getbyidarticleinfo({ payload,callback, fail }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getbyidarticleinfo, {
        method: 'POST',
        // body: JSON.stringify(payload),
        body:payload,
        // headers: { 'Content-Type': 'application/json' }
       });
       if (res.success) {
        callback && callback(res.data);
        yield put({ type: 'save', payload: { detailData: res.data } });
      } else {
        // fail && fail(res)
      }
    },

    *savearticle({ payload,callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.savearticle, { method: 'POST', body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
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
