import Api from './api';
let message = {
    1001: '用户名或者密码错误！',
    1002: '保存失败！',
    1003: '电话错误',
    1004: '旧密码输入错误！',
    1005: '两次输入的新密码不一致！',
    1006: '该用户名已存在！',
    1007: '请先登录',
    1008: '上传图片失败！',
    1009: '上传图片不能超过2MB！',
    1010: '该标题已存在！',
    1011: '父级分类选择错误！',
    1012: '评论内容过长！',
    1013: '上传图片宽度不能大于400px！',
    1014: '用户已被冻结,请联系管理员',
    // 1016: '该小区您已添加地址',s
    // 1017: '用户名或者密码错误',
    // 1018: '银行卡识别错误',
    // 1019: '可提现金不足',
    // 1020: '请先登录'
}

function errorMessage(res){
    if (res.code === "1007") {
        Api._getSessionStorage();
        window.location.href = window.location.href + 'login'
    } else {
        Api._toast({
            type: 'error',
            title: message[res.code],
            text: res.message
        })
    }
}

module.exports =  errorMessage;
