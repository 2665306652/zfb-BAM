import { notification } from 'antd';
import copy from 'copy-to-clipboard';


module.exports = {
    jurisdiction: [
        {
            id: 10,
            value: '首页',
            icon: 'home',
            url: '/',
            router: [
                '/'
            ]
        }, {
            id: 20,
            value: '文章管理',
            icon: 'read',
            router: [
                '/artlist',
                '/artcategory'
            ],
            children: [
                {
                    id: 201,
                    icon: 'bars',
                    url: '/artlist',
                    value: '文章列表'
                }, {
                    id: 202,
                    icon: 'bars',
                    url: '/artcategory',
                    value: '文章分类'
                }
            ]
        }, {
            id: 30,
            value: '票务',
            icon: 'idcard',
            router: [
                '/ticklist',
                '/tickcategory'
            ],
            children: [
                {
                    id: 301,
                    icon: 'bars',
                    url: '/ticklist',
                    value: '票务列表'
                }, {
                    id: 302,
                    icon: 'bars',
                    url: '/tickcategory',
                    value: '票务分类'
                }
            ]
        }, {
            id: 40,
            value: '酒店',
            icon: 'box-plot',
            router: [
                '/hotellist',
            ],
            children: [
                {
                    id: 401,
                    icon: 'bars',
                    url: '/hotellist',
                    value: '酒店列表'
                }
            ]
        }, {
            id: 50,
            value: '美食',
            icon: 'shop',
            router: [
                '/foodlist',
            ],
            children: [
                {
                    id: 501,
                    icon: 'bars',
                    url: '/foodlist',
                    value: '美食列表'
                }
            ]
        }, {
            id: 60,
            value: '购物',
            icon: 'shopping',
            router: [
                '/shoplist',
            ],
            children: [
                {
                    id: 601,
                    icon: 'bars',
                    url: '/shoplist',
                    value: '购物列表'
                }
            ]
        },
        {
            id: 70,
            value: '导游',
            icon: 'team',
            router: [
                '/guidelist',
                '/guidecomment',
            ],
            children: [
                {
                    id: 701,
                    icon: 'bars',
                    url: '/guidelist',
                    value: '导游列表'
                },
                {
                    id: 702,
                    icon: 'bars',
                    url: '/guidecomment',
                    value: '导游评论'
                }
            ]
        },
        {
            id: 80,
            value: '3D场景',
            icon: 'area-chart',
            url: '/3d',
            router: [
                '/3d'
            ]
        },
        {
            id: 90,
            value: '广告',
            icon: 'sound',
            router: [
                '/adlist',
            ],
            children: [
                {
                    id: 901,
                    icon: 'bars',
                    url: '/adlist',
                    value: '广告列表'
                }
            ]
        },
        {
            id: 100,
            value: '会员管理',
            icon: 'crown',
            router: [
                '/viplist',
            ],
            children: [
                {
                    id: 1001,
                    icon: 'bars',
                    url: '/viplist',
                    value: '会员列表'
                }
            ]
        },
        {
            id: 110,
            value: '系统设置',
            icon: 'setting',
            router: [
                '/sysuser',
                '/urllist',
                '/moduleset',
            ],
            children: [
                {
                    id: 1101,
                    icon: 'bars',
                    url: '/sysuser',
                    value: '系统用户'
                }
            ]
        }
    ],
	/**
	 * todo 信息提示框
	 * @param {*} param0
	 */
    _toast({ type, title, text }) {
        type = type
            ? type
            : 'success';
        notification[type]({
            message: title,
            description: text
                ? text
                : '',
            duration: 2
        });
    },
	/**
	 * todo 判断当前page是否存在
	 * @param {*} total
	 * @param {*} current
	 * @returns
	 */
    _pageCheck(total, current) {
        if (total <= 0)
            return 1;
        let maxPage = Math.ceil(total / 10);
        return current <= maxPage
            ? current
            : current - 1;
    },
	/**
	 *设置sessionStorage
	 *
	 * @param {*} key 保存的键
	 * @param {*} value 值
	 */
    _setSessionStorage(key, value) {
        let str = JSON.stringify(value);
        sessionStorage.setItem(key, str);
    },

	/**
	 * 清空所有的SessionStorage
	 *
	 */
    _getSessionStorage() {
        sessionStorage.clear();
    },

	/**
	 * 获取SessionStorage，不清空任何的SessionStorage
	 *
	 * @param {*} key 需要获取的key
	 * @returns 返回获取到的结果
	 */
    _getSessionStorageUnclear(key) {
        const item = sessionStorage.getItem(key);
        // console.log(item,'缓存')
        if (!item) {
            return false;
        }
        return JSON.parse(item);
    },

	/**
	*时间戳转换日期 如： 2018.8.8 06:06:06
	*
	* @param {*} time 时间戳
	* @returns 返回日期
	*/
    _timeFilter(time) {
        let timestamp = new Date(time);
        let datePickerValue = timestamp
            .toLocaleDateString()
            .replace(/\//g, ".") + " " + timestamp
                .toTimeString()
                .substr(0, 8);
        return datePickerValue;
    },
	/**
	 * todo 返回用户指定权限
	 * @param {*} arr
	 */
    _getJurisdiction(arr) {
        let res = [];
        arr.forEach((item) => {
            let current = this
                .jurisdiction
                .filter(n => n.id === item);
            res = res.concat(current)
        })
        return res
    },
	/**
	 * todo 退出登录
	 * @param {*} props
	 */
    _logout(props) {
        let _self = this;
        let {  history, dispatch } = props;
        dispatch({
            type: 'user/outLogin',
            payload: {
                // id: id
            },
            callback: function (res) {
                _self._getSessionStorage();
                history.push('/login');
            }
        })
    },
    /**
     * todo 复制到剪切板
     * @param {*} value 
     */
    _copy(value) {
        let _self = this;
        copy(value);
        _self._toast({
            type: '',
            title: '复制成功',
            text: '可直接粘贴'
        });
    }
}