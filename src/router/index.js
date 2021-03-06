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
    path: '/homePage',
    component: Layout,
    redirect: '/homePage/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/index'),
        name: '??????',
        meta: { title: '??????', icon: 'dashboard', affix: true }
      }
    ]
  },

  {
    path: '/library',
    component: Layout,
    redirect: '/library/index',
    alwaysShow: true,
    name: 'Library',
    meta: {
      title: '?????????',
      icon: 'el-icon-reading'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/LibraryPage/libraryPage'),
        name: 'library',
        meta: {title:'???????????????',icon:'dashboard'}
      },
      {
        path: 'libraryReserve',
        hidden: true,
        component: () => import('@/views/LibraryPage/libraryReserve'),
        meta: {title: '???????????????', icon: 'dashboard'},
        name: 'libraryReserve'
      },
      {
        path: 'libraryReserveManage',
        hidden: true,
        component: () => import('@/views/LibraryPage/libraryReserveManage'),
        meta: {title: '?????????????????????', icon: 'dashboard'},
        name: 'libraryReserveManage',
      }
    ]
  },

  {
    path: '/personInfo',
    redirect: '/personInfo/index',
    component: Layout,
    hidden:true,
    name: 'PersonInfo',
    meta: {
      title: '????????????',
    },
    children: [
      {
        path: 'index',
        hidden: true,
        component: () => import('@/views/staffManage/PersonInfo'),
        meta: {title: '????????????', icon: 'dashboard'},
        name: 'personInfo',
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


]

export const asyncRoutes=[
  {
    path: '/security',
    component: Layout,
    redirect: '/security/index',
    alwaysShow: true,
    name: 'Security',
    meta: {
      title: '??????',
      icon: 'el-icon-warning-outline',
      roles: ['manager','teacher','student']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/managerPage/SecurityPage'),
        name: 'SecurityPage',
        meta: {title:'????????????',roles: ['manager']}
      },
      {
        path: 'submit',
        component: () => import('@/views/managerPage/submitSecurity'),
        name: 'submitSecurity',
        meta: {title:'????????????',roles: ['teacher','student']}
      }
    ]
  },

  {
    path: '/course',
    redirect: '/course/index',
    component: Layout,
    alwaysShow: true,
    name: 'course',
    meta: {
      title: '??????',
      icon: 'el-icon-s-grid',
      roles: ['teacher']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/course/index'),
        name: 'courseIndex',
        meta: {title: '??????'}
      }
    ]
  },

  {
    path: '/equipment',
    component: Layout,
    redirect: '/equipment/index',
    alwaysShow: true,
    name: 'equipment',
    meta: {
      title: '??????',
      icon: 'el-icon-printer',
      roles: ['manager','teacher']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/Equipment/EquipmentManage'),
        name: 'EquipmentPage',
        meta: {title:'??????'}
      },
      {
        path: 'info',
        component: () => import('@/views/Equipment/borrowRecord'),
        name: 'EquipmentInfo',
        hidden: true,
        meta: { title: '????????????'}
      }
    ]
  },
  {
    path: '/staffManage',
    component: Layout,
    redirect: '/staffManage/index',
    alwaysShow: true,
    name: 'staffManage',
    meta: {
      title: '????????????',
      icon: 'el-icon-user',
      roles: ['manager']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/staffManage/staffManage'),
        name: 'staffManage',
        meta: { title: '????????????'}
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/index',
    alwaysShow: true,
    name: 'report',
    meta: {
      title: '????????????',
      icon: 'el-icon-document',
      roles: ['teacher']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/reportCorrecting/index'),
        name: 'staffManage',
        meta: { title: '????????????'}
      }
    ]
  },
  {
    path: '/uploadReport',
    component: Layout,
    redirect: '/uploadReport/index',
    alwaysShow: true,
    name: 'uploadReport',
    meta: {
      title: '????????????',
      icon: 'el-icon-upload2',
      roles: ['student']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/reportCorrecting/uploadReport'),
        name: 'uploadReport',
        meta: { title: '????????????'}
      }
    ]
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
