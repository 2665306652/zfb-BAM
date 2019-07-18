import request from '../utils/request';
import url from '../utils/url';
// import Api from '../utils/api';
export default {

  namespace: 'sysuser',

  state: {
    data: {},
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
      const res = yield call(request, url.getmanageuserlist, {
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
      const res = yield call(request, url.delmanageuser, { method: 'POST', body: payload });
      if (res.success) {
        yield callback()
      }
    },
     // 保存数据
     *handleOk({ payload, callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.saveuserinfo, { method: 'POST', body: JSON.stringify(payload), 
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
