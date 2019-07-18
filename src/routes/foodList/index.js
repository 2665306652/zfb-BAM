import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Input,
    Button,
    Table,
    Modal,
    // Radio,
    Checkbox,
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
const Search = Input.Search;
const confirm = Modal.confirm;



// eslint-disable-next-line no-extend-native
Array.prototype._hasItem = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === item) {
            return true;
        }
    }
    return false
}

// eslint-disable-next-line no-extend-native
Array.prototype._removeItem = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === item) {
            this.splice(i, 1)

        }
    }
    return this;
}

class FoodList extends Component {
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
            addTitle: '创建美食',

            // 增加参数
            searchValue: '',
            titlr: '',
            img: '',
            phone: '',
            content: BraftEditor.createEditorState(null),
            label: '',
            price: '',
            address: '',
            priority: '',
            longitude: '',
            latitude: '',
            id: '',
            percapita: '',
            features: [],
        }
    }
    componentDidMount() {
        this.updateList()
    }
    updateList = (page, searchValue) => {
        this
            .props
            .dispatch({ type: 'foodList/updateList', payload: { page: page ? page : this.state.page, title: searchValue ? searchValue : this.state.searchValue } })
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
   * @memberof FoodList
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
                        <div style={{heigtt:'65px'}}>
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
                title: "人均",
                dataIndex: "percapita",
                key: "percapita"
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
   * @memberof FoodList
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
     * @memberof FoodList
     */
    add = (item) => {
        // this.setState({ addModle: !this.state.addModle, fileList: [], editItem: {}, addTitle: '创建美食' });
        this.setState({
            addModle: !this.state.addModle,
            fileList: [],//多文件上传的图片
            addTitle: '创建美食',

            title: '',
            img: '',
            phone: '',
            content: BraftEditor.createEditorState(null),
            label: '',
            price: '',
            address: '',
            priority: '',
            longitude: '',
            latitude: '',
            id: '',
            percapita: '',
            features: []
        });
    }


    /**
   * todo 编辑行
   * @memberof FoodList
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
        this.setState({ addModle: !this.state.addModle, addTitle: '编辑美食', id: item.id })
        this.getbyidhotelinfo(item.id)
    }
    // 详情数据请求
    getbyidhotelinfo = (id) => {
        this
            .props
            .dispatch({
                type: 'foodList/getbyidhotelinfo', payload: { id: id },
                callback: (res) => {
                    // let newPrice = ''
                    // if (res.price * 1 === 1) {
                    //     newPrice = '100以内'
                    // } else if (res.price * 1 === 2) {
                    //     newPrice = '100-200'
                    // } else if (res.price * 1 === 3){
                    //     newPrice = '200-300'
                    // }else {
                    //     newPrice = '300以上'
                    // }
                    let newfeatures=res.features.split(",")
                    this.setState({
                        id: res.id,
                        title: res.title,
                        content: BraftEditor.createEditorState(res.content),
                        img: res.img,//多图片上传(需要数组)
                        phone: res.phone,
                        label: res.label,
                        // price: newPrice,
                        price:res.price,
                        address: res.address,
                        level: res.level,
                        priority: res.priority,
                        longitude: res.longitude,
                        latitude: res.latitude,
                        percapita: res.percapita,
                        features: newfeatures
                    })
                }
            })

    }
    /**
        * todo 删除
        * @memberof FoodList
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
                        type: 'foodList/del', payload: { id: record.id },
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
        * @memberof FoodList
        */
    link = (item) => {
        Api._copy(`${LinkData.foodList}?id=${item.id}`);
    }

    // 提交保存
    handleOk = () => {
        // let okPrice = ''
        // if (this.state.price === '100以内') {
        //     okPrice = 1
        // } else if (this.state.price === '100-200') {
        //     okPrice = 2
        // } else if (this.state.price === '200-300') {
        //     okPrice = 3
        // } else if (this.state.price === '300以上') {
        //     okPrice = 4
        // } else {
        //     okPrice = ''
        // }
        let okFeatures=this.state.features.join(",")
        
        // 修改编辑
        let handeOkid = this.state.id;
        let self = this;

        if (!this.state.title) {
            Api._toast({ title: '标题不能为空' })
        } else if (!this.state.content.toText()) {
            Api._toast({ title: '内容不能为空' })
        } else if (okFeatures.length===0) {
            Api._toast({ title: '请勾选特色' })
        } else if (!this.state.label) {
            Api._toast({ title: '请填写标签' })
        }else if (!this.state.price) {
            Api._toast({ title: '请选择价格分类' })
        } else if (!this.state.phone) {
            Api._toast({ title: '请填写联系方式' })
        } else if (!this.state.address) {
            Api._toast({ title: '请填地址' })
        }else if (!this.state.percapita) {
            Api._toast({ title: '请输入人均' })
        } else if (!this.state.longitude) {
            Api._toast({ title: '请填写经度' })
        }  else if (!this.state.latitude) {
            Api._toast({ title: '请填写纬度' })
        } else if (!this.state.img) {
            Api._toast({ title: '请上传缩略图' })
        } else if (handeOkid) {
            self
                .props
                .dispatch({
                    type: 'foodList/handleOk', payload: {

                        title: this.state.title,
                        img: this.state.img,
                        phone: this.state.phone,
                        content: this.state.content.toHTML(),
                        priority: this.state.priority,
                        label: this.state.label,
                        // price: okPrice,
                        price:this.state.price,
                        address: this.state.address,
                        level: this.state.level,
                        longitude: this.state.longitude,
                        latitude: this.state.latitude,
                        percapita:this.state.percapita,
                        id: this.state.id,
                        features:okFeatures
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
                    type: 'foodList/handleOk', payload: {
                        title: this.state.title,
                        img: this.state.img,
                        phone: this.state.phone,
                        content: this.state.content.toHTML(),
                        priority: this.state.priority,
                        label: this.state.label,
                        // price: okPrice,
                        price:this.state.price,
                        address: this.state.address,
                        level: this.state.level,
                        longitude: this.state.longitude,
                        latitude: this.state.latitude,
                        percapita:this.state.percapita,
                        features:okFeatures
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
           * @memberof FoodList
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
        if (configInput) {
            this.setState({
                [configInput]: e.target.value
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

    CheckboxonChange= e => {
        this.setState({
            features:e
        })
        
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
        const locale = {
            emptyText: "暂无数据显示！"
        };
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
                    美食列表
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
                            <span className={styles.overlayItemTitle}>特色</span>
                            <Checkbox.Group style={{ width: '100%', lineHeight: '30px' }} value={this.state.features} onChange={this.CheckboxonChange}>

                                <Checkbox value="1">当地口味</Checkbox>

                                <Checkbox value="2"> 主题餐厅</Checkbox>

                                <Checkbox value="3"> 下午茶</Checkbox>

                                <Checkbox value="4">老字号</Checkbox>

                                <Checkbox value="5">深夜营业</Checkbox>

                                <Checkbox value="6">景观餐厅</Checkbox>

                            </Checkbox.Group>,
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>标签</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.label}
                                onChange=
                                {(value) => this.changeValue(value, 'label')}
                                name="label"
                                type="text"
                                maxLength={50}
                            />
                        </div >


                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>价格分级</span>
                            <Select className={styles.dropdownItem} getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue="价格分级" onChange={(value) => this.selectChange(value, 'price')} value={this.state.price}>
                                <Option key={1}>100以内</Option>
                                <Option key={2}>100-200</Option>
                                <Option key={3}>200-300</Option>
                                <Option key={4}>300以上</Option>
                            </Select>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>电话</span>
                            <Input
                                className={this.state.rank}
                                value={this.state.phone}
                                onChange=
                                {(value) => this.changeValue(value, 'phone')}
                                name="phone"
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>地址</span>
                            <Input
                                className={this.state.rank}
                                value={this.state.address}
                                onChange=
                                {(value) => this.changeValue(value, 'address')}
                                name="address"
                                type="text"
                                maxLength={50}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>人均</span>
                            <Input
                                className={this.state.rank}
                                value={this.state.percapita}
                                onChange=
                                {(value) => this.changeValueNumber_one(value, 'percapita')}
                                name="percapita"
                                type="text"
                                maxLength={9}
                            />
                        </div >
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
                        }}>提示：请上传 100*100 图片</div>
                        <div className={styles.overlayUpload}>
                            <span className={styles.overlayItemTitle}>缩略图</span>
                            {/*多文件上传 */}
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
        data: state.foodList.data,
    };
}
export default connect(mapStateToProps)(FoodList);
