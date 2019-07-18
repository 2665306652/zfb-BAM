import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Input,
    Button,
    Table,
    Modal,
    TreeSelect,
    Radio,
    // Row,
    // Col,
    // Divider
    Upload,
    Icon,
    // message,
    Popconfirm
} from "antd";
import Url from '../../utils/url';
import Api from '../../utils/api';
import LinkData from '../../utils/linkData';
// import { getDefaultSettings } from 'http2';
const TreeNode = TreeSelect.TreeNode;
const Search = Input.Search;
const RadioGroup = Radio.Group;
// const confirm = Modal.confirm;

class ticketList extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            addModle: false,
            addTitle: '创建票务详情',
            isSearch: false,
            isAdd: true,
            editTitleStatus: true,

            // 参数
            searchValue: '',//搜索值
            title: '',
            commodityid: '',
            label: '',
            price: '',
            ticketcategoryid: '',
            topimg: '',
            sold: '',
            iscar: 0,
            latitude: '',
            isshow: 0,
            id: '',
        }
    }
    componentDidMount() {
        this.updateList();
        this.classifyData()
    }
    // 搜索（获取数据）
    search = (item) => {

        let _self = this;
        this.setState({
            isSearch: item ? true : false,
            page: 1
        }, () => {
            _self.updateList(_self.state.page, item)
        })
    }
    // 搜索（搜索为空时请求数据）
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
    // 获取列表数据
    updateList = (page, searchValue) => {
        this
            .props
            .dispatch({ type: 'tickeList/updateList', payload: { page: page ? page : this.state.page, title: searchValue ? searchValue : this.state.searchValue } })
    }
    // 获取列表分类数据
    classifyData = () => {
        this
            .props
            .dispatch({ type: 'tickeList/classifyData', payload: {} })
    }
    /**
    * todo 删除
    * @memberof Ticketlist
    */
    del = (e, record) => {
        let _self = this
        this
            .props
            .dispatch({
                type: 'tickeList/del', payload: { id: e.id },
                callback: () => {
                    _self.updateList()
                    Api._toast({ title: '删除成功' })
                }
            })
    }

    /**
    * todo 确认 添加/修改
    *
   */
    handleOk = () => {
        let _self = this;
        if (!this.state.title) {
            Api._toast({ title: '标题不能为空' })
        } else if (!this.state.commodityid) {
            Api._toast({ title: '请输入商品id' })
        } else if (!this.state.label) {
            Api._toast({ title: '请输入标签' })
        } else if (!this.state.price) {
            Api._toast({ title: '请输入价格' })
        } else if (!this.state.ticketcategoryid) {
            Api._toast({ title: '请选择票务所属分类' })
        } else if (!this.state.topimg) {
            Api._toast({ title: '请上传缩略图' })
        } else if (!this.state.sold) {
            Api._toast({ title: '请输入已售数量' })
        } else if (!this.state.longitude) {
            Api._toast({ title: '请输入正确的经度' })
        } else if (!this.state.latitude) {
            Api._toast({ title: '请输入正确的纬度' })
        } else
            if (this.state.id) {
                this
                    .props
                    .dispatch({
                        type: 'tickeList/handleOk', payload: {
                            title: this.state.title,
                            commodityid: this.state.commodityid,
                            label: this.state.label,
                            price: this.state.price,
                            ticketcategoryid: this.state.ticketcategoryid,
                            topimg: this.state.topimg,
                            sold: this.state.sold,
                            iscar: this.state.iscar,
                            longitude: this.state.longitude,
                            latitude: this.state.latitude,
                            isshow: this.state.isshow,
                            id: this.state.id,
                        },
                        callback:function(){
                            Api._toast({ title: '编辑成功' })
                            _self.newRequest()
                        }
                    })
            } else {
                this
                    .props
                    .dispatch({
                        type: 'tickeList/handleOk', payload: {
                            title: this.state.title,
                            commodityid: this.state.commodityid,
                            label: this.state.label,
                            price: this.state.price,
                            ticketcategoryid: this.state.ticketcategoryid,
                            topimg: this.state.topimg,
                            sold: this.state.sold,
                            iscar: this.state.iscar,
                            longitude: this.state.longitude,
                            latitude: this.state.latitude,
                            isshow: this.state.isshow,
                        },
                        callback: function(){
                            Api._toast({ title: '添加成功' })
                            _self.newRequest()
                        }
                    })
            }
    }
    newRequest = () => {
        const { addModle } = this.state;
        this.setState({
            addModle: !addModle
        })
        this.updateList()
    }
    // 详情数据请求
    getbyidticketinfo = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'tickeList/getbyidticketinfo',
            // type: 'tickeList/del',
            payload: { id: id },
            callback: (res) => {
                this.setState({
                    title: res.title,
                    commodityid: res.commodityid,
                    label: res.label,
                    price: res.price,
                    ticketcategoryid: res.ticketcategoryid,
                    topimg: res.topimg,
                    sold: res.sold,
                    iscar: res.iscar,
                    longitude: res.longitude,
                    latitude: res.latitude,
                    isshow: res.isshow,
                    ticketcategorytitle:res.ticketcategorytitle,
                })
            },

        })
    }
    /**
     * todo 新建票务信息
     * @memberof Ticketlist
     */
    add = (parameter) => {
        this.setState({
            addModle: !this.state.addModle,
            addTitle: '新建票务详情',

            // 参数
            title: '',
            commodityid: '',
            label: '',
            price: '',
            ticketcategoryid: '',
            topimg: '',
            sold: '',
            iscar: 0,
            latitude: '',
            isshow: 0,
            id: '',
            ticketcategorytitle:'',
        })

    }
    // 编辑
    editData = (item, e) => {
        let _self = this
        _self.setState({ addModle: !_self.state.addModle, addTitle: '编辑票务详情', id: item.id })
        _self.getbyidticketinfo(item.id)

    }
    /**
    * todo 复制链接
    * @memberof Ticketlist
    */
    copy = (item) => {
        Api._copy(`${LinkData.ticklist}?id=${item.id}`);
    }
    /**
     * todo 输入验证
     */
    editInputChange(e, configInput) {
        if (configInput) {
            this.setState({
                [configInput]: e.target.value
            })
        }
    }
    /**
     * todo 树状下拉验证
     */
    editTreeChange(value, label, extra) {
        // 这里设置为ID(下拉获取ID值editClassify设置为ID值，需要value)
        this.setState({
            ticketcategorytitle: value,
            ticketcategoryid: extra.triggerNode.props.id
        })
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
    /**
     * todo radio输入验证
     */
    onChangeRadio = (e, configRadio) => {

        this.setState({
            [configRadio]: e.target.value
        })
    }
    // 只能输入数字
    changeValueNumber = (e, configInput) => {
        if (configInput) {
            this.setState({
                // replace(/[^1-9]/g,'')
                [configInput]: e.target.value.replace(/[^(0+)|[^1-9]/g,'')
            })
        }
    }
    // 带一位小数的数字
    changeValueNumber_one = (e, configInput) => {
        if (configInput) 
            this.setState({
                [configInput]: e.target.value.replace(/[^\d*\.{0,1}\d{0,1}]/g,'')
                // [configInput]:re.exec(e.target.value)
               
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
                dataIndex: "topimg",
                key: "topimg",
                render: (text, record) => {
                    return (
                        <div className={styles.listHandle}>
                            <img src={text} className={styles.listPic} alt='图片' />
                        </div>
                    );
                }
            },
            {
                title: "标题",
                dataIndex: "title",
                key: "title"
            },
            {
                title: "价格",
                dataIndex: "price",
                key: "price"
            },
            {
                title: "已售",
                dataIndex: "sold",
                key: "sold"
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                render: (text, record) => {
                    return (
                        <div className={styles.listHandle}>
                            {/* <span className={styles.handleItem} onClick={(e) => _self.copy(record, e)}>链接</span> */}
                            <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={(e) => _self.del(record, e)}>
                                <span className={styles.handleItem}>删除</span>
                            </Popconfirm>
                            <span className={styles.handleItem} onClick={(e) => _self.editData(record, e)}>编辑</span>
                        </div>
                    );
                }
            }
        ]
    }

    /**
  * todo 翻页
  * @memberof Ticketlist
  */
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            page: pagination.current
        }, () => {
            this.updateList();
        });
    };

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
        const locale = {
            emptyText: "暂无数据显示！"
        };
        const isLoading = false;
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
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className={styles.content}>
                <h2 className={styles.header}>
                    票务列表
                </h2>
                <div className={styles.search}>
                    <div className={styles.searchList}>
                        <Search
                            placeholder="搜索标题"
                            enterButton="Search"
                            size="large"
                            allowClear
                            onChange={this.searchChange}
                            onSearch={value => { this.search(value) }} />
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
                        // childrenColumnName='childlist'
                        {...tableOption} />
                </div>
                <Modal
                    title={this.state.addTitle}
                    visible={this.state.addModle}
                    onCancel={this.add}
                    onOk={this.handleOk}>
                    <div className={styles.overlay}>
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>标题</span>
                            <Input
                                className={this.state.editTitleStatus
                                    ? ''
                                    : styles.msgError}
                                value={this.state.title}
                                name="title"
                                onChange=
                                {(value) => this.editInputChange(value, 'title')} />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>分类</span>
                            <TreeSelect
                                value={this.state.ticketcategorytitle}
                                name="classify"
                                style={{ width: 455 }}
                                placeholder="请选择"
                                onChange={(value, label, extra) => this.editTreeChange(value, label, extra)}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                                {this.setPermission(classifyData)}
                            </TreeSelect>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>商品id</span>
                            <Input
                                value={this.state.commodityid}
                                name="GoodsId"
                                onChange={(value) => this.changeValueNumber(value, 'commodityid')}
                                type="text"
                                maxLength={16}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>标签</span>
                            <Input
                                value={this.state.label}
                                name="tags"
                                onChange={(value) => this.editInputChange(value, 'label')}
                                type="text"
                                maxLength={50}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>价格</span>
                            <Input
                                value={this.state.price}
                                // name="price"
                                onChange={(value) => this.changeValueNumber_one(value, 'price')}
                                type="text"
                                maxLength={9}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>已售</span>
                            <Input
                                value={this.state.sold}
                                name="sold"
                                onChange={(value) => this.changeValueNumber(value, 'sold')}
                                type="text"
                                maxLength={8}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>纬度</span>
                            <Input
                                value={this.state.latitude}
                                name="latitude"
                                onChange={(value) => this.changeValueNumber_one(value, 'latitude')}
                                type="text"
                                maxLength={16}
                            />

                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>经度</span>
                            <Input
                                value={this.state.longitude}
                                name="longitude"
                                onChange={(value) => this.changeValueNumber_one(value, 'longitude')}
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
                            <Upload
                                name="imageFile"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={Url.uploadImage}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                                
                            >
                                {this.state.topimg ? <img src={this.state.topimg} alt="avatar" className={styles.uploadImage} style={{ height: '92px'}}/> : uploadButton}
                            </Upload>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>是否坐车</span>
                            <RadioGroup
                                className={styles.overlayRadio}
                                name="isNeedCar"
                                onChange=
                                {e => this.onChangeRadio(e, 'iscar')}
                                value={this.state.iscar}>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </RadioGroup >
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>是否显示</span>
                            <RadioGroup
                                className={styles.overlayRadio}
                                name="isShow"
                                onChange=
                                {e => this.onChangeRadio(e, 'isshow')}
                                value={this.state.isshow}>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </RadioGroup >
                        </div >
                    </div>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.tickeList.data,
        classifyData: state.tickeList.classifyData,
        detailsData: state.tickeList.detailsData
    };

}
export default connect(mapStateToProps)(ticketList);