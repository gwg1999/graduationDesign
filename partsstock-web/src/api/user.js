import request from '@/utils/request'
//
// export function login(data) {
//   return request({
//     //baseURL: `http://192.168.31.99:8080`,
//     baseURL: `http://192.168.31.136:8080`,
//     url:'/admin/login',
//     method: 'post',
//     data
//   })
// }
//
// export function getInfo(token) {
//   return request({
//     baseURL: `http://192.168.31.99:8080`,
//     url:'/admin/info',
//     method: 'get',
//     params: { token }
//   })
// }
//
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
