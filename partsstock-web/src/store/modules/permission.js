import { asyncRoutes, constantRoutes } from '@/router'
// import sAdministrator from '../../router/modules/sAdministrator'
// import buyer from '../../router/modules/buyer'
// import sale from '../../router/modules/sale'
// import storeman from '../../router/modules/storeman'
// import Cookie from "js-cookie";
// import accounting from "@/router/modules/accounting";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
// function result(role){
//   if(role===0){
//     return sAdministrator
//   }
//   else if(role===1){
//     return sale
//   }
//   else if(role===2){
//     return buyer
//   }
//   else if(role===3){
//     return accounting
//   }
//   else {
//     return storeman
//   }
// }
// function getDTrouter(){
//   let role = Cookie.get("aPermission")
//   return result(parseInt(role))
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: constantRoutes,
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
