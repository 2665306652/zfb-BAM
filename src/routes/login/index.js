import React, { Component } from "react";
import {
    Button,
    Input,
    Form,
    Icon,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';
// import Api from '../../utils/api';

const FormItem = Form.Item;



class Login extends Component {

    componentDidMount() {
        /* let isLogin = Api._getSessionStorageUnclear('__loginState__');
        if (isLogin) {
            this.props.history.push('/');
        } */
    }

    /**
     * 提交
     *
     * @param {*} e
     */
    handleSubmit = (e) => {
        let self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { NN, PP } = values;
                self.props.dispatch({
                    type: 'user/userLogin',
                    payload: {
                        username: NN,
                        password: PP,
                    },
                    callback: self.callback
                });
            };
        });
    }

    // 登录成功跳转
    callback = () => {
        this.props.history.push('/');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.loginbox}>
                <div className={styles.logincontent}>
                    <div className={styles.loginleft}>运营管理系统</div>
                    <div className={styles.loginright}>
                        <div className={styles.greenlogo}>游嵩山</div>
                        <Form onSubmit={this.handleSubmit} className={styles.loginform}>
                            <FormItem style={{ width: '290px' }}>
                                {getFieldDecorator('NN', {
                                    rules: [{ required: true, message: '请输入账号！' }],
                                })(
                                    <div className={styles.logininputbox}>
                                        <Icon type="user" style={{ color: '#4db95b', fontSize: '23px', marginRight: '12px' }} />
                                        <Input maxLength={11} className={styles.logininput} placeholder="请输入账号" />
                                    </div>
                                )}
                            </FormItem>
                            <FormItem style={{ width: '290px', marginTop: '50px' }}>
                                {getFieldDecorator('PP', {
                                    rules: [{ required: true, message: '请输入密码！' }],
                                })(
                                    <div className={styles.logininputbox}>
                                        <Icon type="lock" style={{ color: '#4db95b', fontSize: '23px', marginRight: '12px' }} />
                                        <Input className={styles.logininput} placeholder="请输入密码" type="password" />
                                    </div>
                                )}
                            </FormItem>
                            <FormItem style={{ width: '250px', marginTop: '50px' }}>
                                <Button type="primary" htmlType="submit" className={styles.loginformbutton}>
                                    登录
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(Login);
function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(WrappedNormalLoginForm);