import request from '@/utils/request'
import {baseURL} from "@/api/http";
export default {
  queryAll(returnPoJo,pageNum,pageSize) {
    return request({
      baseURL:baseURL,
      url: '/return/getReturn',
      method: 'post',
      params:{pageNum,pageSize},
      data:returnPoJo,
    })
  },
  deleteReturnGood(rId) {
    return request({
      baseURL:baseURL,
      url: '/return/deleteReturn',
      method: 'post',
      params:{rId}
    })
  }
}
