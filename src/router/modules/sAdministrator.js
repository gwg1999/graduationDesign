/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const sAdRouter = [
  // {
  //   path: '/components/submitPic',
  //   component: ()=> import('@/components/submitPic/submitPic'),
  //   hidden: true,
  //   name:'图片上传',
  //   meta: {title: '图片上传'}
  // },
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
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/partSell',
    name: '销售',
    meta: { title: '销售', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'partSell',
        name: '报价单管理',
        component: () => import('@/views/statistics/partSell'),
        meta: { title: '报价单管理', icon: 'table' }
      },
      {
        path: 'financeManagement',
        name: '销售单管理',
        component: () => import('@/views/statistics/financeManagement'),
        meta: { title: '销售单管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/11',
    component: Layout,
    redirect: '/parts/part',
    name: '进货',
    meta: { title: '进货', icon: 'el-icon-s-shop' },
    children: [
      {
        path: 'part',
        name: '询价单管理',
        component: () => import('@/views/parts/part'),
        meta: { title: '询价单管理', icon: 'table' }
      },
      {
        path: 'editPart/:parts',
        name: '进货单管理',
        component: () => import('@/views/parts/editPart'),
        meta: { title: '进货单管理',  noCache: true,icon:'tree' }
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
    path: '/11',
    component: Layout,
    redirect: '',
    name: '退货',
    meta: {title: '退货', icon: 'link'},
    children:[
      {
        path: '',
        name: '退货单管理',
        component: () => import('@/views/parts/part'),
        meta: {title: '退货单管理', icon: 'table'},
        children: [
          {
            path: 'part',
            name: '111',
            component: () => import('@/views/parts/part'),
            meta: {title: '111'},
            hidden: true
          }
        ]
      },
      {
        path: '',
        name: '退货单管理',
        component: () => import('@/views/parts/part'),
        meta: {title: '退货单管理', icon: 'table'},
        hidden: true
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    redirect: '/form/index',
    name:'客户账单',
    meta:{title: '客户账单', icon:'el-icon-menu'},
    children: [
      {
        path:'index',
        name:'账单管理',
        component: ()=> import('@/views/form/index'),
        meta: {title: '账单管理',icon: 'table'}
      },
      {
        path:'index',
        name:'挂账管理',
        component: ()=> import('@/views/form/index'),
        meta: {title: '挂账管理',icon: 'tree'}
      }
    ]

  },
  {
    path:'',
    component: Layout,
    redirect: '',
    name:'统计',
    meta:{title: '统计',icon: 'el-icon-s-promotion'},
    children: [
      {
        path:'',
        name: '额外费用统计',
        component: ()=> import('@/views/form/index'),
        meta: {title: '额外费用统计',icon: 'table'}
      },
      {
        path:'',
        name: '零件销售统计',
        component: ()=> import('@/views/form/index'),
        meta: {title: '零件销售统计',icon: 'table'}
      },
      {
        path:'',
        name: '零件进货统计',
        component: ()=> import('@/views/form/index'),
        meta: {title: '零件进货统计',icon: 'table'}
      },
      {
        path:'',
        name: '零件进销存统计',
        component: ()=> import('@/views/form/index'),
        meta: {title: '零件进销存统计',icon: 'table'}
      },
      {
        path:'',
        name: '财务支出统计',
        component: ()=> import('@/views/form/index'),
        meta: {title: '财务支出统计',icon: 'table'}
      },
      {
        path:'',
        name: '财务入账统计',
        component: ()=> import('@/views/form/index'),
        meta: {title: '财务入账统计',icon: 'table'}
      },
      {
        path:'',
        name: '客户偏好统计',
        component: ()=> import('@/views/form/index'),
        meta: {title: '客户偏好统计',icon: 'table'}
      },
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
        path:'/maintain/supplier',
        name: '供货商维护',
        component: ()=> import('@/views/supplier/supplier'),
        meta: {title: '供货商维护',icon: 'table'},
      },
      {
        path:'/maintain/supplier/addSupplier',
        name: '添加供应商',
        component: ()=> import('@/views/supplier/addSupplier'),
        meta: {title: '添加供应商',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/supplier/editSupplier',
        name: '修改供应商信息',
        component: ()=> import('@/views/supplier/editSupplier'),
        meta: {title: '修改供应商信息',icon: 'table'},
        hidden: true
      },
      {
        path:'/maintain/personalInformation',
        name: '个人信息维护',
        component: ()=> import('@/views/personalInformation/personalInformation'),
        meta: {title: '个人信息维护',icon: 'table'},
        hidden: true
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
        path:'/maintain/car',
        name: '车型号维护',
        component: ()=> import('@/views/car/car'),
        meta: {title: '车型号维护',icon: 'table'},
      },
      {
        path: '/maintain/car/addCar',
        name:'添加车型',
        component: () => import('@/views/car/addCar'),
        meta:{title: '添加车型'},
        hidden: true
      },
      {
        path: '/maintain/car/editCar',
        name:'修改车型信息',
        component: () => import('@/views/car/editCar'),
        meta:{title: '修改车型信息'},
        hidden: true
      },
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
        path: '/test',
        name:'测试组件',
        component: ()=>import('@/views/test/test'),
        meta: { title: '测试组件',  noCache: true }
      }

    ]
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default sAdRouter
