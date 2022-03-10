import request from "@/utils/request";
import {baseURL} from "@/api/http";

export function getChargeList(chargeInfo){
  return request({
    baseURL:baseURL,
    url: '/bill/getChargeList',
    method: 'post',
    data:chargeInfo,
    header: {
      'Content-Type': 'application/json'
    }
  })
}
