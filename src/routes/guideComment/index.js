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


class GuideComment extends Component {
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
            show: 1,//是否显示
            searchValue:''
        }
    }
    componentDidMount() {
        this.updateList()
    }
    updateList = (page, searchValue) => {
        this
            .props
            .dispatch({ type: 'guidecomment/updateList', payload: { page: page ? page : this.state.page, content: searchValue ? searchValue : this.state.searchValue } })
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
   * @memberof GuideComment
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
del = (record,e) => {
    let _self = this;
    confirm({
        title: '确认删除',
        content: `确认删除吗?`,
        onOk() {
            _self
                .props
                .dispatch({
                    type: 'guidecomment/del', payload: { id: record.id },
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

    /**
   * todo 自定义table
   */
    customColumns() {
        let _self = this;
        return [
           {
                title: "对应名称",
                dataIndex: "name",
                key: "name"
            }, {
                title: "评分",
                dataIndex: "score",
                key: "score"
            }, {
                title: "评论内容",
                dataIndex: "content",
                key: "content"
            }, {
                title: "评论时间",
                dataIndex: "gmtcreate",
                key: "gmtcreate",
            },{
                title: "类型",
                dataIndex: "type",
                key: "type",
                render: (text, record) => {
                    return (
                        <span className={styles.handleItem} >{text*1===1?'导游':'票务'}</span>
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
                        </div>
                    );
                }
            }
        ]
    }
    /**
   * todo 翻页
   * @memberof GuideComment
   */
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            page: pagination.current
        }, () => {
            this.updateList()
        });
    };

    
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
        // console.log(this.props.loading)
        const isLoading = false;
        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    导游评论
                </h2>
                <div className={styles.search}>
                    <div className={styles.searchList}>
                        <Search
                            placeholder='请输入品论内容'
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
               </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        data: state.guidecomment.data
    };
}
export default connect(mapStateToProps)(GuideComment);
