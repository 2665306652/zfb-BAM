import React, { Component } from 'react';
import { connect } from 'dva';
import 'braft-editor/dist/index.css';
import styles from './index.less';
import Api from '../../utils/api';
import Url from '../../utils/url';
// import UploadImage from '../../components/UploadImage';
import {
    Button,
    Table,
    Modal,
    Input,
    Radio,
    Popconfirm,
    TreeSelect,
    Upload,
    Icon,
    // message,
} from "antd";

const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;


class Buyer extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            addTitle: '添加分类',
            addModle: false,
            editTitle: '',
            editParentDisabled: false,
            editParent: '根',
            editParentId: 0,
            editIndex: '1',
            editPic: '',
            isshow: '',
            id: '',
        }
    }

    componentDidMount() {
        this.updateList();
        this.classifyData()
    }
    // 获取列表数据
    updateList = (value) => {
        this
            .props
            .dispatch({ type: 'tickCategory/updateList', payload: {} })
    }
    // 获取列表分类数据
    classifyData = () => {
        this
            .props
            .dispatch({ type: 'tickCategory/classifyData', payload: {} })
    }
    /**
    * todo 删除
    * @memberof Ticketlist
    */
    del = (e, record) => {
        let self = this
        this
            .props
            .dispatch({
                type: 'tickCategory/del', payload: { id: e.id },
                callback: self.newRequest
            })
    }
    // 删除后重新加载数据
    newRequest = () => {
        this.updateList()
        this.classifyData()
    }


    /**
     * todo 添加分类
     * @param {*} id 
     * @param {*} e 
     */
    add(id, e) {
        const { addModle } = this.state;
        this.setState({
            addModle: !addModle,
            editTitle: '',
            editParentDisabled: false,
            editParent: '根',
            editParentId: 0,
            editIndex: '1',
            editPic: '',
            id: '',
        });
    }

    /**
     * todo 编辑
     * @param {*} e 
     * @param {*} record 
     */

    edit(e, record) {
        console.log(e);
        console.log(record)
        const { addModle } = this.state;
        // console.log(record, '111')
        this.setState({
            addModle: !addModle,
            editTitle: record.title,
            editParentDisabled: false,
            editParent: record.ftitle ? record.ftitle : '根',
            editParentId: record.editParentId ? record.editParentId : 0,
            editIndex: record.priority,
            editPic: record.img,
            id: record.id,
        });
    }
    handleOk = () => {
        // 修改编辑
        let handeOkid = this.state.id;
        let self = this;
        if (!this.state.editTitle) {
            Api._toast({ title: '标题不能为空' })
        } else if (handeOkid) {
            this
                .props
                .dispatch({
                    type: 'tickCategory/handleOk', payload: {
                        title: this.state.editTitle,
                        ftitle: this.state.editParent,
                        fid: this.state.editParentId,
                        id: this.state.id,
                        img: this.state.editPic,
                        priority: this.state.editIndex,
                        isshow: this.state.isshow,
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
                    type: 'tickCategory/handleOk', payload: {
                        title: this.state.editTitle,
                        ftitle: this.state.editParent,
                        fid: this.state.editParentId,
                        img: this.state.editPic,
                        priority: this.state.editIndex,
                        isshow: this.state.isshow,
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
        this.updateList()
        this.classifyData()
    }
    /**
     * todo 添加子类
     * @param {*} e
     * @param {*} record
     */
    addChildren(e, record) {
        const { addModle } = this.state;
        this.setState({
            addModle: !addModle,
            editParentDisabled: true,
            editParent: record.title,
            editParentId: record.id
        });
    }

    /**
     * todo input框改变值
     * @param {*} e 
     * @param {*} configInput 
     */
    editInputChange(e, configInput) {
        console.log(configInput);
        console.log(e.target.value)
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
   * todo  上传图片
   * @memberof Ticketlist
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
            if (info.file.response.code === '00000') {
                this.setState({
                    editPic: info.file.response.data,
                    loading: false,
                })
                Api._toast({ title: '上传图片成功' })
            } else {
                Api._toast({
                    type: 'error',
                    title: info.file.response.message,
                    text: info.file.response.message
                })
            }
        }

    };

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
                title: "图片",
                dataIndex: "img",
                key: "img",
                render: (text, record) => {
                    return (
                        <div style={{ height: "65px" }}>
                            <img src={text} alt="" className={styles.thumbnai} />
                        </div>

                    )
                }
            },
            {
                title: "状态",
                dataIndex: "isshow",
                key: "isshow",
                render: (status, record) => {
                    if (status * 1 === 1) {
                        return (
                            <div>是</div>
                        );
                    } else {
                        return (
                            <div>否</div>
                        );
                    }
                }
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (action, record) => {
                    return (
                        <div className={styles.listHandle}>
                            <span className={styles.handleItem} onClick={(e) => this.edit(e, record)}>编辑</span>
                            <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => _self.del(record, e)}>
                                <span className={styles.handleItemDel}>删除</span>
                            </Popconfirm>
                        </div>
                    );
                }
            }
        ]
    }

    /*
    下拉
  * */
    setPermission = (nodeList) => {
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
    children1 = (item, valueData) => {
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
    children2 = (child, valueData1) => {
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
                [configInput]: e.target.value.replace(/[^(0+)|[^1-9]/g, '')
            })
        }
    }

    render() {
        const { classifyData } = this.props;
        let ifdata = 0
        classifyData.map((item) => {
            if (!item.id * 1 === 0) {
                ifdata++
            }
            return true
        })
        if (ifdata === classifyData.length) {
            classifyData.unshift({ id: this.state.editParentId, title: this.state.editParent, key: this.state.editParentId })
        }
        const dataList = Array.from(this.props.dataList)
        const {
            page,
            addTitle,
            addModle,
            editTitle,
            editParent,
            // editParentId,
            editParentDisabled,
            editIndex,
            // editPic,
        } = this.state;
        const locale = {
            emptyText: "暂无数据显示！"
        };
        const tableOption = {
            columns: this.customColumns(),
            dataSource: dataList,
            onChange: this.handleTableChange,
            pagination: {
                current: page,
                style: {
                    marginRight: '20px'
                }
            }
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        // const isLoading = this.props.loading.effects['actions/accontQuery'];
        const isLoading = false;
        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    票务分类
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
                    {dataList
                        ? (<Table
                            loading={isLoading}
                            locale={locale}
                            rowKey={record => record.id}
                            dataSource={dataList}
                            {...tableOption}
                            childrenColumnName='childlist'
                            pagination={false} />)
                        : ("暂时没有数据")}
                </div>
                <Modal
                    title={addTitle}
                    visible={addModle}
                    onCancel={this.add.bind(this)}
                    onOk={this.handleOk}
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
                                {this.state.editPic ? <img src={this.state.editPic} alt="avatar" className={styles.uploadImage} style={{ width: '92px', height: '92px' }} /> : uploadButton}
                            </Upload>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>是否显示</span>
                            <RadioGroup
                                className={styles.searchRadio}
                                name="role"
                                // onChange={e => this.onChangeRadio(e)}
                                onChange=
                                {(value) => this.editInputChange(value, 'isshow')}
                                value={this.state.isshow}>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        dataList: state.tickCategory.dataList,
        classifyData: state.tickCategory.classifyData,
    };
}
export default connect(mapStateToProps)(Buyer);