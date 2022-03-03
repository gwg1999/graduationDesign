// /** When your routing table is too long, you can split it into small modules**/
//
// import Layout from '@/layout'
//
// const accountingRouter = [
//   // {
//   //   path: '/components/submitPic',
//   //   component: ()=> import('@/components/submitPic/submitPic'),
//   //   hidden: true,
//   //   name:'图片上传',
//   //   meta: {title: '图片上传'}
//   // },
//   {
//     path: '/redirect',
//     component: Layout,
//     hidden: true,
//     children: [
//       {
//         path: '/redirect/:path(.*)',
//         component: () => import('@/views/redirect/index')
//       }
//     ]
//   },
//   {
//     path: '/login',
//     component: () => import('@/views/login/index'),
//     hidden: true
//   },
//
//   {
//     path: '/',
//     component: Layout,
//     // redirect: '/dashboard',
//     children: [
//       {
//         // path: 'dashboard',
//         path: '/',
//         component: () => import('@/views/dashboard/index'),
//         name: '首页',
//         meta: { title: '首页', icon: 'dashboard', affix: true }
//       }
//     ]
//   },
//
//   {
//     path: '/statistics',
//     component: Layout,
//     redirect: '/statistics/partSell',
//     name: '销售',
//     meta: { title: '销售', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'partSell',
//         name: '报价单管理',
//         component: () => import('@/views/statistics/partSell'),
//         meta: { title: '报价单管理', icon: 'table' }
//       },
//       {
//         path: 'financeManagement',
//         name: '销售单管理',
//         component: () => import('@/views/statistics/financeManagement'),
//         meta: { title: '销售单管理', icon: 'tree' }
//       }
//     ]
//   },
//   {
//     path: '/11',
//     component: Layout,
//     redirect: '',
//     name: '退货',
//     meta: {title: '退货', icon: 'link'},
//     children:[
//       {
//         path: '',
//         name: '退货单管理',
//         component: () => import('@/views/parts/part'),
//         meta: {title: '退货单管理', icon: 'table'},
//         children: [
//           {
//             path: 'part',
//             name: '111',
//             component: () => import('@/views/parts/part'),
//             meta: {title: '111'},
//             hidden: true
//           }
//         ]
//       },
//       {
//         path: '',
//         name: '退货单管理',
//         component: () => import('@/views/parts/part'),
//         meta: {title: '退货单管理', icon: 'table'},
//         hidden: true
//       }
//     ]
//   },
//   {
//     path:'',
//     component: Layout,
//     redirect: '',
//     name:'统计',
//     meta:{title: '统计',icon: 'el-icon-s-promotion'},
//     children: [
//       {
//         path:'',
//         name: '额外费用统计',
//         component: ()=> import('@/views/form/index'),
//         meta: {title: '额外费用统计',icon: 'table'}
//       },
//       {
//         path:'',
//         name: '零件销售统计',
//         component: ()=> import('@/views/form/index'),
//         meta: {title: '零件销售统计',icon: 'table'}
//       },
//       {
//         path:'',
//         name: '零件进货统计',
//         component: ()=> import('@/views/form/index'),
//         meta: {title: '零件进货统计',icon: 'table'}
//       },
//       {
//         path:'',
//         name: '零件进销存统计',
//         component: ()=> import('@/views/form/index'),
//         meta: {title: '零件进销存统计',icon: 'table'}
//       },
//       {
//         path:'',
//         name: '财务支出统计',
//         component: ()=> import('@/views/form/index'),
//         meta: {title: '财务支出统计',icon: 'table'}
//       },
//       {
//         path:'',
//         name: '财务入账统计',
//         component: ()=> import('@/views/form/index'),
//         meta: {title: '财务入账统计',icon: 'table'}
//       },
//       {
//         path:'',
//         name: '客户偏好统计',
//         component: ()=> import('@/views/form/index'),
//         meta: {title: '客户偏好统计',icon: 'table'}
//       },
//     ]
//   },
//   {
//     path:'/productMaintain',
//     component: Layout,
//     name:'产品维护',
//     meta:{title: '产品维护',icon: 'el-icon-s-promotion'},
//     children: [
//       {
//         path:'/maintain/car',
//         name: '车型号维护',
//         component: ()=> import('@/views/car/car'),
//         meta: {title: '车型号维护',icon: 'table'},
//       },
//       {
//         path: '/maintain/car/addCar',
//         name:'添加车型',
//         component: () => import('@/views/car/addCar'),
//         meta:{title: '添加车型'},
//         hidden: true
//       },
//       {
//         path: '/maintain/car/editCar',
//         name:'修改车型信息',
//         component: () => import('@/views/car/editCar'),
//         meta:{title: '修改车型信息'},
//         hidden: true
//       },
//       {
//         path:'/maintain/place',
//         name: '产地或品牌维护',
//         component: ()=> import('@/views/place/place'),
//         meta: {title: '产地或品牌维护',icon: 'table'},
//       },
//       {
//         path:'/maintain/place/addPlace',
//         name: '添加产地或品牌',
//         component: ()=> import('@/views/place/addPlace'),
//         meta: {title: '添加产地或品牌',icon: 'table'},
//         hidden: true
//       },
//       {
//         path:'/maintain/place/editPlace',
//         name: '修改产地或品牌',
//         component: ()=> import('@/views/place/editPlace'),
//         meta: {title: '修改产地或品牌',icon: 'table'},
//         hidden: true
//       },
//       {
//         path:'/maintain/factory',
//         name: '厂家维护',
//         component: ()=> import('@/views/factory/factory'),
//         meta: {title: '厂家维护',icon: 'table'},
//       },
//       {
//         path:'/maintain/factory/addFactory',
//         name: '添加厂家',
//         component: ()=> import('@/views/factory/addFactory'),
//         meta: {title: '添加厂家',icon: 'table'},
//         hidden: true
//       },
//       {
//         path:'/maintain/factory/editFactory',
//         name: '修改厂家信息',
//         component: ()=> import('@/views/factory/editFactory'),
//         meta: {title: '修改厂家信息',icon: 'table'},
//         hidden: true
//       },
//       {
//         path:'/maintain/unite',
//         name: '零件属性单位维护',
//         component: ()=> import('@/views/unit/unit'),
//         meta: {title: '零件属性单位维护',icon: 'table'}
//       },
//       {
//         path:'/maintain/car',
//         name: '车型号维护',
//         component: ()=> import('@/views/car/car'),
//         meta: {title: '车型号维护',icon: 'table'},
//       },
//       {
//         path:'/maintain/category',
//         name: '四级类目维护',
//         component: ()=> import('@/views/levelCategory/levelCategory'),
//         meta: {title: '四级类目维护',icon: 'table'},
//       },
//
//     ]
//   },
//
//   {
//     path: '/404',
//     component: () => import('@/views/error-page/404'),
//     hidden: true
//   },
//   {
//     path: '/401',
//     component: () => import('@/views/error-page/401'),
//     hidden: true
//   },
//
//   { path: '*', redirect: '/404', hidden: true }
// ]
//
// export default accountingRouter
