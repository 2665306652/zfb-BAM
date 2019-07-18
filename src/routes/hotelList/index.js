import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Input,
    Button,
    Table,
    Modal,
    Select,
    Upload,
    Icon,
    // message
} from "antd";
import Url from '../../utils/url';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css'

import LinkData from '../../utils/linkData';
import Api from '../../utils/api';

const Option = Select.Option;
const Search = Input.Search;
const confirm = Modal.confirm;


class HotelList extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            addModle: false,
            searchText: [
                '请输入标题'
            ],
            addTitle: '创建酒店',
            isSearch: false,
            editItem: {},//当前编辑行
            fileList: [
            ],

            // 增加参数
            searchValue: '',
            titlr: '',
            img: '',
            phone: '',
            content: BraftEditor.createEditorState(null),
            type: '',
            label: '',
            price: '',
            address: '',
            level: '',
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
            .dispatch({ type: 'hotelList/updateList', payload: { page: page ? page : this.state.page, title: searchValue ? searchValue : this.state.searchValue } })
    }

    searchChange = (e) => {
        let _self = this;
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
   * @memberof HotelList
   */
    search = (item) => {
        let _self = this;
        _self.setState({
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
                        <img src={text} alt="logo" className={styles.thumbnai} />
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
   * @memberof HotelList
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
     * @memberof HotelList
     */
    add = (item) => {
        this.setState({
            addModle: !this.state.addModle,
            fileList: [],//多文件上传的图片
            addTitle: '创建酒店',

            id: '',
            content: BraftEditor.createEditorState(null),
            img: '',//多图片上传(需要数组)
            phone: '',
            type: '',
            label: '',
            price: '',
            address: '',
            level: '',
            priority: '',
            longitude: '',
            latitude: '',
        });

    }


    /**
   * todo 编辑行
   * @memberof HotelList
   */
    edit = (item) => {
        // let fileList = [];
        // fileList.push(
        //     {
        //         uid: '-1',
        //         name: 'xxx.png',
        //         status: 'done',
        //         url: item.image
        //     }
        // )
        this.setState({ addModle: !this.state.addModle, addTitle: '编辑酒店', id: item.id })
        this.getbyidhotelinfo(item.id)


    }
    // 详情数据请求
    getbyidhotelinfo = (id) => {
        this
            .props
            .dispatch({
                type: 'hotelList/getbyidhotelinfo', payload: { id: id },
                callback: (res) => {
                    let getType = res.type * 1 === 1 ? '酒店' : '民宿';
                    // console.log(res.type,newType,'11')
                    // let newPrice = ''
                    // if (res.price * 1 === 1) {
                    //     newPrice = '100-500'
                    // } else if (res.price * 1 === 2) {
                    //     newPrice = '500-1000'
                    // } else {
                    //     newPrice = '1000以上'
                    // }

                    this.setState({
                        id: res.id,
                        title: res.title,
                        content: BraftEditor.createEditorState(res.content),
                        img: res.img,//多图片上传(需要数组)
                        phone: res.phone,
                        type: getType,
                        // type:res.type,
                        label: res.label,
                        // price: newPrice,
                        price:res.price,
                        address: res.address,
                        level: res.level,
                        priority: res.priority,
                        longitude: res.longitude,
                        latitude: res.latitude,

                    })
                }
            })

    }
    /**
        * todo 删除
        * @memberof HotelList
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
                        type: 'hotelList/del', payload: { id: record.id },
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
        * @memberof HotelList
        */
    link = (item) => {
        Api._copy(`${LinkData.hoteList}?id=${item.id}`);
    }
    // 提交保存
    handleOk = () => {
        let okType=''
        if(this.state.type === '酒店'){
            okType=1
        }else if(this.state.type === '民宿'){
            okType=2
        }else {
            okType=''
        }
        // let okPrice = ''
        // if (this.state.price === '100-500') {
        //     okPrice = 1
        // } else if (this.state.price === '500-1000') {
        //     okPrice = 2
        // } else if (this.state.price === '1000以上') {
        //     okPrice = 3
        // } else {
        //     okPrice = ''
        // }
        // console.log(okType,'xingji')
        // 修改编辑
        let handeOkid = this.state.id;
        let self = this;

        if (!this.state.title) {
            Api._toast({ title: '标题不能为空' })
        } else if (this.state.priority !== 0 && !this.state.priority) {
            Api._toast({ title: '优先级能为空' })
        } else if (!this.state.level) {
            Api._toast({ title: '请选择酒店等级' })
        } else if (!this.state.price) {
            Api._toast({ title: '请选择星级价格' })
        } else if (!this.state.type) {
            Api._toast({ title: '请选择住店类型' })
        } else if (!this.state.price) {
            Api._toast({ title: '请选择星级价格' })
        } else if (!this.state.content.toText()) {
            Api._toast({ title: '内容不能为空' })
        } else if (!this.state.label) {
            Api._toast({ title: '请填写标签' })
        } else if (!this.state.phone) {
            Api._toast({ title: '请填写联系方式' })
        } else if (!this.state.longitude) {
            Api._toast({ title: '请填写经度' })
        } else if (!this.state.latitude) {
            Api._toast({ title: '请填写纬度' })
        } else if (!this.state.img) {
            Api._toast({ title: '请上传缩略图' })
        } else if (handeOkid) {
            self
                .props
                .dispatch({
                    type: 'hotelList/handleOk', payload: {

                        title: this.state.title,
                        img: this.state.img,
                        phone: this.state.phone,
                        content: this.state.content.toHTML(),
                        priority: this.state.priority,
                        type: okType,
                        // type:this.state.type,
                        label: this.state.label,
                        // price: okPrice,
                        price:this.state.price,
                        address: this.state.address,
                        level: this.state.level,
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
                    type: 'hotelList/handleOk', payload: {
                        title: this.state.title,
                        img: this.state.img,
                        phone: this.state.phone,
                        content: this.state.content.toHTML(),
                        priority: this.state.priority,
                        type: okType,
                        // type:this.state.type,
                        label: this.state.label,
                        // price: okPrice,
                        price:this.state.price,
                        address: this.state.address,
                        level: this.state.level,
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
           * @memberof HotelList
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
    handleChange = ({ fileList }) => this.setState({ fileList });

    selectChange = (value, configInput) => {
        if (configInput) {
            this.setState({
                [configInput]: value
            })
        }

    }
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
    changeValue = (e, configInput) => {
        console.log(e.target.value);

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
                total:data.total,
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
                    酒店列表
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
                                className={this.state.title}
                                value={this.state.title}
                                onChange=
                                {(value) => this.changeValue(value, 'title')}
                                name="title"
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
                                {(value) => this.changeValueInput(value, 'priority')} />
                        </div>
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>分类</span>
                            <Select className={styles.dropdownItem} getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue="分类" onChange={(value) => this.selectChange(value, 'type')} value={this.state.type}>
                                <Option key='酒店'>酒店</Option>
                                <Option key='民宿'>民宿</Option>
                            </Select>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>星级价格</span>
                            <Select className={styles.dropdownItem} getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue="星级价格" onChange={(value) => this.selectChange(value, 'price')} value={this.state.price}>
                                {/* <Option key='100-500'>100-500</Option>
                                <Option key='500-1000'>500-1000</Option>
                                <Option key='1000以上'>1000以上</Option> */}
                                <Option key={1}>100-500</Option>
                                <Option key={2}>500-1000</Option>
                                <Option key={3}>1000以上</Option>
                            </Select>
                            
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>排序推荐</span>
                            <Select className={styles.dropdownItem} getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue="排序推荐" onChange={(value) => this.selectChange(value, 'level')} value={this.state.level}>
                                <Option key='一般'>一般</Option>
                                <Option key='中档'>中档</Option>
                                <Option key='高档'>高档</Option>
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
                            <span className={styles.overlayItemTitle}>经度</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
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
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.latitude}
                                onChange=
                                {(value) => this.changeValueNumber_one(value, 'latitude')}
                                name="latitude"
                                type="text"
                                maxLength={16}
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
                        <div style={{
                            textAlign: 'center',
                            lineHeight: '40px',
                            color: '#ccc',
                            fontWeight: 'bold',
                        }}>提示：上传图片宽度小于400最佳</div>
                        <div className={styles.overlayUpload}>
                            <span className={styles.overlayItemTitle}>缩略图</span>
                            {/*多文件上传 */}
                            {/* <Upload
                                action={Url.uploadImage}
                                listType="picture-card"
                                name="imageFile"
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
        data: state.hotelList.data,
    };
}

export default connect(mapStateToProps)(HotelList);
