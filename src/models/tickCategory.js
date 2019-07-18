import request from '../utils/request';
import url from '../utils/url';
// import Api from '../utils/api';
export default {

  namespace: 'tickCategory',

  state: {
    dataList: {},
    // 父级分类数据
    classifyData:[] ,
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    // 获取票务分类数据
    *updateList({ payload }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.gettickecategorlist, {
        method: 'POST',
        // body: JSON.stringify(payload),
        body:payload,
        // headers: { 'Content-Type': 'application/json' }
       });
      if (res.success) {
        yield put({ type: 'save', payload: { dataList: res.data } })
      }
    },
    // 获取票务分类父级数据
    *classifyData({ payload}, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.getfticketlist, { method: 'POST', body: payload });
      if (res.success) {
        yield put({ type: 'save', payload: { classifyData: res.data } })
      }
    },
    // 删除票务分类
    *del({ payload,callback }, { call, put }) {
        // eslint-disable-line
        const res = yield call(request, url.deltickecategor, { method: 'POST', body: payload });
        if (res.success) {
          yield callback()
        }
      },

      // 保存数据
    *handleOk({ payload,callback }, { call, put }) {
      // eslint-disable-line
      const res = yield call(request, url.saveticketcategory, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }});
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
