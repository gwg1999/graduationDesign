import request from '@/utils/request'
import qs from 'qs'
import {baseURL} from "@/api/http";
export default {
  queryAll(name,beginTime,endTime,createTimeSequence,endTimeSequence,pageNum,pageSize) {
    return request({
      baseURL:baseURL,
      url: '/quotation/getQuotation',
      method: 'post',
      params:{name,beginTime,endTime,createTimeSequence,endTimeSequence,pageNum,pageSize}
    })
  },
  queryAllDetails(qdOrderId,pName,qdType,pageNum,pageSize) {
    return request({
      baseURL:baseURL,
      url: '/quotationDetail/getQuotationDetail',
      method: 'post',
      params:{qdOrderId,pName,qdType,pageNum,pageSize}
    })
  },
  becomeOrder(oWarehouseOperaterId,qId,paymentWay,deliveryWay) {
    return request({
      baseURL:baseURL,
      url: '/quotation/becomeOrder',
      method: 'post',
      params:{oWarehouseOperaterId,qId,paymentWay,deliveryWay}
    })
  },
  deleteQuotation(qId) {
    return request({
      baseURL:baseURL,
      url: '/quotation/deleteQuotation',
      method: 'post',
      params:{qId}
    })
  },
  deleteQuotationDetail(qdId) {
    return request({
      baseURL:baseURL,
      url: '/quotationDetail/deleteQuotationDetail',
      method: 'post',
      params:{qdId}
    })
  }
}
