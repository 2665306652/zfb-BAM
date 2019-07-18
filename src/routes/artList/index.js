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
    // Select,
    Upload,
    Icon,
    // message,
    TreeSelect
} from "antd";
import Url from '../../utils/url';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { ContentUtils } from 'braft-utils';
import LinkData from '../../utils/linkData';
import Api from '../../utils/api';
const TreeNode = TreeSelect.TreeNode;
// const Option = Select.Option;
const { TextArea } = Input;
// const RadioGroup = Radio.Group;
const Search = Input.Search;
// const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;

function mapStateToProps(state) {
    return {
        data: state.artList.data,
        classifyData: state.artList.classifyData,
        detailsData: state.artList.detailsData
    };
}
class AdList extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            editParentDisabled: false,
            addModle: false,
            searchText: [
                '请输入标题'
            ],

            isSearch: false,
            editItem: {},//当前编辑行
            addTitle: '创建文章',

            id: '',
            title: '',
            viewcount: '',
            videourl: '',
            introduction: '',
            articlecategoryid: '',
            topimg: '',
            content: BraftEditor.createEditorState(null),
            priority: '',
            gmtcreate: '',
            articlecategorytitle: '',
            searchValue: '',
        }
    }
    componentDidMount() {
        this.classifyData()
        this.updateList()
    }
    updateList = (page, searchValue) => {
        this
            .props
            .dispatch({ type: 'artList/getarticlelist', payload: { page: page ? page : this.state.page, title: searchValue ? searchValue : this.state
            .searchValue } })
    }
    classifyData = () => {
        this
            .props
            .dispatch({ type: 'artList/classifyData', payload: {} })
    }
    searchChange = (e) => {
        // console.log(e.target.value,"变化的搜索值searchChange")
        let _self = this;
        _self.setState({
            searchValue:e.target.value
        })
        if (!e.target.value) {
            this.setState({
                isSearch: false,
            }, () => {
                _self.updateList()
            })
        }
    }
    /**
        * todo 复制链接
        * @memberof HotelList
        */
    link = (item) => {
        Api._copy(`${LinkData.artlist}?id=${item.id}`);
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
    * 富文本编辑的方法
    *  */
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        // const htmlContent = this.state.content.toHTML()
    }

    handleEditorChange = (content) => {
        this.setState({ content })
    }
    /**
   * todo 自定义table
   */
    customColumns() {
        let _self = this;
        return [
            {
                title: "图片",
                dataIndex: "topimg",
                key: "topimg",
                render: (text, record) => {
                    return (
                        <div style={{ height: "65px" }}>
                            <img src={text} alt="" className={styles.thumbnai} />
                        </div>

                    )
                }
            }, {
                title: "标题",
                dataIndex: "title",
                key: "title"
            }, {
                title: "类型",
                dataIndex: "articlecategorytitle",
                key: "articlecategorytitle"
            }, {
                title: "文章时间",
                dataIndex: "gmtcreate",
                key: "gmtcreate"
            }, {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => {
                    return (
                        <div className={styles.listHandle}>
                            <span className={styles.handleItem} onClick={(e) => _self.link(record, e)}>链接</span>
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
    add = (item, e) => {
        this.setState({
            addModle: !this.state.addModle,
            addTitle: '创建文章',
            editItem: {},

            id: '',
            title: '',
            viewcount: '',
            videourl: '',
            introduction: '',
            articlecategoryid: '',
            topimg: '',
            content: BraftEditor.createEditorState(null),
            priority: '',
            gmtcreate: '',
            articlecategorytitle: ''
        });
    }
    handleOk = () => {
        // 修改编辑
        let handeOkid = this.state.id;
        let self = this;

        if (!this.state.title) {
            Api._toast({ title: '标题不能为空' })
        } else if (!this.state.videourl) {
            Api._toast({ title: '视频地址不能为空' })
        } else if (!this.state.introduction) {
            Api._toast({ title: '文章简介不能为空' })
        } else if (!this.state.articlecategoryid) {
            Api._toast({ title: '请选择分类' })
        } else if (!this.state.content.toText()) {
            Api._toast({ title: '内容不能为空' })
        } else if (handeOkid) {
            self
                .props
                .dispatch({
                    type: 'artList/savearticle', payload: {

                        title: this.state.title,
                        videourl: this.state.videourl,
                        introduction: this.state.introduction,
                        articlecategoryid: this.state.articlecategoryid,
                        topimg: this.state.topimg,
                        content: this.state.content.toHTML(),
                        priority: this.state.priority,
                        id: this.state.id,
                    },
                    callback: function () {
                        Api._toast({ title: '修改成功' })
                        self.callback()
                    }
                })
        } else {
            // 新增
            self
                .props
                .dispatch({
                    type: 'artList/savearticle', payload: {
                        title: this.state.title,
                        videourl: this.state.videourl,
                        introduction: this.state.introduction,
                        articlecategoryid: this.state.articlecategoryid,
                        topimg: this.state.topimg,
                        content: this.state.content.toHTML(),
                        priority: this.state.priority,
                    },
                    callback: function () {
                        Api._toast({ title: '添加成功' })
                        self.callback()
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

    // 详情数据请求
    getbyidarticleinfo = (id) => {
        this
            .props
            .dispatch({
                type: 'artList/getbyidarticleinfo', payload: { id: id },
                callback: (res) => {
                    this.setState({
                        id: res.id,
                        title: res.title,
                        viewcount: res.viewcount,
                        videourl: res.videourl,
                        introduction: res.introduction,
                        articlecategoryid: res.articlecategoryid,
                        topimg: res.topimg,
                        content: BraftEditor.createEditorState(res.content),
                        priority: res.priority,
                        gmtcreate: res.gmtcreate,
                        articlecategorytitle: res.articlecategorytitle
                    })
                }
            })
    }
    /**
   * todo 编辑行
   * @memberof AdList
   */

    edit = (item, e) => {
        this.setState({ addModle: !this.state.addModle, addTitle: '编辑文章', id: item.id })
        this.getbyidarticleinfo(item.id)

    }

    /**
        * todo 删除
        * @memberof AdList
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
                        type: 'artList/delarticle', payload: { id: record.id },
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
                    topimg: info.file.response.data,
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
    handleChangefu = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            if(info.file.response.code==='00000'){
                this.setState({
                    content: ContentUtils.insertMedias(this.state.content, [{
                        type: 'IMAGE',
                        url: info.file.response.data
                    }]),
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
    //下拉
    handleTreeSelect(value, label, extra) {
        this.setState({
            articlecategorytitle: label[0],
            articlecategoryid: extra.triggerNode.props.id
        });
    }
    changeValue = (e, configInput) => {
        if (configInput) {
            this.setState({
                [configInput]: e.target.value
            })
        }
    }

    changeValueInput = (e, configInput) => {
        if (configInput) {
            this.setState({
                // replace(/[^1-9]/g,'')
                [configInput]: e.target.value.replace(/[^(0+)|[^1-9]/g,'')
            })
        }
    }

    /*
    下拉
  * */
    setPermission(nodeList) {
        const children = [];

        nodeList.map((item, index) => {
            let valueData = `0-${index}`
            children.push(
                <TreeNode title={item.title} id={item.id} key={item.id} value={valueData}>
                    {this.children1(item.childlist, valueData)}
                </TreeNode>
            )
            return true
        })
        return children;

    }
    children1(item, valueData) {
        const children1 = [];

        if (item) {
            item.map((ele, j) => {
                let valueData1 = `${valueData}-${j}`
                children1.push(
                    <TreeNode title={ele.title} id={ele.id} key={ele.id} value={valueData1}>
                        {this.children2(ele.childlist, valueData1)}
                    </TreeNode>
                )
                return true
            })
        }

        return children1;
    }
    children2(child, valueData1) {
        const children2 = [];

        if (child) {
            child.map((ele2, i) => {
                let valueData2 = `${valueData1}-${i}`
                children2.push(
                    <TreeNode title={ele2.title} id={ele2.id} key={ele2.id} value={valueData2}>

                    </TreeNode>
                )
                return true
            })
        }

        return children2;
    }

    render() {
        const { data, classifyData } = this.props;

        const extendControls = [
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        name="imageFile"
                        action={Url.uploadImage}
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChangefu}>
                        <button type="button" className="control-item button upload-button" data-title="插入图片">
                            <Icon type="picture" theme="filled" />
                        </button>
                    </Upload>
                )
            }
        ]
        const controls = ['undo', 'redo', 'separator',
            'font-size', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
            'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
            'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
            'link', 'separator', 'hr', 'separator',
            'clear', 'separator']
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
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    文章列表
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
                    <Table
                        loading={isLoading}
                        locale={locale}
                        rowKey=
                        {record => record.id}
                        dataSource={data.list}
                        {...tableOption} />

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
                                // className={this.state.editItem.title}
                                value={this.state.title}
                                onChange=
                                {(value) => this.changeValue(value, 'title')}
                                name="title"
                                type="text"
                                maxLength={50}
                            />
                        </div >

                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>视频路径</span>
                            <Input
                                // className={this.state.editPhoneStatus
                                // }
                                value={this.state.videourl}
                                onChange=
                                {(value) => this.changeValue(value, 'videourl')}
                                name="videourl"
                            />
                        </div >
                        <div className={styles.overlayArea}>
                            <span className={styles.overlayItemTitle}>简介</span>
                            <TextArea rows={4} value={this.state.introduction} onChange=
                                {(value) => this.changeValue(value, 'introduction')} />
                        </div >

                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>文章分类</span>

                            <TreeSelect
                                style={{ width: '100%' }}
                                value={this.state.articlecategorytitle}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择父级"
                                treeNodeFilterProp="title"
                                onChange={(value, label, extra) => this.handleTreeSelect(value, label, extra)}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                                {this.setPermission(classifyData)}

                            </TreeSelect>
                        </div >
                        <div style={{
                            textAlign: 'center',
                            lineHeight: '40px',
                            color: '#ccc',
                            fontWeight: 'bold',
                        }}>提示：上传图片宽度小于400最佳</div>
                        <div className={styles.editTextItem}>
                            <span className={styles.overlayItemTitle}>内容</span>
                            <BraftEditor className={styles.editText}
                                value={this.state.content}
                                onChange={this.handleEditorChange}
                                onSave={this.submitContent}
                                controls={controls}
                                extendControls={extendControls}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>排序</span>
                            <Input
                                // className={this.state.rank}
                                value={this.state.priority}
                                onChange=
                                {(value) => this.changeValueInput(value, 'priority')}
                                type="text"
                                maxLength={6}
                            />
                        </div >
                        <div style={{
                            textAlign: 'center',
                            lineHeight: '40px',
                            color: '#ccc',
                            fontWeight: 'bold',
                        }}>提示：上传图片宽度小于400最佳</div>
                        <div className={styles.overlayUpload}>
                            <span className={styles.overlayItemTitle}>缩略图</span>
                            <Upload
                                name="imageFile"
                                action={Url.uploadImage}
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                            >
                                {this.state.topimg ? <img src={this.state.topimg} alt="avatar" className={styles.uploadImage} /> : uploadButton}
                            </Upload>
                        </div >
                    </div>
                </Modal>
            </div>
        );
    }
}
export default connect(mapStateToProps)(AdList);
