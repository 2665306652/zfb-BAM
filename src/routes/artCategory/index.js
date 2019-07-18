import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import Api from '../../utils/api';
// import UploadImage from '../../components/UploadImage';

// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';

import {
    Button,
    Table,
    Modal,
    Input,
    Popconfirm,
    TreeSelect
} from "antd";

import { Upload, Icon } from 'antd';
import Url from '../../utils/url';
const TreeNode = TreeSelect.TreeNode;


function mapStateToProps(state) {
    return {
        data: state.artCategory.data,
        classifyData: state.artCategory.classifyData,
    };

}

class Buyer extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,

            page: 1,
            addTitle: '添加分类',
            addModle: false,
            editTitle: '',
            editParentDisabled: false,
            editParent: '根',
            editParentId: 0,
            editIndex: '1',
            editPic: '',
            id: '',
            introduction: '',

            // 增加编辑器的内容 创建一个空的editorState作为初始值
            editorState: BraftEditor.createEditorState(null)
        }
    }

    /**
     * todo 添加分类(关闭弹层，数据清空)
     * @param {*} id 
     * @param {*} e 
     */
    add(id, e) {
        const { addModle } = this.state;
        this.setState({
            addTitle: '添加分类',
            addModle: !addModle,
            editTitle: '',
            editParentDisabled: false,
            editParent: '根',
            editParentId: 0,
            editIndex: '1',
            editPic: '',
            id: '',
            introduction: '',
            editorState: BraftEditor.createEditorState(null)
        });
    }


    /**
     * todo 编辑
     * @param {*} e 
     * @param {*} record 
     */
    edit(e, record) {
        const { addModle } = this.state;
        this.setState({
            addModle: !addModle,
            editTitle: record.title,
            editParentDisabled: false,
            editParent: record.ftitle ? record.ftitle : '根',
            editParentId: record.fid ? record.fid : '0',
            editIndex: record.priority ? record.priority : '1',
            editPic: record.img,
            id: record.id,
            introduction: record.introduction,
            editorState: BraftEditor.createEditorState(record.content)
        });

    }
    handleOk = () => {
        // 修改编辑
        let handeOkid = this.state.id;
        let self = this;
        if (!this.state.editTitle) {
            Api._toast({ title: '标题不能为空' })
        } else if (!this.state.editParent) {
            Api._toast({ title: '请选择分类' })
        } else if (!this.state.introduction) {
            Api._toast({ title: '内容标题不能为空' })
        } else if (!this.state.editIndex) {
            Api._toast({ title: '请填写排序' })
        } else if (!this.state.editorState.toText()) {
            Api._toast({ title: '内容不能为空' })
        } else if (handeOkid) {
            this
                .props
                .dispatch({
                    type: 'artCategory/savearticlecategory', payload: {
                        title: this.state.editTitle,
                        ftitle: this.state.editParent,
                        fid: this.state.editParentId,
                        id: this.state.id,
                        img: this.state.editPic,
                        content: this.state.editorState.toHTML(),
                        priority: this.state.editIndex,
                        introduction: this.state.introduction,
                    },

                    callback: () => {
                        Api._toast({
                            title: '修改成功',
                        });
                        self.callbackFn()
                    }
                })
        } else {
            // 新增
            this
                .props
                .dispatch({
                    type: 'artCategory/savearticlecategory', payload: {
                        title: this.state.editTitle,
                        ftitle: this.state.editParent,
                        fid: this.state.editParentId,
                        img: this.state.editPic,
                        introduction: this.state.introduction,
                        content: this.state.editorState.toHTML(),
                        priority: this.state.editIndex
                    },
                    callback: () => {
                        Api._toast({
                            title: '添加成功',
                        });
                        self.callbackFn()
                    }
                })
        }

    }
    callbackFn = () => {
        const { addModle } = this.state;
        this.setState({
            addModle: !addModle
        })
        this.updata()
        this.classifyData()
    }
    /**
     * todo 添加子类(不需要了)
     * @param {*} e
     * @param {*} record
     */
    addChildren(e, record) {
        const { addModle } = this.state;
        this.setState({
            addModle: !addModle,
            editParentDisabled: true,
            editParent: record.title,
            editParentId: record.id,
            editorState: BraftEditor.createEditorState(record.content)
        });

    }

    /**
     * todo 删除
     * @param {*} e
     * @param {*} record
     */
    del(e, record) {
        let self = this
        this
            .props
            .dispatch({
                type: 'artCategory/del', payload: { id: e.id },
                callback: self.newRequest
            })

    }
    newRequest = () => {
        this.updata()
        this.classifyData()
    }

    /**
     * todo input框改变值
     * @param {*} e 
     * @param {*} configInput 
     */
    editInputChange(e, configInput) {
        if (configInput) {
            this.setState({
                [configInput]: e.target.value
            })
        }
    }

    /**
     * todo 选择父级
     */
    handleTreeSelect(value, label, extra) {
        this.setState({
            editParent: label[0],
            editParentId: extra.triggerNode.props.id
        });
    }
    /**
   * todo  初始化加载数据
   * @memberof index
   */
    componentDidMount() {
        this.updata();
        this.classifyData()
    }

    /**
     * todo 获取数据接口
     * @memberof index
     */
    updata = () => {
        this
            .props
            .dispatch({ type: 'artCategory/artCategory', payload: {} })
    }

    /**
    * todo 获取父级分类数据接口
    * @memberof index
    */
    classifyData = () => {
        this
            .props
            .dispatch({ type: 'artCategory/classifyData', payload: {} })
    }

    /**
     * 富文本编辑的方法
     *  */
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        // const htmlContent = this.state.editorState.toHTML()
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    /**
     * todo 自定义table
     */
    customColumns() {
        const _self = this;
        return [
            {
                title: "标题",
                dataIndex: "title",
                key: "title"
            },
            {
                title: "所属分类",
                dataIndex: "ftitle",
                key: "ftitle",
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (action, record) => {
                    return (
                        <div className={styles.listHandle}>
                            <span className={styles.handleItem} onClick={(e) => this.edit(e, record)}>编辑</span>
                            {/* <span className={styles.handleItem} onClick={(e) => this.addChildren(e, record)}>增加子类</span> */}
                            <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => _self.del(record, e)}>
                                <span className={styles.handleItemDel}>删除</span>
                            </Popconfirm>
                        </div>
                    );
                }
            }
        ]
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
                let imgurl = info.file.response.data
                this.setState({
                    editPic: imgurl,
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
                    editorState: ContentUtils.insertMedias(this.state.editorState, [{
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

    /*
       下拉
     * */

    setPermission(nodeList) {
        const children = [];
        // children.push( <TreeNode title={this.state.editParent} id={this.state.editParentId} key='3526352' value='0-0-0'>
           
        // </TreeNode>)
        nodeList.map((item, index) => {
            let valueData = `1-${index}`
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

    changeValueInput = (e, configInput) => {
        if (configInput) {
            this.setState({
                // replace(/[^1-9]/g,'')
                [configInput]: e.target.value.replace(/[^(0+)|[^1-9]/g,'')
            })
        }
    }
    render() {
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
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.editPic;
        const { data, classifyData } = this.props;
        let ifdata=0
        classifyData.map((item)=>{
            if(!item.id*1===0){
                ifdata++
            }
            return true
        })
        if(ifdata===classifyData.length){
            classifyData.unshift({id: this.state.editParentId, title:this.state.editParent})
        }
        const {
            page,
            addTitle,
            addModle,
            editTitle,
            editParent,
            editParentDisabled,
            editIndex,
            editorState,
            introduction
        } = this.state;
        const locale = {
            emptyText: "暂无数据显示！"
        };
        const tableOption = {
            columns: this.customColumns(),
            // dataSource: pdata.list,
            dataSource: data,
            onChange: this.handleTableChange,
            pagination: {
                current: page,
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
                    文章分类
                </h2>
                <div className={styles.search}>
                    <Button
                        size="large"
                        type="primary"
                        onClick=
                        {(e) => this.add(null, e)}>
                        添加分类
                    </Button>
                </div >
                <div className={styles.list}>
                    {data
                        ? (<Table
                            loading={isLoading}
                            locale={locale}
                            rowKey={record => record.id}
                            dataSource={data}
                            {...tableOption}
                            childrenColumnName='childlist'
                            pagination={false} />)
                        : ("暂时没有数据")}
                </div>
                <Modal
                    title={addTitle}
                    visible={addModle}
                    onCancel={this.add.bind(this)}
                    onOk={this.handleOk.bind(this)}
                    width={990}
                >
                    <div className={styles.overlay}>
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>标题</span>
                            <Input
                                value={editTitle}
                                name="title"
                                onChange=
                                {(value) => this.editInputChange(value, 'editTitle')} />
                        </div>
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>父级</span>
                            <TreeSelect
                                style={{ width: '100%' }}
                                value={editParent}
                                disabled={editParentDisabled}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择父级"
                                treeDefaultExpandAll
                                onChange={(value, label, extra) => this.handleTreeSelect(value, label, extra)}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                                
                                {this.setPermission(classifyData)}
                            </TreeSelect>
                        </div>
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>排序</span>
                            <Input
                                value={editIndex}
                                name="title"
                                type="text"
                                maxLength={5}
                                onChange=
                                {(value) => this.changeValueInput(value, 'editIndex')} />
                        </div>
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>内容标题</span>
                            <Input
                                value={introduction}
                                name="title"
                                onChange=
                                {(value) => this.editInputChange(value, 'introduction')} />
                        </div>
                        <div style={{
                            textAlign: 'center',
                            lineHeight: '40px',
                            color: '#ccc',
                            fontWeight: 'bold',
                        }}>提示：上传图片宽度小于400最佳</div>
                        <div className={styles.editTextItem}>
                            <span className={styles.overlayItemTitle}>内容</span>
                            <BraftEditor className={styles.editText}
                                value={editorState}
                                onChange={this.handleEditorChange}
                                onSave={this.submitContent}
                                controls={controls}
                                extendControls={extendControls}
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
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={Url.uploadImage}
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleChange}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '128px', height: '128px' }} /> : uploadButton}
                        </Upload>
                        </div>
                        {/* <UploadImage /> */}
                    
                        
                        
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Buyer);