import request from '../utils/request';
import url from '../utils//url';
import Api from '../utils/api';
export default {

    namespace: 'user',

    state: {
        // 账号
        userName: '',
        // 名字
        name:'',
        // 用户id
        userId: '',
        // 登录状态
        loginState: false,
        // 权限
        jurisdiction: '',
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    effects: {
        *setData({ payload }, { call, put }) {  // eslint-disable-line
            yield put({
                type: 'save',
                payload
            });
        },
        // 获取用户信息
        // *getLoginInfo({ payload }, { call, put }) {  // eslint-disable-line
        //     const res = yield call(request, url.getLoginInfo, { method: 'POST' });
        //     if (res.success) {
        //         yield put({ type: 'save', payload: { userName: res.data.username,name: res.data.name,userId: res.data.id} })
        //       }
        // },
        // 获取用户信息(带有权限=》后期做权限)
        *getLoginInfo({ callback, successCallback }, { call, put }) {
            const res = yield call(request, url.getLoginInfo, { method: 'POST' });
            if (res.success) {
                // let { phone, id } = res.data;
                let { userName, id } = res.data;
                yield put({ type: 'save', payload: { name: res.data.name} })
                if (userName && id !== undefined) {
                    Api._setSessionStorage('__loginState__', {
                        userName: res.data.username,
                        name:res.data.name,
                        loginState: true,
                        userId: id,
                        // jurisdiction: res.data.jurisdiction,
                        // phone: res.data.phone
                    });
                    yield put({
                        type: 'save',
                        payload: {
                            userName: res.data.username,
                            name:res.data.name,
                            userId: res.data.id,
                            loginState: true,
                            // jurisdiction: res.data.jurisdiction,
                            // phone: res.data.phone
                        }
                    });
                    // successCallback && successCallback(res.data.jurisdiction);
                    successCallback && successCallback();

                } else {
                    callback && callback();
                }
            };
        },
      
        // 登录
        *userLogin({ payload, callback }, { call, put }) { 
             // eslint-disable-line
            const res = yield call(request, url.userLogin, {
                body: payload,
            });
            if (res.success) {
                res.data.jurisdiction = [10,20,30,40,50,60,70,80,90,100,110];
                // let { username, id, jurisdiction, phone } = res.data;
                let { username, id, jurisdiction } = res.data;
                Api._toast({
                    type: 'success',
                    title: '成功',
                    text: '登录成功'
                });
                Api._setSessionStorage('__loginState__', {
                    userName: username,
                    loginState: true,
                    userId: id,
                    jurisdiction,
                    // phone
                });
                yield put({
                    type: 'save',
                    payload: {
                        userName: username,
                        userId: id,
                        loginState: true,
                        jurisdiction,
                        // phone
                    }
                });
                callback && callback();
            };
        },
        // 修改密码
        *editpassword({ payload, callback }, { call, put }) {
            const res = yield call(request, url.editpassword, {
                body: payload, //JSON.stringify(payload),
                // headers: {
                //   'Content-Type': 'application/json'
                // }
            })
            if (res.success) {
                callback && callback(res)
            };
        },

        *exit({ payload, callback }, { call, put }) {
            const res = yield call(request, url.outLogin, {
                body: payload,
            })
            if (res.success) {
                callback && callback(res)
            };
        },
          // 退出登录
          *outLogin({payload, callback }, { call, put }) {
            const res = yield call(request, url.outLogin, { method: 'POST',body: payload, });
            if (res.success) {
                Api._toast({
                    type: 'success',
                    title: '成功',
                    text: '退出登录成功'
                });
                callback && callback(res);
            };
        },
    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
            return history.listen(({ pathname }) => {
                let isLogin = Api._getSessionStorageUnclear('__loginState__');
                if (!isLogin) {
                    dispatch({
                        type: 'getLoginInfo',
                        callback() {
                            if (pathname !== '/login') history.push('/login');
                        },
                        successCallback(isLoginJurisdiction) {
                            // jurisdictionFunction(pathname, isLoginJurisdiction, history);
                        }
                    })
                    return;
                };
                
                dispatch({
                    type: 'save',
                    payload: {
                        userName: isLogin.userName,
                        loginState: true,
                        userId: isLogin.userId,
                        jurisdiction: isLogin.jurisdiction,
                        // phone: isLogin.phone
                    }
                });
                // jurisdictionFunction(pathname, isLogin.jurisdiction, history);
            })
        },
    },

};

/**
 * 权限判断
 *
 * @param {*} pathname 路径
 * @param {*} jurisdiction 权限
 * @param {*} history 跳转
 * @returns
 */
// function jurisdictionFunction(pathname, jurisdiction, history) {
//     if (jurisdiction === '') {
//         Api._getSessionStorage();
//         Api._toast({
//             type: 'error',
//             title: '权限不足',
//             text: '该账户暂无任何权限，请更换账号登录'
//         });
//         history.push('/login');
//         return false;
//     };
//     const publicRouter = ['/user', '/password'];//公共权限页面
//     if (publicRouter.includes(pathname)) {
//         return false;
//     };
//     const jurisdictionList = Api.jurisdiction,
//         // eslint-disable-next-line no-eval
//         jurisdictionArr = eval('[' + jurisdiction + ']'),
//         filterPathname = jurisdictionList.filter(({ router }) => {
//             return router.includes(pathname);
//         }),
//         isAuthority = jurisdictionArr.includes(filterPathname.length > 0 ? filterPathname[0].id : '');
//     if (pathname === '/login' || !isAuthority) {
//         const pushPath = jurisdictionList.filter(({ id }) => {
//             return id === jurisdictionArr[0];
//         });
//         if (pathname !== '/login') {
//             Api._toast({
//                 type: 'error',
//                 title: '权限不足',
//                 text: '抱歉！已为您跳转到您有权限的页面'
//             });
//         };
//         history.push(pushPath[0].router[0]);
//     };
// }
