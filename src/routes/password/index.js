import React, {Component} from 'react';
import {connect} from 'dva';
import styles from './index.less';
import {Input, Button} from 'antd';
import Api from '../../utils/api';

function mapStateToProps(state) {
    return {userId: state.user.userId};
}

class index extends Component {
    constructor() {
        super();
        this.state = {
            oldpwd:'',
            oldpwdStatus:true,
            value: '',
            valueStatus: true,
            checkValue: '',
            checkValueStatus: true
        }
    }
    checkOld = (item) => {
        let value = item.target.value > 6
            ? item
                .target
                .value
                .slice(0, 6)
            : item.target.value;
        this.setState({
            oldpwd: value,
            oldpwdStatus:value.length < 6
            ? false
            : true
        })
    }
    change = (item) => {
        // console.log(item)
        let value = item.target.value > 6
            ? item
                .target
                .value
                .slice(0, 6)
            : item.target.value;
        this.setState({
            value: value,
            valueStatus: value.length < 6
                ? false
                : true
        })
    }
    checkChange = (item) => {
        let value = item.target.value > 6
            ? item
                .target
                .value
                .slice(0, 6)
            : item.target.value;
        this.setState({
            checkValue: value,
            checkValueStatus: value.length < 6
                ? false
                : value !== this.state.value
                    ? false
                    : true
        })
    }
    submit = () => {
        let _self = this;
        let {value, valueStatus, checkValue, checkValueStatus,oldpwd,oldpwdStatus} = this.state;
        let {userId} = this.props;
        if (!oldpwdStatus || oldpwd === '') {
            Api._toast({type: 'error', title: '请输入正确的原始六位密码'})
            return false;
        }
        if (!valueStatus || value === '') {
            Api._toast({type: 'error', title: '请输入正确的六位密码'})
            return false;
        }
        if (!checkValueStatus || checkValue === '') {
            Api._toast({type: 'error', title: '两次密码不一致'})
            return false;
        }

        this
            .props
            .dispatch({
                type: 'user/editpassword',
                payload: {
                    pwd: value,
                    id: userId,

                    newpwd:value,
                    renewpwd:checkValue,
                    oldpwd:oldpwd,
                },
                callback: function (res) {
                    Api._toast({title: '修改成功'});
                    _self.setState({value: '', checkValue: '',oldpwd:''});
                   
                    _self.exit()
                }
            })

    }
    exit() {
        Api._logout(this.props)
    }
    render() {
        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    修改密码
                </h2>
                <div className={styles.main}>
                <div className={styles.mainItem}>
                        <span className={styles.itemTitle}>原密码:</span>
                        <Input
                            type='password'
                            value={this.state.oldpwd}
                            onChange={this.checkOld}
                            className={this.state.oldpwdStatus
                                ? styles.itemInput
                                : styles.itemError}
                           />
                    </div>
                    <div className={styles.mainItem}>
                        <span className={styles.itemTitle}>新密码:</span>
                        <Input
                            type='password'
                            value={this.state.value}
                            onChange={this.change}
                            className={this.state.valueStatus
                            ? styles.itemInput
                            : styles.itemError}/>
                    </div>
                    <div className={styles.mainItem}>
                        <span className={styles.itemTitle}>确认新密码:</span>
                        <Input
                            type='password'
                            value={this.state.checkValue}
                            onChange={this.checkChange}
                            className={this.state.checkValueStatus
                            ? styles.itemInput
                            : styles.itemError}/>
                    </div>

                    <div className={styles.mainItem}>
                        <Button
                            size="large"
                            className={styles.sure}
                            type="primary"
                            onClick=
                            { () => this.submit() }>
                            确认
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps,)(index);