<template>
  <div >
    <el-container class="el-container" id="printJS-form">
      <el-header style="height: 130px">
        <el-form>
          <el-form-item>
            <h3 style="margin-top:5px;margin-bottom: 5px ">浙江汽配城翁氏汽配销售清单</h3>
          </el-form-item>
          <el-form-item>
            <h5 style="margin: 0;padding-right: 4px">开单日期:{{time}}</h5>
          </el-form-item>
          <el-form-item style="position: relative" :inline="true">
            <div style="position: absolute;left: 350px;">
              <h5 style="margin: 0;padding-right: 8px;width: 150px">发票号码(增、普):</h5>
            </div>
            <div style="position: absolute;left: 500px;">
              <div class="prat1"></div>
              <div class="prat1"></div>
              <div class="prat1"></div>
              <div class="prat1"></div>
              <div class="prat1"></div>
              <div class="prat1"></div>
              <div class="prat1"></div>
              <div class="prat1"></div>
              <div class="prat1"></div>
              <div class="prat1"></div>
            </div>
            <div style="position: absolute;left: 760px" >
              <h5 style="margin: 0px">NO:</h5>
            </div>
          </el-form-item>
        </el-form>
      </el-header>
      <el-footer style="height: 43px;margin:1px;padding: 0px">
        <el-form :model="printData" style="display: flex;flex-direction: row;justify-content:flex-start;border: 1px solid" label-width="100px">
          <el-form-item label="购货单位">
            {{printData.time}}
          </el-form-item>
          <el-form-item label="电话" style="margin-left: 100px">
            {{printData.time1}}
          </el-form-item>
          <el-form-item label="地址" style="margin-left: 100px">
            {{printData.time2}}
          </el-form-item>
        </el-form>
      </el-footer>
      <el-table
        class="exporttable"
        :data="princeSheetList"
        border
        :cell-style="{borderColor:'#000000'}"
        :header-cell-style="{borderColor:'#000000',paddingBottom:'1px'}"
        fit
        highlight-current-row
      >
        <el-table-column
          label="序号"
          width="57"
          align="center"
        >
          <template slot-scope="scope">
            {{ (queryPrinceSheet.pageNum - 1) * queryPrinceSheet.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="partName" label="零件中文名" width="338px"  align="center"/>
        <el-table-column prop="oIsPackage" label="车型号" width="148px" align="center"/>
        <el-table-column prop="oIsPackage" label="产地" width="110px" align="center"/>
        <el-table-column prop="oIsPackage" label="单位" width="55px" align="center"/>
        <el-table-column prop="odNumber" label="数量" width="69px" align="center"/>
        <el-table-column prop="odRetailPrice" label="单价" width="76px" align="center"/>
        <el-table-column prop="totalPrice" label="金额" width="79px" align="center">
          <template slot-scope="scope">
            {{ scope.row.odNumber*scope.row.odRetailPrice}}
          </template>
        </el-table-column>
        <el-table-column prop="oIsPackage" label="货位" width="94px" align="center"/>
      </el-table>
      <el-footer style="height: 43px;margin: 0;padding: 0;color: #000000">
        <el-form :model="printData" style="display: flex;flex-direction: row;justify-content:flex-start;border: 1px solid" label-width="80px">
          <el-form-item label="付款方式" >
            {{printData.time}}
          </el-form-item>
          <el-form-item label="制单" style="margin-left: 50px">
            {{printData.time}}
          </el-form-item>
          <el-form-item label="业务员"  style="margin-left: 70px">
            {{printData.time}}
          </el-form-item>
          <el-form-item label="发货" style="margin-left: 70px">
            {{printData.time}}
          </el-form-item>
          <el-form-item label="总计" style="margin-left: 70px">
            {{printData.time}}
          </el-form-item>
        </el-form>
      </el-footer>
      <el-footer style="height: 43px;margin: 0;padding: 0">
        <el-form :model="printData" style="display: flex;flex-direction: row;justify-content:flex-start;border: 1px solid" label-width="20px">
          <el-form-item>
            <el-row  style="padding: 0;margin-top: 5px;margin-bottom: 0">
              <el-col>
                <el-image :src="require('./background.jpg')" style="width: 60px;height: 60px"></el-image>
              </el-col>
            </el-row >
          </el-form-item>
          <el-form-item>
            <el-row  style="padding: 0;margin: 0">
              <el-col>
                数鸿科技全智能专业开发
              </el-col>
            </el-row>
            <el-row style="padding: 0;margin: 0">
              电话:
            </el-row>
          </el-form-item>
          <el-form-item  style="margin-left: 100px;border-left:1px solid #000000 ">
            <el-row  style="padding: 0;margin-top: 5px;margin-bottom: 0">
              地址:杭州新塘路汽配城305-309号  2102、2103、2105号    电话:86454348
            </el-row>
            <el-row style="padding: 0;margin: 0;text-align: center" >
              专营:自卸车配件
            </el-row>
          </el-form-item>
        </el-form>
      </el-footer>
    </el-container>
    <el-button size="small" plain type="primary" @click="CreateOneFormPage" style="margin-top: 100px">打印采购单</el-button>
  </div>
</template>

<script>
import print from 'print-js'
import {getTime} from "@/views/Slips/myUtils";
import "./background.jpg"
import princeSlips from "@/api/slips/princeSlips";
export default {
  name: "printTable",
  data(){
    return{
      printData:{},
      time:'',
      princeSheetList:[],
      queryPrinceSheet:{
        pageSize:1000,
        pageNum:1
      }
    }
  },
  created() {
    this.time=getTime(new Date())
  },
  methods:{
    printTables(){
        print({
          printable: 'printJS-form',
          type: 'html',
          // scanStyles: false,
          style: 'table tr td,th { border-collapse: collapse;padding: 0 10px;border:1px  solid}',
          targetStyles: ['*'],
          maxWidth:1100
        })
    },
     CreateOneFormPage(msg) {
      new Promise((resolve,reject)=>{
        this.printData=msg
        princeSlips.queryAllDetails(this.printData.oId,this.queryPrinceSheet.pName,
          this.queryPrinceSheet.odType,0,0)
          .then(res=>{
            this.princeSheetList=res.list
            resolve()
          })
      }).then(()=>{
        this.printTables()
      })
    },
  }
}
</script>

<style scoped>
.el-container{
  background-color: rgb(255,255,255);
}
.el-header {
  background-color: white;
  color: #333;
  text-align: center;
}
.el-main {
  color: #333;
  text-align: center;
  line-height: 20px;
  padding: 0 10px;
}
table tr td,th { border-collapse: collapse;padding: 0 0;border:1px  solid #000000}
.el-form .el-form-item{
  margin-bottom:5px;
  margin-top: 0 ;
}
/*小方框*/
.prat1{
  width: 20px;
  height: 20px;
  border: 1px solid #000000;
  float: left;
  margin-top: 7px;
}
.grid-content {

}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.el-footer-one{
  display: flex;
  flex-direction: row;
  justify-items: center;
}
.mySpan{
  margin-top: 20px;
}
.exporttable {
  border-left: 1px solid  #000000;
  color: #060606;
}
</style>
