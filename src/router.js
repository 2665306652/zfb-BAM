import React from 'react';
import { Router, Route, Switch } from 'dva/router';
// 总体框架
import CustomLayout from './layout';
// 首页
import IndexPage from './routes/indexPage';
// 文章列表
import ArtList from './routes/artList';
// 文章分类
import ArtCategory from './routes/artCategory';
// 票务列表
import TicketList from './routes/ticketList';
// 票务分类
import TickCategory from './routes/tickCategory';
// 酒店列表
import HotelList from './routes/hotelList';
// 美食列表
import FoodList from './routes/foodList';
// 购物列表
import Shoplist from './routes/shopList'
// 导游列表
import GuideList from './routes/guideList';
// 导游列表
import GuideComment from './routes/guideComment';
// 广告列表
import AdList from './routes/adList'
// 会员列表
import VipList from './routes/vipList';
// 系统用户列表
import SysUser from './routes/sysUser';
// 登录
import Login from './routes/login';
//用户中心
import User from './routes/user';
//修改密码
import Password from './routes/password';

function RouterConfig({ history }) {
    return (
        <Router history={history}>
            <Switch>
            <Route path="/login" exact component={Login}/>
                <CustomLayout history={history}>
                    <Route path="/" exact component={IndexPage} />
                    <Route path="/artcategory" exact component={ArtCategory} />
                    <Route path="/artlist" exact component={ArtList} />
                    <Route path="/ticklist" exact component={TicketList} />
                    <Route path="/tickcategory" exact component={TickCategory} />
                    <Route path="/hotellist" exact component={HotelList} />
                    <Route path="/foodlist" exact component={FoodList} />
                    <Route path="/shoplist" exact component={Shoplist} />
                    <Route path="/guidelist" exact component={GuideList} />
                    <Route path="/guidecomment" exact component={GuideComment} />
                    <Route path="/viplist" exact component={VipList} />
                    <Route path="/adlist" exact component={AdList} />
                    <Route path="/sysuser" exact component={SysUser} />
                    <Route path="/user" exact component={User}/>
                    <Route path="/password" exact component={Password}/>
                </CustomLayout>
            </Switch>
        </Router>
    );

}

export default RouterConfig;
