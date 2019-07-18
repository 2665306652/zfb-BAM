import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Input,
    Button,
    Table,
    Modal,
    // Radio,
    // Checkbox,
    Select,
} from "antd";


import Api from '../../utils/api';

const Option = Select.Option;
// const { TextArea } = Input;
// const RadioGroup = Radio.Group;
// const Search = Input.Search;
// const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;


class SysUser extends Component {
    constructor() {
        super();
        this.state = {
           
            page: 1,
            addModle: false,
            searchText: [
                '请输入标题'
            ],
            isSearch: false,
            editItem: {},//当前编辑行
            isEdit:false,
            addTitle:'创建系统用户',
            // 新增参数
            username:'',
            password:'',
            respassword:'',
            name:'',
            status:'',
            id:'',
        }
    }
    componentDidMount() {
        this.updateList()
        this.setState({
            username:'',
            password:'',
        })
    }
    updateList = (page, searchValue) => {
        this
            .props
            .dispatch({ type: 'sysuser/updateList', payload: { page: page ? page : this.state.page}})
    }
    searchChange = (e) => {
        let _self = this;
        // console.log(e.target.value)
        if (!e.target.value) {
            this.setState({
                isSearch: false
            }, () => {
                _self.updateList()
            })
        }
    }
    /**
   * todo 点击搜索
   * @memberof SysUser
   */
    search = (item) => {
        let _self = this;
        this.setState({
            isSearch: item ? true : false,
            searchValue: item
        }, () => {
            _self.updateList()
        })
    }
    /**
   * todo 自定义table
   */
    customColumns() {
        let _self = this;
        return [
            {
                title: "用户名",
                dataIndex: "username",
                key: "username",
            }, {
                title: "真实姓名",
                dataIndex: "name",
                key: "name"
            }, {
                title: "创建时间",
                dataIndex: "gmtcreate",
                key: "gmtcreate"
            }, {
                title: "登录时间",
                dataIndex: "gmtmodified",
                key: "gmtmodified",
                render: (action,react) => {
                    let newGmtmodified=''
                    if(!react.loginip){
                        newGmtmodified=''
                    }else {
                        newGmtmodified=react.gmtmodified
                    }
                    return (
                      <span>{newGmtmodified}</span>
                    );
                }
            }, {
                title: "登录IP",
                dataIndex: "loginip",
                key: "loginip"
            }, {
                title: "登录次数",
                dataIndex: "logincount",
                key: "logincount"
            }, {
                title: "状态",
                dataIndex: "status",
                key: "status",
                render: (text) => {
                    return (
                      <span>{text*1===1?"正常":'冻结'}</span>
                    );
                }
            }, {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => {
                    return (
                        <div className={styles.listHandle}>
                            <span className={styles.handleItem} onClick={(e) => _self.del(record, e)}>删除</span>
                            <span className={styles.handleItem} onClick={(e) => _self.edit(record, e)}>编辑</span>
                        </div>
                    );
                }
            }
        ]
    }
    /**
   * todo 翻页
   * @memberof SysUser
   */
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            page: pagination.current
        }, () => {
            this.updateList()
        });
    };


    /**
     * todo 添加
     * @memberof SysUser
     */
    add = (item) => {
        this.setState({ 
            addModle: !this.state.addModle,
            isEdit:false,
            editItem:{},
            addTitle:'创建系统用户',

            username:'',
            password:'',
            respassword:'',
            name:'',
            status:'',
            id:'',
        });

    }


    /**
   * todo 编辑行
   * @memberof SysUser
   */
    edit = (item) => {
        this.setState({ 
            editItem: item, 
            addModle: !this.state.addModle, 
            isEdit:true,addTitle:'编辑系统用户',
            status:item.status*1===0?'冻结':'正常',
            id:item.id,
            username:item.username,
            name:item.name,
        })
    }

    /**
        * todo 删除
        * @memberof SysUser
        */
    del = (record,e) => {
        let _self = this;
        confirm({
            title: '确认删除',
            content: `确认删除吗?`,
            onOk() {
                _self
                .props
                .dispatch({
                    type: 'sysuser/del', payload: { id: record.id },
                    callback: function () {
                        _self.updateList()
                        Api._toast({ title: '删除成功' })
                    }
                })
            },
            onCancel() {

            }
        });
    }

    handleOk=()=>{
        let newstatus=''
            if(this.state.status==='冻结'){
                newstatus='0'
            }else if(this.state.status==='正常'){
                newstatus='1'
            }else {
                newstatus=''
            }
            let handeOkid = this.state.id;
            let self = this;
            if(handeOkid){
                if(!newstatus){
                    Api._toast({ title: '请选择用户状态' })
                }else{
                    self
                .props
                .dispatch({
                    type: 'sysuser/handleOk', payload: {
                       
                        status: newstatus,
                        id: this.state.id,
                        username:this.state.username,
                        name:this.state.name,
                    },
                    callback: function () {
                        Api._toast({ title: '修改成功' })
                        self.handleOkcallback()
                    }
                })
                }
            }else {
                if (!this.state.username) {
                    Api._toast({ title: '请输入用户名' })
                } else if (!this.state.name) {
                    Api._toast({ title: '请输入真实姓名' })
                } else if (!this.state.password) {
                    Api._toast({ title: '请输入登陆密码' })
                }  else if (!this.state.respassword) {
                    Api._toast({ title: '请重复输入登陆密码' })
                }else if (!newstatus) {
                    Api._toast({ title: '请选择用户状态' })
                }else if(!this.state.respassword===this.state.password){
                    Api._toast({ title: '俩次密码不相等，请确认' })
                }else {
                    self
                .props
                .dispatch({
                    type: 'sysuser/handleOk', payload: {
                        username:this.state.username,
                        name:this.state.name,
                        password:this.state.password,
                        respassword:this.state.respassword,
                        status: newstatus,
                    },
                    callback: function () {
                        Api._toast({ title: '添加成功' })
                        self.handleOkcallback()
                    }
                })
                }
            }
    }
    handleOkcallback = () => {
        const { addModle } = this.state;
        this.setState({
            addModle: !addModle
        })
        this.updateList()
    }
    selectChange = (value, configInput) => {
        if (configInput) {
            this.setState({
                [configInput]: value
            })
        }
    }
    changeValue = (e, configInput) => {
        if (configInput) {
            this.setState({
                [configInput]: e.target.value
            })
        }
    }
    render() {
        const data = this.props.data
        const locale = {
            emptyText: "暂无数据显示！"
        };
        const tableOption = {
            columns: this.customColumns(),
            dataSource: data.list,
            onChange: this.handleTableChange,
            pagination: {
                current: this.state.page,
                total: data.total,
                style: {
                    marginRight: '20px'
                }
            }
        };
        const isLoading = false;
        
        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    系统用户
                </h2>
                <div className={styles.search}>
                    {/* <div className={styles.searchList}>
                        <Search
                            placeholder='请输入标题'
                            enterButton="Search"
                            size="large"
                            allowClear
                            onChange={this.searchChange}
                            onSearch={this.search} />
                    </div> */}
                    <Button
                        size="large"
                        type="primary"
                        onClick=
                        {(e) => this.add(null, e)}>
                        添加用户
                    </Button>
                </div >
                <div className={styles.list}>
                    {data.list
                        ? (<Table
                            loading={isLoading}
                            locale={locale}
                            rowKey=
                            {record => record.id}
                            dataSource={data.list}
                            {...tableOption} />)
                        : ("暂时没有数据")}
                </div>

                <Modal
                    title={this.state.addTitle}
                    visible={this.state.addModle}
                    onCancel={this.add}
                    onOk={this.handleOk}
                    width={990}
                >
                    <div className={styles.overlay}>
                        <div className={styles.overlayItem} style={{display:this.state.isEdit?'flex':'none'}}>
                            <span className={styles.overlayItemTitle}>用户名</span>
                            <Input
                                className={this.state.editItem.title}
                                value={this.state.username}                        
                                readOnly="readonly"
                            />
                        </div >
                        <div className={styles.overlayItem}  style={{display:this.state.isEdit?'flex':'none'}}>
                            <span className={styles.overlayItemTitle}>真实姓名</span>
                            <Input
                                className={this.state.editItem.editPhoneStatus}
                                value={this.state.name}
                                readOnly="readonly"
                            />
                        </div >
                        <div className={styles.overlayItem} style={{display:this.state.isEdit?'none':'flex'}}>
                            <span className={styles.overlayItemTitle}>用户名</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.username}
                                onChange=
                                {(value) => this.changeValue(value, 'username')}
                                name="username"
                            />
                        </div >
                        <div className={styles.overlayItem} style={{display:this.state.isEdit?'none':'flex'}}>
                            <span className={styles.overlayItemTitle}>真实姓名</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.name}
                                onChange=
                                {(value) => this.changeValue(value, 'name')}
                                name="name"
                            />
                        </div >
                       
                        
                        <div className={styles.overlayItem} style={{display:this.state.isEdit?'none':'flex'}}>
                            <span className={styles.overlayItemTitle}>登陆密码</span>
                            <Input.Password
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.password}
                                onChange=
                                {(value) => this.changeValue(value, 'password')}
                                name="user_passwd"
                               
                            />
                        </div >
                        <div className={styles.overlayItem}  style={{display:this.state.isEdit?'none':'flex'}}>
                            <span className={styles.overlayItemTitle}>重复登陆密码</span>
                            <Input.Password
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.respassword}
                                onChange=
                                {(value) => this.changeValue(value, 'respassword')}
                                name="respassword"
                                password="true"
                            />
                        </div >
                        {/* <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>管理组</span>
                            <Select className={styles.dropdownItem} defaultValue="管理组" value={this.state.editItem.group} onChange={this.selectChange}>
                                            <Option key='01'>超级管理员</Option>
                                            <Option key='02'>景区</Option>
                            </Select>
                        </div > */}
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>用户状态 </span>
                            <Select className={styles.dropdownItem} defaultValue="用户状态" getPopupContainer={triggerNode => triggerNode.parentNode} value={this.state.status}  onChange={(value) => this.selectChange(value, 'status')}>
                                            <Option key='冻结'>冻结</Option>
                                            <Option key='正常'>正常</Option>
                            </Select>
                        </div >
                    </div>
                </Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        data: state.sysuser.data
    };
}
export default connect(mapStateToProps)(SysUser);
