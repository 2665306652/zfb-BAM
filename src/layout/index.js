import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './index.less';
import { Layout, Menu, Icon, Dropdown } from "antd";

import { Link } from "dva/router";
/* 左侧导航 */
import NavMenu from '../components/navMenu';
import Api from '../utils/api';

const { Header, Sider } = Layout;

function mapStateToProps(state) {
    return { name: state.user.userName, id: state.user.userId, jurisdiction: state.user.jurisdiction };
}

// export default class CustomLayout extends Component {
class CustomLayout extends Component {

    componentDidMount() {
    }

	/**
	 * 退出登录
	 *
	 * @memberof CustomLayout
	 */
    exit(e) {

        // e.preventDefault();
        Api._logout(this.props)

    }
	/**
	 * todo 返回上一次浏览页面
	 */
    historyBack() {
        this
            .props
            .history
            .goBack()
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <Link replace to="/user">
                        用户中心
                </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link replace to={{
                        pathname: "/password"
                    }}>
                        修改密码
                </Link>
                </Menu.Item>
                <Menu.Item>
                    <a
                        onClick={() => {
                            this.exit();
                        }}
                        rel="noopener noreferrer"
                        href="javascript:void(0);">
                       
                        退出登录
                </a>
                </Menu.Item>
            </Menu>
        );

        return (
            <Layout className={styles.content}>
                <Sider collapsible>
                    <div className={styles.logo}>
                        <img src={require('../assets/logo.png')} alt="logo" />
                    </div>
                    <div className={styles.navwrap} style={{
                        overflow: 'auto',
                        height: 'calc(100% - 92px)',

                    }}>
                        <NavMenu path={this.props.history.location.pathname} jurisdiction={this.props.jurisdiction} />
                    </div>
                </Sider>
                <Layout>
                    <Header className={styles.header}>
                        {this.props.history.length > 3
                            ? <span className={styles.back} onClick={() => this.historyBack()}>
                                返回
                </span>
                            : ''}
                        <Dropdown overlay={menu}>
                            <span
                                className="ant-dropdown-link"
                                style={{
                                    color: "#ccc",
                                    cursor: "pointer",
                                    float: "right"
                                }}>
                                <Icon
                                    size={81}
                                    type="user"
                                    style={{
                                        verticalAlign: "middle"
                                    }} />
                                <span
                                    style={{
                                        fontSize: "14px",
                                        verticalAlign: "middle",
                                        display: "inline-block",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}>
                                    {this.props.name}
                                </span>
                            </span>
                        </Dropdown>
                    </Header>

                    <div style={styles.main}>
                        {this.props.children}
                    </div>
                </Layout>
            </Layout>
        );
    }
}

export default connect(mapStateToProps)(CustomLayout);
