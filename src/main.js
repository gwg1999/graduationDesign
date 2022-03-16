import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/common/css/global.scss'
import '@/styles/index.scss' // global css
import Echarts from "echarts"
import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import PinyinMatch from 'pinyin-match';
import * as filters from './filters' // global filters
import qs from 'qs'
// import plTable from 'pl-table'
//
// import 'pl-table/themes/index.css'
//
// import 'pl-table/themes/plTableStyle.css'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.prototype.$echarts=Echarts
Vue.prototype.$qs=qs
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
   // locale: zhLocale // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.$pinyinmatch = PinyinMatch;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
