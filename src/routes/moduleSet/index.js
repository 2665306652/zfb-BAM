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
    // Row,
    // Col,
    Menu,
    Select,
    // Upload,
    Icon,
    // message
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


class ModuleSet extends Component {
    constructor() {
        super();
        this.state = {
            data: [
                {
                    id: '001',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '导航',
                    time: '2019年04月17日',
                },
                {
                    id: '002',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '嵩山资讯',
                    time: '2019年04月17日',
                }, {
                    id: '003',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '嵩山资讯',
                    time: '2019年04月17日',
                },
                {
                    id: '004',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '景区新闻',
                    time: '2019年04月17日',
                }, {
                    id: '005',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '景区新闻',
                    time: '2019年04月17日',
                },
                {
                    id: '006',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '景区新闻',
                    time: '2019年04月17日',
                },
                {
                    id: '007',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '嵩山攻略',
                    time: '2019年04月17日',
                }, {
                    id: '008',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '嵩山攻略',
                    time: '2019年04月17日',
                },
                {
                    id: '009',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '景区新闻',
                    time: '2019年04月17日',
                }, {
                    id: '010',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '景区新闻',
                    time: '2019年04月17日',
                },
                {
                    id: '011',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '景区新闻',
                    time: '2019年04月17日',
                }, {
                    id: '012',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '景区新闻',
                    time: '2019年04月17日',
                },
                {
                    id: '013',
                    image: 'https://img.alicdn.com/tfs/TB1END9X8Kw3KVjSZFOXXarDVXa-332-203.png',
                    title: '嵩山景区参加2018中国国际旅游交易会 现场人气火爆！',
                    classify: '景区新闻',
                    time: '2019年04月17日',
                },
            ],
            page: 1,
            addModle: false,
            searchText: [
                '请输入标题'
            ],
            classifyList: [
                {
                    id: '001',
                    value: '嵩山资讯'
                },
                {
                    id: '002',
                    value: '嵩山攻略'
                },
                {
                    id: '003',
                    value: '嵩山行程'
                }
            ],
            isSearch: false,
            editItem:{},//当前编辑行
            addTitle:'创建模块'
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
   * @memberof ModuleSet
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
                title: "类型",
                dataIndex: "classify",
                key: "classify"
            }, {
                title: "标题",
                dataIndex: "title",
                key: "title"
            } ,{
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => {
                    return (
                        <div className={styles.listHandle}>
                            <span className={styles.handleItem} onClick={(e) => _self.edit(record, e)}>编辑</span>
                        </div>
                    );
                }
            }
        ]
    }
    /**
   * todo 翻页
   * @memberof ModuleSet
   */
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            page: pagination.current
        }, () => {

        });
    };


    /**
     * todo 添加
     * @memberof ModuleSet
     */
    add = (item) => {
        this.setState({ addModle: !this.state.addModle,addTitle:'创建模块' ,editItem:{}});

    }


      /**
     * todo 编辑行
     * @memberof ModuleSet
     */
    edit=(item)=>{
this.setState({editItem:item,addModle: !this.state.addModle,imageUrl:item.image,addTitle:'编辑模块'})
    }

    /**
        * todo 删除
        * @memberof ModuleSet
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
   
    selectChange=()=>{

    }
    changeValue=(item,val)=>{
        let editItem=this.state.editItem;
        editItem[val]=item.target.value;
        this.setState({editName:editItem})
    }
    onShowChange = (e) => {
        this.setState({
            show: e.target.value,
        });
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
                    模块设置
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
                            <span className={styles.overlayItemTitle}>类型</span>
                            <Input
                                className={this.state.editItem.type}
                                value={this.state.editItem.type}
                                onChange=
                                { (value) => this.changeValue(value,'type') }
                                name="type"
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>是否显示</span>
                            <RadioGroup onChange={this.onShowChange} value={this.state.show}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </RadioGroup>
                        </div >
                    </div>
                </Modal>
            </div>
        );
    }
}
export default connect()(ModuleSet);
