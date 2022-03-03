import request from "@/utils/request";

export function getReturnDetail(returnId,pageNum,pageSize) {
  return request({
    url: '/returnDetail/getReturnDetail',
    method: 'post',
    params:{returnId,pageNum,pageSize},

  })
}
