
// let local = 'http://2p50896d11.wicp.vip'
let local = 'https://littletest.allinkgo.com/songshan'
module.exports = {

  //获取用户登录信息
  getLoginInfo: local + '/manageuser/getloginuserinfo',
  //用户登录接口
  userLogin: local + '/manageuser/userlogin',
  // 退出
  outLogin: local + '/manageuser/outlogin',
  // 修改密码
  editpassword: local + '/manageuser/userupdatepassword',

  // 上传图片
  uploadImage: local + '/file/ossupload',
  //文章管理(获取文章分类)
  getarticlecategorylist: local + '/articlecategory/getarticlecategorylist',
  // 获取父级分类数据
  getfcategorylist: local + '//articlecategory/getfcategorylist',
  // 删除文章分类
  delarticlecategory: local + '/articlecategory/delarticlecategory',
  // 文章分类保存接口
  savearticlecategory: local + '/articlecategory/savearticlecategory',
  //文章管理(获取文章列表)
  getarticlelist: local + '/article/getarticlelist',
  // 删除文章列表
  delarticle: local + '/article/delarticle',
  // 文章列表分类
  getfArticlecategorylist: local + '/article/getfArticlecategorylist',
  // 文章列表详细数据
  getbyidarticleinfo: local + '/article/getbyidarticleinfo',
  // 文章列表保存
  savearticle: local + '/article/savearticle',

  // 获取票务列表数据
  getticketlist: local + '/ticket/getticketlist',
  // 获取票务分类数据
  gettiketbycategory: local + '/ticket/gettiketbycategory',
  // 删除票务列表数据
  delticket: local + '/ticket/delticket',
  // 票务列表保存数据
  saveticket: local + '/ticket/saveticket',
  // 票务列表详情数据
  getbyidticketinfo: local + '/ticket/getbyidticketinfo',

  // 票务分类列表数据
  gettickecategorlist: local + '/ticketcategory/getticketcategorylist',
  // 票务分类父级数据
  getfticketlist: local + '/ticketcategory/getfticketlist',
  // 删除票务分类数据
  deltickecategor: local + '/ticketcategory/delticketcategory',
  // 票务分类保存数据
  saveticketcategory: local + '/ticketcategory/saveticketcategory',
  // 酒店详情信息
  getbyidhotelinfo: local + '/hotel/getbyidhotelinfo',
  // 删除酒店信息
  delhotel: local + '/hotel/delhotel',
  // 获取酒店信息
  gethotellist: local + '/hotel/gethotellist',
  // 保存酒店信息
  savehotel: local + '/hotel/savehotel',
  // 美食详情信息
  getbyidfoodinfo: local + '/food/getbyidfoodinfo',
  // 获取美食列表信息
  getfoodlist: local + '/food/getfoodlist',
  // 删除美食信息
  delfood: local + '/food/delfood',
  // 保存美食信息
  savefood: local + '/food/savefood',
  // 购物详情信息
  getbyidshoppinginfo: local + '/shopping/getbyidshoppinginfo',
  // 获取购物列表信息
  getshoppinglist: local + '/shopping/getshoppinglist',
  // 删除购物信息
  delshopping: local + '/shopping/delshopping',
  // 保存购物信息
  saveshopping: local + '/shopping/saveshopping',
  // 获取广告列表信息
  getadvertisinglist: local + '/advertising/getadvertisinglist',
  // 删除广告信息
  delAdvertising: local + '/advertising/delAdvertising',
  // 保存广告信息
  saveAdvertising: local + '/advertising/saveAdvertising',
  // 删除会员
  deluser: local + '/user/deluser',
  // 获取会员列表信息
  getuserlist: local + '/user/getuserlist',
  // 导游评论删除
  deltourguidecomment: local + '/tourguidecomment/deltourguidecomment',
  // 获取导游评论列表
  gettourtuidecommentlist: local + '/tourguidecomment/gettourtuidecommentlist',
  // 导游信息列表数据
  gettourguidelist: local + '/tourguide/gettourguidelist',
  // 导游信息删除
  deltourguide: local + '/tourguide/deltourguide',
  // 导游评论保存
  savetourguide: local + '/tourguide/savetourguide',
  // 导游详情信息
  getbyidtourguideinfo: local + '/tourguide/getbyidtourguideinfo',


  // 获取用户列表信息
  getmanageuserlist: local + '/manageuser/getmanageuserlist',
  // 删除用户信息
  delmanageuser: local + '/manageuser/delmanageuser',
  // 添加用户信息
  saveuserinfo: local + '/manageuser/saveuserinfo',
  
 
  
}
