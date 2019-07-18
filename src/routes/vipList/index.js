import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Input,
    // Button,
    Table,
    Modal,
    // Radio,
    // Checkbox,
    // Row,
    // Col,
    // Menu,
    // Select,
    // Upload,
    // Icon,
    // message
} from "antd";

// 引入编辑器组件
// import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

import Api from '../../utils/api';

// const Option = Select.Option;
// const { TextArea } = Input;
// const RadioGroup = Radio.Group;
const Search = Input.Search;
// const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;


class VipList extends Component {
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
            addTitle: '创建用户资料',

            searchValue: '',
            newSex: '',
        }
    }
    componentDidMount() {
        this.updateList()
    }
    updateList = (page, searchValue) => {
        this
            .props
            .dispatch({ type: 'vipList/updateList', payload: { page: page ? page : this.state.page, nickname: searchValue ? searchValue : this.state.searchValue } })
    }

    searchChange = (e) => {
        let _self = this;
        // console.log(e.target.value)
        _self.setState({
            searchValue:e.target.value
        })
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
   * @memberof VipList
   */
    search = (item) => {
        let _self = this;
        this.setState({
            isSearch: item ? true : false,
            page: 1
        }, () => {
            _self.updateList(_self.state.page, item)
        })
    }
    /**
   * todo 自定义table
   */
    customColumns() {
        let _self = this;
        return [
            {
                title: "头像",
                dataIndex: "img",
                key: "img",
                render: (text, record) => {
                    return (
                        <div className={styles.thumbnai}>
                            <img src={text} alt="" className={styles.thumbnai} />
                        </div>

                    )
                }
            }, {
                title: "昵称",
                dataIndex: "nickname",
                key: "nickname"
            }, {
                title: "电话",
                dataIndex: "phone",
                key: "phone"
            }, {
                title: "性别",
                dataIndex: "sex",
                key: "sex",
                render: (text, record) => {
                    if (text * 1 === 2) {
                        return (
                            <span>女</span>
                        )
                    } else if (text * 1 === 1) {
                        return (
                            <span>男</span>
                        )
                    } else {
                        return (
                            <span>未知</span>
                        )
                    }
                }
            }, {
                title: "姓名",
                dataIndex: "name",
                key: "name"
            }, {
                title: "邮箱",
                dataIndex: "email",
                key: "email"
            }, {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => {
                    return (
                        <div className={styles.listHandle}>
                            <span className={styles.handleItem} onClick={(e) => _self.del(record, e)}>删除</span>
                            <span className={styles.handleItem} onClick={(e) => _self.edit(record, e)}>查看</span>
                        </div>
                    );
                }
            }
        ]
    }
    /**
   * todo 翻页
   * @memberof VipList
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
     * @memberof VipList
     */
    add = (item) => {
        this.setState({ addModle: !this.state.addModle, editItem: {}, newSex: '' });
    }


    /**
   * todo 编辑行
   * @memberof VipList
   */
    edit = (item) => {
        let oldSex = ''
        if (item.sex * 1 === 2) {
            oldSex = '女'

        } else if (item.sex * 1 === 1) {
            oldSex = '男'
        } else {
            oldSex = '未知'
        }
        this.setState({ editItem: item, addModle: !this.state.addModle, addTitle: '查看用户资料', newSex: oldSex })
    }

    /**
        * todo 删除
        * @memberof VipList
        */
    del = (record, e) => {
        let _self = this;
        confirm({
            title: '确认删除',
            content: `确认删除吗?`,
            onOk() {
                _self
                    .props
                    .dispatch({
                        type: 'vipList/del', payload: { id: record.id },
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
        const uploadButton = (
            <div>

                <div className="ant-upload-text">头像</div>
            </div>
        );
        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    会员列表
                </h2>
                <div className={styles.search}>
                    <div className={styles.searchList}>
                        <Search
                            placeholder='请输入标题'
                            enterButton="Search"
                            size="large"
                            allowClear
                            onChange={this.searchChange}
                            onSearch={this.search} />
                    </div>
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
                    width={800}
                    footer={null}
                >
                    <div className={styles.overlay}>
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>昵称</span>
                            <Input
                                className={this.state.editItem.title}
                                value={this.state.editItem.nickname}
                                placeholder='昵称'
                                readOnly="readonly"
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>性别</span>
                            <Input
                                className={this.state.editItem.title}
                                value={this.state.newSex}
                                placeholder='性别'
                                readOnly="readonly"
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>姓名</span>
                            <Input
                                className={this.state.editItem.title}
                                value={this.state.editItem.name}
                                placeholder='姓名'
                                readOnly="readonly"
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>电话</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.editItem.phone}
                                readOnly="readonly"
                                placeholder='电话'
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>地址</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.editItem.address}
                                placeholder='地址'
                                readOnly="readonly"
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>邮箱</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.editItem.email}
                                placeholder='邮箱'
                                readOnly="readonly"
                            />
                        </div >
                        <div className={styles.overlayUpload}>
                            <span className={styles.overlayItemTitle}>头像</span>
                            <div className={styles.uploadImage}>
                                {this.state.editItem.img ? <img src={this.state.editItem.img} alt="avatar" className={styles.uploadImage} /> : uploadButton}
                            </div>

                        </div >
                    </div>
                </Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        data: state.vipList.data
    };
}
export default connect(mapStateToProps)(VipList);
