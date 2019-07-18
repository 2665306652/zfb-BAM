import request from '../utils/request';
import url from '../utils/url';
// import Api from '../utils/api';
export default {

  namespace: 'shopList',

  state: {
    data: {},
    // 父级分类数据
    classifyData: [],
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    // 获取列表数据
    *updateList({ payload }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getshoppinglist, {
        method: 'POST',
        // body: JSON.stringify(payload),
        body: payload,
        // headers: { 'Content-Type': 'application/json' }
      });
      if (res.success) {
        yield put({ type: 'save', payload: { data: res.data } })
        
      }
    },
   
    // 删除列表
    *del({ payload, callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.delshopping, { method: 'POST', body: payload });
      if (res.success) {
        yield callback()
      }
    },
    // 获取详情数据
    *getbyidhotelinfo({ payload,callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getbyidshoppinginfo, {
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
      const res = yield call(request, url.saveshopping, { method: 'POST', body: JSON.stringify(payload), 
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
