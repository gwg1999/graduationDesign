import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes=[
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    // redirect: '/dashboard',
    children: [
      {
        // path: 'dashboard',
        path: '/',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/Slips',
    component: Layout,
    redirect: '/Slips/partSell',
    name: '销售',
    meta: { title: '销售', icon: 'el-icon-s-help',roles:['admin','editor'] },
    children: [
      {
        path: 'salesSlipManagement',
        name: '报价单管理',
        component: () => import('@/views/Slips/salesSlips/salesSlipManagement'),
        meta: { title: '报价单管理', icon: 'table' ,roles:['admin','editor']}
      },
      {
        path: 'salesSlipDetails',
        name: '报价单详情表',
        component: () => import('@/views/Slips/salesSlips/salesSlipDetails'),
        meta: { title: '报价单详情表', icon: 'tree',roles:['admin'] },
        hidden: true
      },
      {
        path: 'addSalesSlip',
        name: '新增报价单',
        component: () => import('@/views/Slips/salesSlips/addSlipsManagement/addSalesSlip'),
        meta: { title: '新增报价单', icon: 'tree' ,roles:['admin']},
        hidden: true
      },
      {
        path: 'serialNumberManagement',
        name: '序列号管理',
        component: () => import('@/views/Slips/princeSlips/serialNumber/serialNumberManagement'),
        meta: { title: '序列号管理', icon: 'tree' ,roles:['admin']},
        hidden: true
      },
      {
        path: 'addSalesSlipDetails',
        name: '新增报价单详情表',
        component: () => import('@/views/Slips/salesSlips/addSlipsManagement/addSalesSlipDetails'),
        meta: { title: '新增报价单详情表', icon: 'tree' ,roles:['admin']},
        hidden: true
      },
      {
        path: 'addSlipsDetailsGoods',
        name: '新增报价单零件',
        component: () => import('@/views/Slips/salesSlips/addSlips/addSlipsDetailsGoods'),
        meta: { title: '新增报价单零件', icon: 'tree' ,roles:['admin']},
        hidden: true
      },
      {
        path: 'princeSlipManagement',
        name: '销售单管理',
        component: () => import('@/views/Slips/princeSlips/princeSlipManagement'),
        meta: { title: '销售单管理', icon: 'tree',roles:['admin'] }
      },
      {
        path: 'princeSlipDetails',
        name: '销售单详情表',
        component: () => import('@/views/Slips/princeSlips/princeSlipDetails'),
        meta: { title: '销售单详情表', icon: 'tree',roles:['admin'] },
        hidden: true
      },
      {
        path: 'addPrinceSlip',
        name: '新增销售单',
        component: () => import('@/views/Slips/princeSlips/addSlipsManagement/addPrinceSlip'),
        meta: { title: '新增销售单', icon: 'table',roles:['admin'] },
        hidden: true
      },
      {
        path: 'addPrinceDetailsSlips',
        name: '新增销售单详情表',
        component: () => import('@/views/Slips/princeSlips/addSlipsManagement/addPrinceDetailsSlips'),
        meta: { title: '新增销售单详情表', icon: 'table',roles:['admin'] },
        hidden: true
      },

      {
        path: 'addSlips',
        name: '新增报价单',
        component: () => import('@/views/Slips/salesSlips/addSlips/addSlips'),
        meta: { title: '新增报价单', icon: 'table',roles:['admin'] },
        hidden: true
      },
      {
        path: 'addSlipsGoods',
        name: '新增报价单商品',
        component: () => import('@/views/Slips/salesSlips/addSlips/addSlipsGoods'),
        meta: { title: '新增报价单商品', icon: 'table',roles:['admin'] },
        hidden: true
      },
      {
        path: 'addSPriceSlips',
        name: '新增销售单',
        component: () => import('@/views/Slips/princeSlips/addPrice/addSPriceSlips'),
        meta: { title: '新增销售单', icon: 'table',roles:['admin'] },
        hidden: true
      },
      {
        path: 'addPriceGoods',
        name: '新增销售单商品',
        component: () => import('@/views/Slips/princeSlips/addPrice/addPriceGoods'),
        meta: { title: '新增销售单商品', icon: 'table',roles:['admin'] },
        hidden: true
      },

      // {
      //   path: 'minusSlipsDetails',
      //   name: '负数销售单详情表',
      //   component: () => import('@/views/Slips/princeSlips/minusSlipsManagement/minusSlipsDetails'),
      //   meta: { title: '负数销售单详情表', icon: 'table',roles:['admin'] },
      //   hidden: true
      // },
      {
        path: 'todayPriceSlips',
        name: '今日销售单',
        component: () => import('@/views/Slips/princeSlips/todayPriceSlips'),
        meta: { title: '今日销售单', icon: 'table',roles:['admin'] },
      },
      {
        path: 'addPriceDetailsGoods',
        name: '新增销售单商品',
        component: () => import('@/views/Slips/princeSlips/addPrice/addPriceDetailsGoods'),
        meta: { title: '新增销售单商品', icon: 'table',roles:['admin'] },
        hidden: true
      },
      {
        path: 'cancelSlipsManagement',
        name: '负数销售单',
        component: () => import('@/views/returnGood/cancelSlipManagement/cancelSlipsManagement'),
        meta: { title: '负数销售单', icon: 'table' ,roles:['admin','editor']}
      },
      {
        path: 'cancelSlipsDetails',
        name: '负数销售单详情表',
        component: () => import('@/views/returnGood/cancelSlipManagement/cancelSlipsDetails'),
        meta: { title: '负数销售单详情表', icon: 'table' ,roles:['admin','editor']},
        hidden: true
      },
      {
        path: 'printTable',
        name: '打印单',
        component: () => import('@/views/Slips/princeSlips/printTable/printTable'),
        meta: { title: '打印单', icon: 'table',roles:['admin'] },
        hidden: true
      },
      {
        path: 'extraPriceSlipsManagement',
        name: '其他费用',
        component: () => import('@/views/Slips/princeSlips/extraPriceSlips/extraPriceSlipsManagement'),
        meta: { title: '其他费用', icon: 'table',roles:['admin'] }
      }
    ]
  },
  {
    path: '/stock',
    component: Layout,
    name: '进货',
    meta: { title: '进货', icon: 'el-icon-s-shop' },
    children: [
      {
        path: '/stock',
        name: '询价单管理',
        component: () => import('@/views/stock/stock'),
        meta: { title: '询价单管理', icon: 'table' }
      },
      {
        path: '/stockAdd',
        name: '添加询价单',
        component: () => import('@/views/stock/stockAdd/stockAdd'),
        meta: { title: '添加询价单', icon: 'table' },
        hidden: true
      },
      {
        path: '/goodAdd',
        name: '添加零件或整件',
        component: () => import('@/views/stock/stockAdd/goodAdd'),
        meta: { title: '添加零件或整件', icon: 'table' },
        hidden: true
      },
      {
        path: '/stockAdd/detailAdd',
        name: '添加零件或整件',
        component: () => import('@/views/stock/stockAdd/addDetail'),
        meta: { title: '添加零件或整件', icon: 'table' },
        hidden: true
      },
      {
        path: '/showParts',
        name: '订单零件详情',
        component: () => import('@/views/stock/showParts'),
        meta: { title: '订单零件详情', icon: 'table' },
        hidden: true
      },
      {
        path: '/editStock',
        name: '询价单详情',
        component: () => import('@/views/stock/editStock'),
        meta: { title: '询价单详情', icon: 'table' },
        hidden: true
      },
      {
        path: '/stock/buy',
        name: '进货单管理',
        component: () => import('@/views/stock/buyList'),
        meta: { title: '进货单管理',  noCache: true,icon:'tree' }
      },
      {
        path: '/stock/addBuy',
        name: '新增进货单',
        component: () => import('@/views/stock/buyAdd/buyAdd'),
        meta: { title: '新增进货单',  noCache: true,icon:'tree' },
        hidden: true
      },
      {
        path: '/stock/goodAdd',
        name: '添加零件',
        component: () => import('@/views/stock/buyAdd/goodAdd'),
        meta: { title: '添加零件',  noCache: true,icon:'tree' },
        hidden: true
      },
      {
        path: '/stock/editBuy',
        name: '查看进货单详情',
        component: () => import('@/views/stock/editBuyList'),
        meta: { title: '查看进货单详情',  noCache: true,icon:'tree' },
        hidden: true
      },
      {
        path: '/stock/buyPartList',
        name: '查看进货单零件详情',
        component: () => import('@/views/stock/buyPartList'),
        meta: { title: '查看进货单零件详情',  noCache: true,icon:'tree' },
        hidden: true
      },
      {
        path: 'addPart',
        name: '增加零件',
        component: () => import('@/views/parts/addPart'),
        meta: { title: '增加零件',  noCache: true },
        hidden: true
      },
      {
        path: 'listPart/:parts',
        name: 'part',
        component: () => import('@/views/parts/editPart'),
        meta: { title: '修改零件信息',  noCache: true },
        hidden: true
      },
    ]
  },
  {
    path:'/memorandum',
    component: Layout,
    redirect: '/memorandum/memorandumManagement',
    name:'备忘录',
    meta:{title: '备忘录',icon: 'el-icon-s-help'},
    children:[
      {
        path: 'memorandumManagement',
        name: '备忘录管理',
        component: () => import('@/views/memorandum/memorandumManagement'),
        meta: { title: '备忘录管理', icon: 'table' ,roles:['admin','editor']}
      }
    ]
  },
  {
    path:'/returnGood',
    component: Layout,
    redirect: '/returnGood/cancelSlipsManagement',
    name:'退货',
    meta:{title: '退货',icon: 'el-icon-s-help'},
    children:[
      {
        path: 'cancelSlipsManagement',
        name: '销售单退货管理',
        component: () => import('@/views/returnGood/cancelSlipManagement/cancelSlipsManagement'),
        meta: { title: '销售单退货管理', icon: 'table' ,roles:['admin','editor']}
      },
      {
        path: 'cancelSlipsDetails',
        name: '销售单退货详情表',
        component: () => import('@/views/returnGood/cancelSlipManagement/cancelSlipsDetails'),
        meta: { title: '销售单退货详情表', icon: 'table' ,roles:['admin','editor']},
        hidden: true
      },
      {
        path: 'cancelStocksManagement',
        name: '进货单退货管理',
        component: () => import('@/views/returnGood/cancelStockManagement/cancelStocksManagement'),
        meta: { title: '进货单退货管理', icon: 'table' ,roles:['admin','editor']}
      },
      {
        path: 'cancelStocksDetails',
        name: '进货单退货详情表',
        component: () => import('@/views/returnGood/cancelStockManagement/cancelStocksDetails'),
        meta: { title: '进货单退货详情表', icon: 'table' ,roles:['admin','editor']},
        hidden: true
      },
      {
        path: 'addCancelPriceSlips',
        name: '新增销售单退货单',
        component: () => import('@/views/Slips/princeSlips/addSlipsManagement/addCancelPriceSlips'),
        meta: { title: '新增销售单退货单', icon: 'table' ,roles:['admin','editor']},
        hidden: true
      }
    ]
  },

  {
    path: '/parts',
    component: Layout,
    redirect: '/parts/part,',
    name: '仓库管理',
    meta: {
      title: '仓库管理',
      icon: 'nested'
    },
    children:  [
      {
        path: '/parts/part',
        name: '零件管理',
        component: () => import('@/views/parts/part'),
        meta: { title: '零件管理', icon: 'table' },

      },
      {
        path: '/parts/partAlert',
        name: '零件告警查询',
        component: () => import('@/views/parts/partAlert'),
        meta: { title: '零件告警查询', icon: 'table' },

      },
      {
        path: '/whole',
        name: '整件管理',
        component: () => import('@/views/whole/whole'),
        meta: { title: '整件管理', icon: 'table' },

      },
      {
        path: '/whole/partsWhole',
        name: '零件整件',
        component: () => import('@/views/parts/partsWhole'),
        meta: { title: '零件整件', icon: 'table' },
        hidden: true
      },


      {
        path: '/whole/addWhole',
        name: '添加整件',
        component: () => import('@/views/whole/addWhole'),
        meta: { title: '添加整件', icon: 'table' },
        hidden: true

      },
      {
        path: '/whole/editWhole',
        name: '查看整件',
        component: () => import('@/views/whole/editWhole'),
        meta: { title: '查看整件', icon: 'table' },
        hidden: true

      },
      {
        path: '/parts/editPart',
        name: '修改零件信息',
        component: () => import('@/views/parts/editPart'),
        meta: { title: '修改零件信息',  noCache: true,icon:'tree' },
        hidden: true
      },
      {
        path: '/parts/addPart',
        name: '增加零件',
        component: () => import('@/views/parts/addPart'),
        meta: { title: '增加零件',  noCache: true },
        hidden: true
      },
      {
        path: '/knowledge',
        name: '知识库管理',
        component: () => import('@/views/knowledgeBase/part'),
        meta: { title: '知识库管理',  icon:'tree',noCache: true },
      },
      {
        path: '/parts/damagePartsManagement',
        name: '坏件管理',
        component: () => import('@/views/parts/damageParts/damagePartsManagement'),
        meta: { title: '坏件管理', icon: 'table' },
      },
    ]
  },
  {
    path:'/productMaintain',
    component: Layout,
    name:'产品维护',
    meta:{title: '产品维护',icon: 'el-icon-s-promotion'},
    children: [
      {
        path:'/maintain/place',
        name: '产地或品牌维护',
        component: ()=> import('@/views/place/place'),
        meta: {title: '产地或品牌维护',icon: 'table'},
      },
      {
        path:'/maintain/place/addPlace',
        name: '添加产地或品牌',
        component: ()=> import('@/views/place/addPlace'),
        meta: {title: '添加产地或品牌',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/place/editPlace',
        name: '修改产地或品牌',
        component: ()=> import('@/views/place/editPlace'),
        meta: {title: '修改产地或品牌',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/unite',
        name: '零件属性单位维护',
        component: ()=> import('@/views/unit/unit'),
        meta: {title: '零件属性单位维护',icon: 'table'}
      },
      {
        path:'/maintain/returnCycle',
        name: '售后周期维护',
        component: ()=> import('@/views/returnCycle/returnCycle'),
        meta: {title: '售后周期维护',icon: 'table'}
      },
      {
        path:'/maintain/goodPosition',
        name:'目录维护',
        component: ()=> import('@/views/goodPosition/addGoodPosition'),
        meta:{title: '目录维护',icon: 'table'}
      }
    ]
  },
  {
    path:'/systemMaintain',
    component: Layout,
    name:'系统维护',
    meta:{title: '系统维护',icon: 'el-icon-s-promotion'},
    children: [
      {
        path:'/maintain/staff',
        name: '操作人员维护',
        component: ()=> import('@/views/staff/staff'),
        meta: {title: '操作人员维护',icon: 'table'}
      },
      {
        path:'/maintain/editStaff',
        name: '修改用户',
        component: ()=> import('@/views/staff/editStaff'),
        meta: {title: '修改用户',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/addStaff',
        name: '添加用户',
        component: ()=> import('@/views/staff/addStaff'),
        meta: {title: '添加用户',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/customer',
        name: '客户维护',
        component: ()=> import('@/views/customer/customer'),
        meta: {title: '客户维护',icon: 'table'}
      },
      {
        path:'/maintain/customer/customerAdd',
        name: '添加客户',
        component: ()=> import('@/views/customer/customerAdd'),
        meta: {title: '添加客户',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/customer/editCustomer',
        name: '修改客户信息',
        component: ()=> import('@/views/customer/editCustomer'),
        meta: {title: '修改客户信息',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/customer/staffList',
        name: '归属业务员详情',
        component: ()=> import('@/views/customer/staffList'),
        meta: {title: '归属业务员详情',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/customer/editStaffList',
        name: '修改归属业务员信息',
        component: ()=> import('@/views/customer/editStaffList'),
        meta: {title: '修改归属业务员信息',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/personalInformation',
        name: '个人信息维护',
        component: ()=> import('@/views/personalInformation/personalInformation'),
        meta: {title: '个人信息维护',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/factory',
        name: '厂家维护',
        component: ()=> import('@/views/factory/factory'),
        meta: {title: '厂家维护',icon: 'table'},
      },
      {
        path:'/maintain/factory/addFactory',
        name: '添加厂家',
        component: ()=> import('@/views/factory/addFactory'),
        meta: {title: '添加厂家',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/factory/editFactory',
        name: '修改厂家信息',
        component: ()=> import('@/views/factory/editFactory'),
        meta: {title: '修改厂家信息',icon: 'table'},
        hidden: true
      },

    ]
  },

  {
    path:'/account',
    component: Layout,
    redirect: '/account/accountManage',
    name:'账单',
    meta:{title: '账单',icon: 'el-icon-s-promotion'},
    children: [
      {
        path: 'accountManage',
        name: '销售账单',
        component: () => import('@/views/account/accountManage'),
        meta: { title: '销售账单', icon: 'table'}
      },
      {
        path: 'stockBillManage',
        name: '进货账单',
        component: () => import('@/views/account/stockBillManage'),
        meta: { title: '进货账单', icon: 'table'}
      }
    ]
  },

  {
    path: '/statistics',
    component: Layout,
    name: '账单统计',
    meta: {title: '账单统计', icon: 'el-icon-s-promotion'},
    children: [
      {
        path: 'otherCost',
        name: '额外费用统计',
        component: () => import('@/views/Statistics/otherCost'),
        meta: {title: '额外费用统计', icon: 'table'}
      },
      {
        path: 'accessorySell',
        name: '零件售出统计',
        component: () => import('@/views/Statistics/accessorySell'),
        meta: {title: '零件售出统计', icon: 'table'}
      },
      {
        path: 'accessoryStock',
        name: '零件进货统计',
        component: () => import('@/views/Statistics/accessoryStock'),
        meta: { title: '零件进货统计', icon: 'table'}
      }
    ]
  },

  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
