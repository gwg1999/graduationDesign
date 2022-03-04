import request from '@/utils/request'

export function logout() {
  return request({
    url: 'http://localhost:12000/admin/logout',
    method: 'post'
  })
}
