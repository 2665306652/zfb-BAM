import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Input,
    Button,
    Table,
    Modal,
    Radio,
    Select,
    Upload,
    Icon,
    InputNumber 
    // message
} from "antd";

import Url from '../../utils/url';
import Api from '../../utils/api';
import LinkData from '../../utils/linkData';

const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const confirm = Modal.confirm;


class GuideList extends Component {
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
            addTitle:'创建导游信息',

            // 增加参数
            searchValue:'',

            name:'',
            servicetimes:'',
            commentnumber:'',
            sex:'',
            level:'',
            nickname:'',
            comments:'',
            img:'',
            priority:'',
            score:'',
            isshow:0,
            phone:'',
            newAge:'',
            id:''
        }
    }
    componentDidMount() {
        this.updateList()
    }
    updateList = (page, searchValue) => {
        this
            .props
            .dispatch({ type: 'guidelist/updateList', payload: { page: page ? page : this.state.page, name: searchValue ? searchValue : this.state.searchValue } })
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
   * @memberof GuideList
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
                title: "头像",
                dataIndex: "img",
                key: "img",
                render: (text, record) => {
                    return (
                        <div className={styles.thumbnai}>
                            <img src={text} alt="logo" className={styles.thumbnai} />
                        </div>
                        
                    )
                }
            }, {
                title: "姓名",
                dataIndex: "name",
                key: "name"
            }, {
                title: "电话",
                dataIndex: "phone",
                key: "phone"
            }, {
                title: "性别",
                dataIndex: "sex",
                key: "sex",
                render: (text, record) => {
                    if (text * 1 === 2) {
                        return (
                            <span>女</span>
                        )
                    } else if (text * 1 === 1) {
                        return (
                            <span>男</span>
                        )
                    } else {
                        return (
                            <span>未知</span>
                        )
                    }
                }
            }, {
                title: "服务次数",
                dataIndex: "servicetimes",
                key: "servicetimes",
                // sorter: (a, b) => a.servicetimes - b.servicetimes,
            }, {
                title: "评分",
                dataIndex: "score",
                key: "score",
                // sorter: (a, b) => a.score - b.score,
            }, {
                title: "评论次数",
                dataIndex: "commentnumber",
                key: "commentnumber",
                // sorter: (a, b) => a.commentnumber - b.commentnumber,
            }, {
                title: "排序",
                dataIndex: "priority",
                key: "priority",
                // sorter: (a, b) => a.priority - b.priority,
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
   * @memberof GuideList
   */
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({
            page: pagination.current
        }, () => {
            this.updateList()
        });
    };

    /**
           * todo 复制链接
           * @memberof ShopList
           */
        link = (item) => {
            Api._copy(`${LinkData.guideList}?id=${item.id}`);
        }
    /**
     * todo 添加
     * @memberof GuideList
     */
    add = (item) => {
        this.setState({ 
            addModle: !this.state.addModle, 
            addTitle:'创建导游信息',

            name:'',
            servicetimes:'',
            commentnumber:'',
            sex:'',
            level:'',
            nickname:'',
            comments:'',
            img:'',
            priority:'',
            score:'',
            isshow:'',
            phone:'',
            newAge:'',
            id:''
        });
    }


    /**
   * todo 编辑行
   * @memberof GuideList
   */
    edit = (item) => {
        this.setState({ 
            addModle: !this.state.addModle, 
            addTitle:'编辑导游信息',
            id: item.id,
            phone:item.phone,
        });
        this.getbyidhotelinfo(item.id)
    }
    // 详情数据请求
    getbyidhotelinfo = (id) => {
        this
            .props
            .dispatch({
                type: 'guidelist/getbyidhotelinfo', payload: { id: id },
                callback: (res) => {
                    let getSex = ''
        if (res.sex * 1 === 2) {
            getSex = '女'
        } else if (res.sex * 1 === 1) {
            getSex = '男'
        } else {
            getSex = '未知'
        }

        let getAge = ''
        if (res.age * 1 === 1) {
            getAge = '90后'
        } else if (res.age * 1 === 2) {
            getAge = '80后'
        } else if (res.age * 1 === 3) {
            getAge = '70后'
        } else {
            getAge = '60后'
        }
                    this.setState({
                        name:res.name,
                        servicetimes:res.servicetimes,
                        commentnumber:res.commentnumber,
                        sex:getSex,
                        level:res.level,
                        nickname:res.nickname,
                        comments:res.comments,
                        img:res.img,
                        priority:res.priority,
                        score:res.score,
                        isshow:res.isshow,
                        id:res.id,
                        newAge:getAge,
                    })
                }
            })

    }
    /**
        * todo 删除
        * @memberof GuideList
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
                        type: 'guidelist/del', payload: { id: record.id },
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
     // 提交保存
     handleOk = () => {
        
        let oknewAge = ''
        if (this.state.newAge === '90后') {
            oknewAge = 1
        } else if (this.state.newAge === '80后') {
            oknewAge = 2
        } else if (this.state.newAge  === '70后') {
            oknewAge = 3
        } else if (this.state.newAge  === '60后') {
            oknewAge = 4
        } else {
            oknewAge = ''
        }

        let oksex=''
        if (this.state.sex === '未知') {
            oksex = 0
        } else if (this.state.sex === '男') {
            oksex = 1
        } else if (this.state.sex  === '女') {
            oksex = 2
        } else {
            oksex = ''
        }
        // 修改编辑
        let handeOkid = this.state.id;
        let self = this;

        if (!this.state.name) {
            Api._toast({ title: '姓名不能为空' })
        } else if (!this.state.servicetimes) {
            Api._toast({ title: '请填写服务次数' })
        } else if (!this.state.phone) {
            Api._toast({ title: '请填写联系方式' })
        }  else if (!oksex) {
            Api._toast({ title: '请填写性别' })
        }else if (!oknewAge) {
            Api._toast({ title: '请填写年龄' })
        }else if (!this.state.level) {
            Api._toast({ title: '请填写等级' })
        } else if (!this.state.nickname) {
            Api._toast({ title: '昵称不能为空' })
        } else if (!this.state.comments) {
            Api._toast({ title: '请填写评语' })
        }else if (!this.state.img) {
            Api._toast({ title: '请填上传头像' })
        }   else if (!this.state.priority) {
            Api._toast({ title: '请填写优先级' })
        }else if (!this.state.score) {
            Api._toast({ title: '请填写评分' })
        } else if (handeOkid) {
            self
                .props
                .dispatch({
                    type: 'guidelist/handleOk', payload: {
                        name: this.state.name,
                        servicetimes: this.state.servicetimes,
                        sex: oksex,
                        age: oknewAge,
                        level: this.state.level,
                        nickname: this.state.nickname,
                        comments: this.state.comments,
                        img: this.state.img,
                        priority: this.state.priority,
                        score: this.state.score,
                        isshow:this.state.isshow,
                        phone:this.state.phone,
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
                    type: 'guidelist/handleOk', payload: {
                        name: this.state.name,
                        servicetimes: this.state.servicetimes,
                        sex: oksex,
                        age: oknewAge,
                        level: this.state.level,
                        nickname: this.state.nickname,
                        comments: this.state.comments,
                        img: this.state.img,
                        priority: this.state.priority,
                        score: this.state.score,
                        isshow:this.state.isshow,
                        phone:this.state.phone,
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
           * @memberof GuideList
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
    selectChange = (value, configInput) => {
        if (configInput) {
            this.setState({
                [configInput]: value
            })
        }
    }
    // onShowChange = (e) => {
    //     this.setState({
    //         isshow: e.target.value,
    //     });
    // }
    onChangescore=(value)=> {
        this.setState({
            score: value
        })
      }
    editInputChange(e, configInput) {
        if (configInput) {
            this.setState({
                [configInput]: e.target.value
            })
        }
    }
    changeValueNumber = (e, configInput) => {
        if (configInput) {
            this.setState({
                // replace(/[^1-9]/g,'')
                [configInput]: e.target.value.replace(/[^(0+)|[^1-9]/g,'')
            })
        }
    }
    changeValueNumberMAX = (e, configInput) => {
        if (configInput) {
            let configInputValue=''
            if(e.target.value*1>=5){
                configInputValue=5
            }else if(e.target.value*1<=0){
                configInputValue=0
            }else {
                configInputValue=e.target.value.replace(/[^(0+)|[^1-9]/g,'')
            }
            this.setState({
                // replace(/[^1-9]/g,'')
                [configInput]: configInputValue
            })
        }
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
                    导游列表
                </h2>
                <div className={styles.search}>
                    <div className={styles.searchList}>
                        <Search
                            placeholder='请输入姓名'
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
                            <span className={styles.overlayItemTitle}>姓名</span>
                            <Input
                                className={this.state.title}
                                value={this.state.name}
                                onChange=
                                {(value) => this.changeValue(value, 'name')}
                                name="name"
                                type="text"
                                maxLength={16}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>服务次数</span>
                            <Input
                                className={this.state.editPhoneStatus}
                                value={this.state.servicetimes}
                                onChange=
                                {(value) => this.changeValueNumber(value, 'servicetimes')}
                                name="servicetimes"
                                type="text"
                                maxLength={6}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>电话</span>
                            <Input
                                className={this.state.editPhoneStatus}
                                value={this.state.phone}
                                onChange=
                                {(value) => this.changeValue(value, 'phone')}
                                name="phone"
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>评论次数</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.commentnumber}
                                onChange=
                                {(value) => this.changeValue(value, 'commentnumber')}
                                name="commentnumber"
                                type='number'
                                readOnly="readonly"
                                placeholder='评论次数'
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>性别</span>
                            <Select className={styles.dropdownItem} getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue="性别" value={this.state.sex}  onChange={(value) => this.selectChange(value, 'sex')}>
                                <Option key='未知'>未知</Option>
                                <Option key='男'>男</Option>
                                <Option key='女'>女</Option>
                            </Select>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>年龄</span>
                            <Select className={styles.dropdownItem} getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue="年龄" value={this.state.newAge}  onChange={(value) => this.selectChange(value, 'newAge')}>
                                <Option key='90后'>90后</Option>
                                <Option key='80后'>80后</Option>
                                <Option key='70后'>70后</Option>
                                <Option key='60后'>60后</Option>
                            </Select>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>等级</span>
                            <Select className={styles.dropdownItem} getPopupContainer={triggerNode => triggerNode.parentNode} defaultValue="等级" value={this.state.level}  onChange={(value) => this.selectChange(value, 'level')}>
                                <Option key='初级向导'>初级向导</Option>
                                <Option key='核心向导'>核心向导</Option>
                            </Select>
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>昵称</span>
                            <Input
                                className={this.state.editPhoneStatus
                                }
                                value={this.state.nickname}
                                onChange=
                                {(value) => this.changeValue(value, 'nickname')}
                                name="nickname"
                                type="text"
                                maxLength={16}
                            />
                        </div >
                        <div className={styles.overlayArea}>
                            <span className={styles.overlayItemTitle}>评语</span>
                            <TextArea rows={4} value={this.state.comments} onChange=
                                {(value) => this.changeValue(value, 'comments')} />
                        </div >
                        <div style={{
                            textAlign: 'center',
                            lineHeight: '40px',
                            color: '#ccc',
                            fontWeight: 'bold',
                        }}>提示：上传图片宽度90*90最佳</div>
                        <div className={styles.overlayUpload}>
                            <span className={styles.overlayItemTitle}>头像</span>
                            <Upload
                                name="imageFile"
                                action={Url.uploadImage}
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                            >
                                {this.state.img ? <img src={this.state.img} alt="avatar" className={styles.uploadImage} /> : uploadButton}
                            </Upload>
                        </div >

                        
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>排序</span>
                            <Input
                                className={this.state.rank}
                                value={this.state.priority}
                                onChange=
                                {(value) => this.changeValueNumber_one(value, 'priority')}
                                name="priority"
                                type="text"
                                maxLength={5}
                            />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>评分</span>
                          
                            <InputNumber className={this.state.rank} 
                            min={1} max={5} 
                            defaultValue={2} 
                            value={this.state.score} 
                            onChange= {this.onChangescore} />
                        </div >
                        <div className={styles.overlayItem}>
                            <span className={styles.overlayItemTitle}>是否显示</span>
                            <RadioGroup onChange={(value) => this.editInputChange(value, 'isshow')} value={this.state.isshow}>
                                <Radio value={0}>不显示</Radio>
                                <Radio value={1}>显示</Radio>
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
        data: state.guidelist.data
    };
}
export default connect(mapStateToProps)(GuideList);
