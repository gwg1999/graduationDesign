import request from "@/utils/request";

export function getReturnDetail(returnId,pageNum,pageSize) {
  return request({
    url: '/returnDetail/getReturnDetail',
    method: 'post',
    params:{returnId,pageNum,pageSize},

  })
}
export function deleteSalesSlip(id) {
  return request({
    url: '/returnDetail/deleteReturnDetail',
    method: 'post',
    params:{id},

  })
}
export function deleteReturnGood(rId) {
  return request({
    url: '/return/deleteReturn',
    method: 'post',
    params:{rId},

  })
}
