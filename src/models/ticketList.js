import request from '../utils/request';
import url from '../utils/url';
// import Api from '../utils/api';
export default {

  namespace: 'tickeList',

  state: {
    data: {},
    // 父级分类数据
    classifyData: [],
    detailsData: [],
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    // 获取票务列表数据
    *updateList({ payload }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getticketlist, {
        method: 'POST',
        // body: JSON.stringify(payload),
        body: payload,
        // headers: { 'Content-Type': 'application/json' }
      });
      if (res.success) {
        yield put({ type: 'save', payload: { data: res.data } })
      }
    },
    // 获取票务列表分类数据
    *classifyData({ payload }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.gettiketbycategory, { method: 'POST', body: payload });
      if (res.success) {
        yield put({ type: 'save', payload: { classifyData: res.data } })
      }
    },
    // 删除票务列表
    *del({ payload, callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.delticket, { method: 'POST', body: payload });
      if (res.success) {
        yield callback()
      }
    },
    *getbyidticketinfo({ payload,callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getbyidticketinfo, {
        method: 'POST',
        // body: JSON.stringify(payload),
        body: payload,
        // headers: { 'Content-Type': 'application/json' }
      });
      if (res.success) {
        callback && callback(res.data);
        yield put({ type: 'save', payload: { detailsData: res.data } });
      }
    },
   
     // 保存数据
     *handleOk({ payload, callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.saveticket, { method: 'POST', body: JSON.stringify(payload), 
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
