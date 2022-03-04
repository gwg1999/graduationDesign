import request from '@/utils/request'
import {baseURL} from "@/api/http";
import qs from 'qs'
export default {
  queryAll(name,beginTime,endTime,createTimeSequence,endTimeSequence,pageNum,pageSize,isExistBill) {
    return request({
      baseURL:baseURL,
      url: '/order/getOrder',
      method: 'post',
      params:{name,beginTime,endTime,createTimeSequence,endTimeSequence,pageNum,pageSize,isExistBill}
    })
  },
  queryAllDetails(odOrderId,pName,odType,pageNum,pageSize) {
    return request({
      baseURL:baseURL,
      url: '/OrderDetail/getOrderDetail',
      method: 'post',
      params:{odOrderId,pName,odType,pageNum,pageSize}
    })
  },
  becomeQuotation(qId) {
    return request({
      baseURL:baseURL,
      url: '/order/becomeQuotation',
      method: 'post',
      params:{qId}
    })
  },
  deleteOrder(oId) {
    return request({
      baseURL:baseURL,
      url: '/order/deleteOrder',
      method: 'post',
      params:{oId}
    })
  },
  deleteOrderDetail(odId) {
    return request({
      baseURL:baseURL,
      url: '/OrderDetail/deleteOrderDetail',
      method: 'post',
      params:{odId}
    })
  }
}
