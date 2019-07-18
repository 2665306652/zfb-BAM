import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Input,
    Button,
    Table,
    Modal,
    Radio,
    Upload,
    Icon,
    // message,
    Select
} from "antd";


import Api from '../../utils/api';
import Url from '../../utils/url';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const confirm = Modal.confirm;


class AdList extends Component {
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
            addTitle: '创建广告',

            searchValue: '',
            title: '',
            type: '',
            url: '',
            img: '',
            isshow: 1,
            id: '',
        }
    }
    componentDidMount() {
        this.updateList()
    }
    updateList = (page, searchValue) => {
        this
            .props
            .dispatch({ type: 'adlList/updateList', payload: { page: page ? page : this.state.page, title: searchValue ? searchValue : this.state.searchValue } })
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
   * @memberof AdList
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
                title: "图片",
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
                title: "标题",
                dataIndex: "title",
                key: "title",
            }, {
                title: "类型",
                dataIndex: "type",
                key: "type",
                render: (text, record) => {
                    let typeRender;
                    if (text === 1) {
                        typeRender = (
                            <span>bannner</span>
                        )
                    } else if (text === 2) {
                        typeRender = (
                            <span>呼我用车</span>
                        )
                    } else {
                        typeRender = (
                            <span>其他</span>
                        )
                    }
                    return typeRender
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
   * @memberof AdList
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
     * @memberof AdList
     */
    add = (item) => {
        this.setState({
            addModle: !this.state.addModle,
            addTitle: '创建广告',
            title: '',
            type: '',
            url: '',
            img: '',
            isshow: 1,
            id: '',
        });
    }


    /**
   * todo 编辑行
   * @memberof AdList
   */
    edit = (item) => {
        let newType;
        if (item.type === 1) {
            newType = 'banner'
        } else if (item.type === 2) {
            newType = '呼我用车'
        } else if (item.type === 3) {
            newType = '其他'
        }
        this.setState({
            addModle: !this.state.addModle,
            addTitle: '编辑广告',
            title: item.title,
            type: newType,
            // type:item.type,
            url: item.url,
            img: item.img,
            isshow: item.isshow,
            id: item.id,
        })
    }

    /**
        * todo 删除
        * @memberof AdList
        */
    del = (e, record) => {
        let _self = this;
        confirm({
            title: '确认删除',
            content: `确认删除吗?`,
            onOk() {
                _self
                    .props
                    .dispatch({
                        type: 'adlList/del', payload: { id: e.id },
                        callback: _self.newRequest
                    })

            },
            onCancel() {

            }
        });
    }
    // 删除后重新加载数据
    newRequest = () => {
        Api._toast({ title: '删除成功' })
        this.updateList()
    }
    handleOk=()=> {
        let handeOkid = this.state.id
        let _self = this
        console.log(this.state.url)
        // 保存数据
        if (!this.state.title) {
            Api._toast({ title: '标题不能为空' })
        } else if (!this.state.type) {
            Api._toast({ title: '类型不能为空' })
        } else if (!this.state.img) {
            Api._toast({ title: '请上传图片' })
        } else if (handeOkid) {
            _self
                .props
                .dispatch({
                    
                    type: 'adlList/handleOk', payload: {
                        title: this.state.title,
                        img: this.state.img,
                        type:this.state.type,
                        url:this.state.url,
                        id:this.state.id,
                        isshow:this.state.isshow,
                    },
                    callback: function () {
                        Api._toast({ title: '修改成功' })
                        _self.callback()
                    }
                })
        } else {
            // 新增
            _self
                .props
                .dispatch({
                    type: 'adlList/handleOk', payload: {
                        title: this.state.title,
                        img: this.state.img,
                        type:this.state.type,
                        url:this.state.url,
                        isshow:this.state.isshow,
                    },
                    callback: function () {
                        Api._toast({ title: '添加成功' })
                        _self.callback()
                    }
                })
        }
    }
    callback = () => {
        const { addModle } = this.state;
        this.setState({
            addModle: !addModle
        })
        this.updateList()
    }
    /**
        * todo 复制链接
        * @memberof AdList
        */
    /**
           * todo  上传图片
           * @memberof AdList
           */
          beforeUpload = file => {
            const imgArr = ['image/png', 'image/jpg', 'image/jpeg'];
            if (imgArr.includes(file.type)) {
              return true
            };
            Api._toast({
              type: 'error',
              title: '格式错误',
              text: '只能上传格式为png、jpg、jpeg的图片'
            })
            return false;
          }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            if(info.file.response.code==='00000'){
                this.setState({
                    img: info.file.response.data,
                loading: false,
                })
                Api._toast({ title: '上传图片成功' })
            }else {
                Api._toast({
                    type: 'error',
                    title:info.file.response.message,
                    text: info.file.response.message
                })
            }
        }
    };

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
    editInputChange(e, configInput) {
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
        // console.log(this.props.loading)
        const isLoading = false;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    广告列表
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
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>标题</span>
                            <Input
                                className={this.state.editItem.title}
                                value={this.state.title}
                                onChange=
                                {(value) => this.changeValue(value, 'title')}
                                name="title"
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>类型</span>
                            {/* <Input
                                className={this.state.editPhoneStatus}
                                value={this.state.type}
                                onChange=
                                {(value) => this.changeValue(value, 'type')}
                                name="type"
                            /> */}
                            <Select className={styles.dropdownItem} getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue="等级" value={this.state.type}  onChange={(value) => this.selectChange(value, 'type')}>
                                <Option key={1}>bannner</Option>
                                <Option key={2}>呼我用车</Option>
                                <Option key={3}>其他</Option>
                            </Select>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>链接</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.url}
                                onChange=
                                {(value) => this.changeValue(value, 'url')}
                                name=""
                            />
                        </div >
                        <div style={{
                            textAlign: 'center',
                            lineHeight: '40px',
                            color: '#ccc',
                            fontWeight: 'bold',
                        }}>提示：上传 345*60 的图片</div>
                        <div className={styles.overlayUpload}>
                            <span className={styles.overlayItemTitle}>图片</span>
                            <Upload
                                name="imageFile"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={Url.uploadImage}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                            >
                                {this.state.img ? <img src={this.state.img} alt="avatar" className={styles.uploadImage} style={{ width: '92px', height: '92px' }} /> : uploadButton}
                            </Upload>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>是否显示</span>
                            <RadioGroup onChange={(value) => this.editInputChange(value, 'isshow')} value={this.state.isshow}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </RadioGroup>
                        </div >
                    </div>
                </Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        data: state.adlList.data,
    };
}
export default connect(mapStateToProps)(AdList);
