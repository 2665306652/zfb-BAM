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
    Upload,
    Icon,
    // message
} from "antd";

// 引入编辑器组件
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { ContentUtils } from 'braft-utils';
import Url from '../../utils/url';
import Api from '../../utils/api';
import LinkData from '../../utils/linkData';
const Option = Select.Option;
// const { TextArea } = Input;
// const RadioGroup = Radio.Group;
const Search = Input.Search;
// const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;


class ShopList extends Component {
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
            fileList: [],
            addTitle:'创建购物',

             // 增加参数
             searchValue: '',
             titlr: '',
             img: '',
             phone: '',
             content: BraftEditor.createEditorState(null),
             label: '',
             type: '',
             address: '',
             priority: '',
             longitude: '',
             latitude: '',
             id: '',
        }
    }
    componentDidMount() {
        this.updateList()
    }
    updateList = (page, searchValue) => {
        this
            .props
            .dispatch({ type: 'shopList/updateList', payload: { page: page ? page : this.state.page, title: searchValue ? searchValue : this.state.searchValue } })
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
   * @memberof ShopList
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
                title: "缩略图",
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
                key: "title"
            }, {
                title: "电话",
                dataIndex: "phone",
                key: "phone"
            }, {
                title: "地址",
                dataIndex: "address",
                key: "address"
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
   * @memberof ShopList
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
     * @memberof ShopList
     */
    add = (item) => {
        this.setState({
            addModle: !this.state.addModle,
            fileList: [],//多文件上传的图片
            addTitle: '创建购物',

            title: '',
            img: '',
            phone: '',
            content: BraftEditor.createEditorState(null),
            label: '',
            type: '',
            address: '',
            priority: '',
            longitude: '',
            latitude: '',
            id: '',
        });
    }


    /**
   * todo 编辑行
   * @memberof ShopList
   */
    edit = (item) => {
        // let fileList=[];
        // fileList.push(
        //     {
        //         uid: '-1',
        //         name: 'xxx.png',
        //         status: 'done',
        //         url: item.image
        //     }
        // )
        this.setState({addModle: !this.state.addModle,addTitle:'编辑购物',id: item.id })
        this.getbyidhotelinfo(item.id)
    }
    // 详情数据请求
    getbyidhotelinfo = (id) => {
        this
            .props
            .dispatch({
                type: 'shopList/getbyidhotelinfo', payload: { id: id },
                callback: (res) => {
                    let newtype = ''
                    if (res.type * 1 === 1) {
                        newtype = '超市&便利店'
                    } else if (res.type * 1 === 2) {
                        newtype = '服饰鞋包'
                    } else if (res.type * 1 === 3) {
                        newtype = '综合商场'
                    } else if (res.type * 1 === 4) {
                        newtype = '花店'
                    } else if (res.type * 1 === 5) {
                        newtype = '烟酒茶叶'
                    }else if (res.type * 1 === 6) {
                        newtype = '食品药品'
                    } else {
                        newtype = '药妆店/药店'
                    }
                    this.setState({
                        id: res.id,
                        title: res.title,
                        content: BraftEditor.createEditorState(res.content),
                        img: res.img,//多图片上传(需要数组)
                        phone: res.phone,
                        label: res.label,
                        type: newtype,
                        address: res.address,
                        priority: res.priority,
                        longitude: res.longitude,
                        latitude: res.latitude,
                    })
                }
            })

    }
    /**
        * todo 删除
        * @memberof ShopList
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
                        type: 'shopList/del', payload: { id: record.id },
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
        * todo 复制链接
        * @memberof ShopList
        */
    link = (item) => {
        Api._copy(`${LinkData.shopList}?id=${item.id}`);
    }
     // 提交保存
     handleOk = () => {

        let oktype = ''
        if (this.state.type === '超市&便利店') {
            oktype = 1
        } else if (this.state.type === '服饰鞋包') {
            oktype = 2
        } else if (this.state.type  === '综合商场') {
            oktype = 3
        } else if (this.state.type  === '花店') {
            oktype = 4
        } else if (this.state.type  === '烟酒茶叶') {
            oktype = 5
        }else if (this.state.type === '食品药品') {
            oktype = 6
        }else if (this.state.type === '药妆店/药店') {
            oktype = 7
        } else {
            oktype = ''
        }
        // 修改编辑
        let handeOkid = this.state.id;
        let self = this;

        if (!this.state.title) {
            Api._toast({ title: '标题不能为空' })
        } else if (oktype.length<=0) {
            Api._toast({ title: '请选择类型' })
        } else if (!this.state.content.toText()) {
            Api._toast({ title: '内容不能为空' })
        }  else if (!this.state.label) {
            Api._toast({ title: '请填写标签' })
        }else if (!this.state.phone) {
            Api._toast({ title: '请填写联系方式' })
        } else if (!this.state.priority) {
            Api._toast({ title: '优先级不能为空' })
        } else if (!this.state.address) {
            Api._toast({ title: '请填地址' })
        }else if (!this.state.longitude) {
            Api._toast({ title: '请填写经度' })
        }  else if (!this.state.latitude) {
            Api._toast({ title: '请填写纬度' })
        } else if (!this.state.img) {
            Api._toast({ title: '请上传缩略图' })
        } else if (handeOkid) {
            self
                .props
                .dispatch({
                    type: 'shopList/handleOk', payload: {
                        title: this.state.title,
                        img: this.state.img,
                        phone: this.state.phone,
                        content: this.state.content.toHTML(),
                        type: oktype,
                        label: this.state.label,
                        address: this.state.address,
                        priority: this.state.priority,
                        longitude: this.state.longitude,
                        latitude: this.state.latitude,
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
                    type: 'shopList/handleOk', payload: {
                        title: this.state.title,
                        img: this.state.img,
                        phone: this.state.phone,
                        content: this.state.content.toHTML(),
                        type: oktype,
                        label: this.state.label,
                        address: this.state.address,
                        priority: this.state.priority,
                        longitude: this.state.longitude,
                        latitude: this.state.latitude,
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
    /**
           * todo  上传图片
           * @memberof ShopList
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
    // 多图片上传
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });
    handleChangealone = info => {
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
     // 富文本的图片上传
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
      /**
   * 富文本编辑的方法
   *  */
  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    // const htmlContent = this.state.content.toHTML()
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
    handleEditorChange = (content) => {
        this.setState({ content })
    }

    changeValueNumber_one = (e, configInput) => {
        if (configInput) 
            this.setState({
                [configInput]: e.target.value.replace(/[^\d*\.{0,1}\d{0,1}]/g,'')
                // [configInput]:re.exec(e.target.value)
               
            })
        }   
    render() {
        const data = this.props.data
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
                    购物列表
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
                                type="text"
                                maxLength={50}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>类型</span>
                            <Select className={styles.dropdownItem} getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue="类型" onChange={(value) => this.selectChange(value, 'type')} value={this.state.type}>
                                <Option key='超市&便利店'>超市&便利店</Option>
                                <Option key='服饰鞋包'>服饰鞋包</Option>
                                <Option key='综合商场'>综合商场</Option>
                                <Option key='花店'>花店</Option>
                                <Option key='烟酒茶叶'>烟酒茶叶</Option>
                                <Option key='食品药品'>食品药品</Option>
                                <Option key='药妆店/药店'>药妆店/药店</Option>
                            </Select>
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
                            <span className={styles.overlayItemTitle}>标签</span>
                            <Input
                                className={this.state.editPhoneStatus}
                                value={this.state.label}
                                onChange=
                                {(value) => this.changeValue(value, 'label')}
                                name="label"
                                type="text"
                                maxLength={50}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>电话</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.phone}
                                onChange=
                                {(value) => this.changeValue(value, 'phone')}
                                name="phone"
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>地址</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.address}
                                onChange=
                                {(value) => this.changeValue(value, 'address')}
                                name="address"
                                type="text"
                                maxLength={50}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>排序</span>
                            <Input
                                value={this.state.priority}
                                name="title"
                                type="text"
                                maxLength={5}
                                onChange=
                                {(value) => this.changeValueNumber_one(value, 'priority')} />
                        </div>
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>经度</span>
                            <Input
                                className={this.state.rank}
                                value={this.state.longitude}
                                onChange=
                                {(value) => this.changeValueNumber_one(value, 'longitude')}
                                name="longitude"
                                type="text"
                                maxLength={16}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>纬度</span>
                            <Input
                                className={this.state.rank}
                                value={this.state.latitude}
                                onChange=
                                {(value) => this.changeValueNumber_one(value, 'latitude')}
                                name="latitude"
                                type="text"
                                maxLength={16}
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
                            {/* <Upload
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                            >
                                {fileList.length >= 3 ? null : <div>
                                    <Icon type="plus" />
                                    <div className="ant-upload-text">Upload</div>
                                </div>}
                            </Upload> */}
                            <Upload
                                name="imageFile"
                                action={Url.uploadImage}
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChangealone}
                            >
                                {this.state.img ? <img src={this.state.img} alt="avatar" className={styles.uploadImage} /> : uploadButton}
                            </Upload>
                        </div >
                    </div>
                </Modal>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        data: state.shopList.data
    };
}
export default connect(mapStateToProps)(ShopList);
