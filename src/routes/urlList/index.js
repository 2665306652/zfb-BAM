import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Input,
    Button,
    Table,
    Modal,
    Radio,
    Checkbox,
    Row,
    Col,
    Menu,
    Select,
    Upload,
    Icon,
    message
} from "antd";

// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

import Api from '../../utils/api';

const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;


class UrlList extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            addModle: false,
            searchText: [
                '请输入'
            ],
            isSearch: false,
            editItem:{},//当前编辑行
            addTitle:'创建链接'
        }
    }
    componentDidMount() {
    }
    updateList = () => {
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
   * @memberof UrlList
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
                title: "链接名称",
                dataIndex: "name",
                key: "name"
            }, {
                title: "链接",
                dataIndex: "link",
                key: "link"
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
   * @memberof UrlList
   */
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            page: pagination.current
        }, () => {

        });
    };


    /**
     * todo 添加
     * @memberof UrlList
     */
    add = (item) => {
        this.setState({ addModle: !this.state.addModle,addTitle:'创建链接' ,editItem:{}});

    }


      /**
     * todo 编辑行
     * @memberof UrlList
     */
    edit=(item)=>{
this.setState({editItem:item,addModle: !this.state.addModle,imageUrl:item.image,addTitle:'编辑链接'})
    }

    /**
        * todo 删除
        * @memberof UrlList
        */
    del = (item) => {
        let _self = this;
        confirm({
            title: '确认删除',
            content: `确认删除吗?`,
            onOk() {
                Api._toast({ title: '删除成功' })
            },
            onCancel() {

            }
        });
    }
    /**
        * todo 复制链接
        * @memberof UrlList
        */
    link = (item) => {
        Api._copy('hhhhhh3333333');
    }
   
    selectChange=()=>{

    }
    changeValue=(item,val)=>{
        let editItem=this.state.editItem;
        editItem[val]=item.target.value;
        this.setState({editName:editItem})
    }
    render() {
        const locale = {
            emptyText: "暂无数据显示！"
        };
        const tableOption = {
            columns: this.customColumns(),
            dataSource: this.state.data,
            onChange: this.handleTableChange,
            pagination: {
                current: this.state.page,
                total: this.state.data.length,
                style: {
                    marginRight: '20px'
                }
            }
        };
        const menu = (
            <Menu>
                {this
                    .state
                    .classifyList
                    .map((item) => {
                        return (
                            <Menu.Item key={item.id}>
                                <span>{item.value}</span>
                            </Menu.Item>
                        )
                    })}

            </Menu>
        );
        // console.log(this.props.loading)
        const isLoading = false;
        console.log(this.state.data);
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    链接地址
                </h2>
                <div className={styles.search}>
                    <div className={styles.searchList}>
                        <Search
                            placeholder='请输入'
                            enterButton="Search"
                            size="large"
                            allowClear
                            onChange={this.searchChange}
                            onSearch={this.search} />
                    </div>

                    <Button
                        size="large"
                        className={styles.add}
                        type="primary"
                        onClick=
                        {(e) => this.add(null, e)}>
                        添加
                    </Button>
                </div >
                <div className={styles.list}>
                    {this.state.data
                        ? (<Table
                            loading={isLoading}
                            locale={locale}
                            rowKey=
                            {record => record.id}
                            dataSource={this.state.data}
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
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>链接名称</span>
                            <Input
                                className={this.state.editItem.name}
                                value={this.state.editItem.name}
                                onChange=
                                { (value) => this.changeValue(value,'name') }
                                name="name"
                            />
                        </div >
                      
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>链接</span>
                            <Input
                                className={this.state.editPhoneStatus}
                                value={this.state.editItem.link}
                                 onChange=
                                { (value) => this.changeValue(value,'link') }
                                name="link"
                            />
                        </div >
                        </div>
                </Modal>
            </div>
        );
    }
}
export default connect()(UrlList);
