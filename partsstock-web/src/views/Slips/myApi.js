import request from "@/utils/request";
import {handleArray} from "./myUtils"
import {PostData} from "@/api";

function queryAll(type=2,status=1) {
  return request({
    url: '/position/selectCatalogue',
    method: 'post',
    params:{type,status},

  })
}
export const levelIVDirectory=()=>{
  return new Promise(async (resolve,reject)=>{
    let levelIVDirectoryList=handleArray(await queryAll())
    resolve(levelIVDirectoryList)
  })
}
export const commonList=(url)=>{
  return new Promise(async resolve => {
    let promise=await PostData(url,{pageNum:0,pageSize:0})
    resolve(promise)
  })
}

export function queryPart(pId) {
  return request({
    url: '/parts/selectOne',
    method: 'post',
    params:{pId},
  })
}

export function querySerialNumber(querySerialNumber,pageNum,pageSize) {
  return request({
    url: '/order/getSerialNumber',
    method: 'post',
    data:querySerialNumber,
    params:{pageNum,pageSize},
  })
}
export function queryHistoryPrice(customerId,partsId,type) {
  return request({
    url: '/OrderDetail/getHistoryOrderDetail',
    method: 'post',
    params:{customerId,partsId,type},
  })
}
export function PurchasePrice(customerId,partsId,type){
  return request({
    url: '/stock/getHistoryStockDetail',
    method: 'post',
    params:{customerId,partsId,type}
  })
}
export function handlePackageGood(orderId,type,note){
  return request({
    url:'/upload/uploadOrderImage',
    method:'post',
    params:{orderId,type,note}
  })
}

//测试map和reduce
// export const levelIVDirec=()=>{
//   return new Promise(async (resolve,reject)=>{
//     let levelIVDirectoryList=handleArra(await queryAll())
//     resolve(levelIVDirectoryList)
//   })
// }
// levelIVDirec().then(res=>{
//   console.log(res)
// })
