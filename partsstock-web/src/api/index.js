import request from "@/utils/request";
import {baseURL} from '@/api/http'

export const PostData = (url, body) =>{
  return request({
    // baseURL:`http://www.aishuhong.com:11509`,
    // baseURL:process.env.VUE_APP_BASE_API,
    baseURL:baseURL,
    url: url,
    method: 'post',
    data: body,
    dataType: "json",
    // withCredentials: true,
  })
}
export const GetData = (url, ...body) =>{
  return request({
    // baseURL:`http://www.aishuhong.com:11509`,
    // baseURL:process.env.VUE_APP_BASE_API,
    baseURL:baseURL,
    url: url,
    method: 'post',
    params:{...body[0]},
    dataType: "json",
    // withCredentials: true,
  })
}



