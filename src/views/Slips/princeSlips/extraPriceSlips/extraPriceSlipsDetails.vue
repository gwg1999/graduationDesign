<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
        </el-form-item>
        <el-form-item style="position: absolute;right: 10px">
          <router-link :to="{path:'/Slips/extraPriceSlipsManagement'}">
            <el-button type="primary"
                       icon="el-icon-d-arrow-left" style="position: absolute;right: 10px">返回</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
    <div class="service-center">
      <el-table
        border
        :data="extraOrderList"
        @expand-change="expandChange($event)"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="extraOrderListChildren" border stripe style="width: 100%">
              <el-table-column prop="partName" label="名称" align="center"></el-table-column>
              <el-table-column prop="odType" label="类型" width="100px"  align="center">
                <template slot-scope="scope">
                  {{ scope.row.odType===0?'整件':'零件'}}
                </template>
              </el-table-column>
              <el-table-column prop="odSizeType" label="大小" width="100px"  align="center">
                <template slot-scope="scope">
                  {{ scope.row.odSizeType===0?'大':'小'}}
                </template>
              </el-table-column>
              <el-table-column prop="rdRetailPrice" label="单价" align="center"></el-table-column>
              <el-table-column prop="rdPartsNum" label="数量" align="center"></el-table-column>
              <!--            <el-table-column prop="odCreateTime" label="创建时间" align="center"></el-table-column>-->
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="customerUnitName" label="客户名称" align="center"></el-table-column>
        <el-table-column label="管理员名称" prop="operatorName" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="rCreateTime" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {GetData, PostData} from "@/api";
import {getTime} from "../../myUtils";
import princeSlips from "@/api/slips/princeSlips";
import returnGood from "@/api/returnGood/returnGood";
import {getReturnDetail} from "@/views/returnGood/myApi";
import qs from "qs";
export default {
  data(){
    return {
      queryPrinceSheet:{
        pageSize:10,
        pageNum:1
      },
      extraOrderList:[],
      extraOrderListChildren:[]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //获取额外订单信息列表
    getList(pageNum=1){
      this.pageNum=pageNum
      if(Number(this.$route.query.type)===2){
        returnGood.queryAll({rOrderType:0,rId:this.$route.query.orderId},this.pageNum,this.pageSize)
          .then(res=>{
            for (let listKey of res.list) {
              if(listKey.rId===this.$route.query.orderId){
                listKey.rCreateTime=getTime(listKey.rCreateTime)
                this.$set(this.extraOrderList, 0, listKey)
                break
              }
            }
            console.log(this.extraOrderList)
          })
      }else if(Number(this.$route.query.type)===0){
        princeSlips.queryAll(undefined,undefined
          ,undefined,0,
          0, 1,
          10000,0)
          .then(res=>{
            for (let listElement of res.list) {
              if(listElement.oId===this.$route.query.orderId){
                listElement.rCreateTime=getTime(listElement.oCreateTime)
                listElement.customerUnitName=listElement.customerName
                listElement.operatorName=listElement.createPeopleName
                // listElement.warehouseOperaterName=listElement.warehouseOperaterName
                this.$set(this.extraOrderList, 0, listElement)
                break
              }
            }
            console.log(this.extraOrderList)
          })
      }else{
        PostData('/stock/queryStock',qs.stringify({SId:this.$route.query.orderId,pageNum:1,pageSize: 10000}))
          .then(res=>{
            for (let listElement of res.list) {
              if(listElement.sId===this.$route.query.orderId){
                listElement.rCreateTime=getTime(listElement.sCreateTime)
                listElement.customerUnitName=listElement.wareHouseName
                listElement.operatorName=listElement.adminName
                this.$set(this.extraOrderList, 0, listElement)
                break
              }
            }
            console.log(this.extraOrderList)
          }).catch(err=>{
          this.$message.error(err.message);
        })
      }
    },
    expandChange(params){
      if(Number(this.$route.query.type)===2){
        getReturnDetail(params.rId,1,100000).then(res=>{
          this.extraOrderListChildren=res.list
          this.total=res.total
        })
      } else if(Number(this.$route.query.type)===0){
        this.queryPrinceSheet.odOrderId=this.$route.query.orderId
        princeSlips.queryAllDetails(this.queryPrinceSheet.odOrderId,this.queryPrinceSheet.pName,
          this.queryPrinceSheet.odType,this.queryPrinceSheet.pageNum,this.queryPrinceSheet.pageSize)
          .then(res=>{
            res.list.map((item)=>{
              item.odCreateTime=getTime(item.odCreateTime)
              item.rdRetailPrice=item.odNumber
              item.rdPartsNum=item.odRetailPrice
            })
            this.extraOrderListChildren=res.list
            console.log(this.extraOrderListChildren)
          })
      }else {
        PostData('/stock/queryStockDetail',qs.stringify({factoryId:this.extraOrderList[0].factory.fId,orderId:this.$route.query.orderId,pageNum:0,pageSize: 0})).then(ref=>{
          console.log(ref.list);
          ref.list.map((item)=>{
            item.odCreateTime=getTime(item.sdCreateTime)
            item.rdRetailPrice=item.sdNumber
            item.partName=item.sdPartsName
            item.odType=item.sdType
            item.rdPartsNum=item.sdPrice
            // item.odSizeType=
          })
          this.extraOrderListChildren=ref.list
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
