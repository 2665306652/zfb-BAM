import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);


// 用户登录
app.model(require('./models/user').default);

// 文章管理(文章分类)
app.model(require('./models/artCategory').default);
// 文章管理(文章列表)
app.model(require('./models/artList').default);
// 票务列表
app.model(require('./models/ticketList').default);
// 票务分类
app.model(require('./models/tickCategory').default);
// 酒店
app.model(require('./models/hotellist').default);
// 美食
app.model(require('./models/foodList').default);
// 购物
app.model(require('./models/shoplist').default);
// 广告
app.model(require('./models/adlist').default);
// 导游评论
app.model(require('./models/guidecomment').default);
// 导游列表
app.model(require('./models/guidelist').default);
// vip会员
app.model(require('./models/viplist').default);
// 系统用户
app.model(require('./models/sysuser').default);




// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
