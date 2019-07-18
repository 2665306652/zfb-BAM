import React, { Component } from 'react';
import {
	Menu,
	Icon,
} from "antd";
import { Link } from 'dva/router';
import Api from '../../utils/api';

const SubMenu = Menu.SubMenu;

/**
 * todo 左侧导航配置
 * @param {string} id  唯一key
 * @param {href} url 导航对应路径,
 * @param {string} icon 导航对应图标
 * @param {string} name 导航显示名称
 * @param {array} children 二级导航配置
 */

class NavMenu extends Component {
	constructor() {
		super();
		this.state = {
			key: ''
		}
	}
	menuRender = data => {
		let { id, url, icon, value, children } = data;
		if (children && children.length) {
			return (
				<SubMenu
					key={id}
					title={< span > <Icon type={icon} /> < span style={{ marginLeft: '-5px' }}> {value} </span> </span >}>
					{children.map(item => this.menuRender(item))}
				</SubMenu>
			);

		} else {
			return (
				<Menu.Item key={id}>
					<Link to={url}>
						<span>
							<Icon type={icon} />
							<span className="nav-text">{value}</span>
						</span>
					</Link>
				</Menu.Item>
			)
		}
	}
	render() {
		// const hashValue = location.hash.split('#')[1];
		const sliderOption = {
			'/': ['10'],
			'/artlist': ['201'],
			'/artcategory': ['202'],
			'/ticklist': ['301'],
			'/tickcategory': ['302'],
			'/hotellist': ['401'],
			'/foodlist': ['501'],
			'/shoplist': ['601'],
			'/guidelist': ['701'],
			'/guidecomment': ['702'],
			'/adlist': ['901'],
			'/viplist': ['1001'],
			'/sysuser': ['1101'],
			'/urllist': ['1102'],
			'/moduleset': ['1103'],
		}
		const openMenu = {
			'/artlist': ['20'],
			'/artcategory': ['20'],
			'/ticklist': ['30'],
			'/tickcategory': ['30'],
			'/hotellist': ['40'],
			'/foodlist': ['50'],
			'/shoplist': ['60'],
			'/guidelist': ['70'],
			'/guidecomment': ['70'],
			'/adlist': ['90'],
			'/viplist': ['100'],
			'/sysuser': ['110'],
		}
        let { jurisdiction } = this.props;
		// eslint-disable-next-line no-eval
		jurisdiction = jurisdiction !== '' ? eval('[' + jurisdiction + ']') : [];
		let newArr = [];
		// eslint-disable-next-line array-callback-return
		jurisdiction.map((item) => {
			newArr = newArr.concat(Api.jurisdiction.filter(n => n.id === item))
		})
    newArr = Api.jurisdiction;


		return (
			<div>
				<Menu
					theme="dark"
					defaultSelectedKeys={sliderOption[this.props.path]}
					defaultOpenKeys={openMenu[this.props.path]}
					mode="inline">
					{newArr.map(item => this.menuRender(item))}
				</Menu>
			</div>
		);
	}
}

export default NavMenu;