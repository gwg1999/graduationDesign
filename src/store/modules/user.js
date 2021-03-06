import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Cookie from "js-cookie";

const state = {
  token: getToken(),
  name: 'admin',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  introduction: 'I am a super administrator',
  roles: [],
  info:{}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_INFO: (state, info) => {
    state.info = info
  }
}
import {PostData} from "../../api/index"

const actions = {
  // user login
  login({ commit,state }, userInfo) {
  //  const { aUsername, aPassword } = userInfo

    return new Promise((resolve, reject) => {
      PostData('user/login',userInfo).then(response => {
        // this.$router.replace('/')
        // console.log("enter login")
     // login({ aUsername: aUsername.trim(), aPassword: aPassword.trim()})
        this.roles = response.roles
        console.log('response')
        console.log(response)
        Cookie.set('aId',response.index)
        localStorage.setItem('id',response.index)
        // console.log('aId:'+response.aId)
        // console.log('response:'+response)
        commit('SET_INFO',response)
        // commit('SET_ROLES',['admin'])
        // commit('SET_ROLES',response.aPermission)
        if(this.roles.length===0){
          alert('账号或者密码错误，请重新输入')
          this.userInfo.aUsername = null
          this.userInfo.aPassword = null
        }
        // else if(this.roles.isDeleted===0){
        //   this.$message.warning('该账号已被注销')
        // }
        else{
          localStorage.setItem('ms_username',this.roles.aName)
          localStorage.setItem('adminId', this.roles.aId)
        }
        commit('SET_TOKEN', '')
        resetRouter()
        removeToken()
        if(response !== null) {
          commit('SET_TOKEN', response)
          setToken(response)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state }) {
   return new Promise((resolve, reject) => {
     PostData('/user/getInfo',{index: parseInt(localStorage.getItem('id'))}).then(res=>{
       let role = []
       role.push(res.roles)
       commit('SET_ROLES',role)
       resolve()
     }).catch(err=>{
       console.log(err)
       reject()
     })
     // getInfo(state.token).then(response => {
     //   const { data } = response
     //
     //   if (!data) {
     //     reject('Verification failed, please Login again.')
     //   }
     //
     //   const { roles, name, avatar, introduction } = data
     //
     //    // roles must be a non-empty array
     //   if (!roles || roles.length <= 0) {
     //     reject('getInfo: roles must be a non-null array!')
     //   }
     //
     //
     // }).catch(error => {
     //   reject(error)
     // })
   })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      console.log('set_roles')
      removeToken()
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = ['admin']
      //await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
