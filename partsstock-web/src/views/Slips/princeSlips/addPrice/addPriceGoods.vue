<template>
  <div class="app-container">
    <h2 style="text-align: center;">增加零件或整件</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写报价单信息" />
      <el-step title="添加零件或整件" />
      <!--      <el-step title="最终发布" />-->
    </el-steps>
    <el-form :inline="true" class="demo-form-inline" style="position: relative ">
      <el-form-item>
        <el-select   v-model="levelIV.odType"   clearable placeholder="选择商品类型" style="width: 130px"  >
          <el-option :value="1" label="零件"/>
          <el-option :value="0" label="整件"/>
        </el-select>
      </el-form-item>
      <el-form-item   v-if="levelIV.odType===1" style="width: 200px" >
        <el-input   v-model="levelIV.pNumber" placeholder="请输入零件号" ></el-input>
      </el-form-item>
      <el-form-item   v-if="levelIV.odType===1" style="width: 200px" >
        <el-cascader
          placeholder="请选择零件类目"
          v-model="levelIV.pCategoryId"
          :props="{value:'name',label:'name'}"
          :show-all-levels="false"
          clearable
          @change="queryGoods"
          :options="levelIVDirectoryList"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data["name"] }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item   v-if="levelIV.odType===1" style="width: 210px">
        <el-input v-model="levelIV.pName" placeholder="请输入零件名" ></el-input>
      </el-form-item>
      <el-form-item   v-if="levelIV.odType===0" style="width: 210px">
        <el-input v-model="levelIV.wName" placeholder="请输入整件名" ></el-input>
      </el-form-item>
      <el-button  type="primary" style="position: absolute" icon="el-icon-search" @click="queryGoods">查询</el-button>
      <el-button type="primary" icon="el-icon-view" style="position: absolute;right: 100px" @click="showSelected">查看已选零件</el-button>
      <el-button @click="previous" type="primary" style="position: absolute;right: 10px">上一步</el-button>
      <!--      <el-button  type="primary" @click="next"  style="position: absolute;right: 10px;width: 100px">下一步</el-button>-->
    </el-form>

    <!-- 零件添加表格 -->
    <el-table use-virtual
              :data="list"
              border
              fit
              v-show="levelIV.odType===1"
              highlight-current-row
              style="width: 100%">
      <el-table-column
        label="序号"
        width="50%"
        align="center">
        <template slot-scope="scope">
          {{ (levelIV.pageNum - 1) * levelIV.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="pCategoryId" label="零件类目" width="50%" align="center" />
      <el-table-column prop="pNumber" label="零件号" width="50%" align="center" />
      <el-table-column prop="pName" label="零件名" width="140%" align="center" />
      <el-table-column prop="place.plName" label="产地或品牌" width="70%"  align="center"/>
      <el-table-column prop="factory.fName" label="厂家" width="60%"  align="center"/>
      <el-table-column prop="unit.uName" label="单位" width="40%" align="center"/>
      <!--      <el-table-column prop="pCarName" label="车属性" width="60%"  align="center"/>-->
      <el-table-column prop="pLowPrice" label="一级价格" width="50%"  align="center"/>
      <el-table-column prop="pMiddlePrice" label="二级价格" width="50%" align="center" />
      <el-table-column prop="pHighPrice" label="三级价格" width="50%"  align="center"/>
      <el-table-column prop="pBuyingPrice" label="进价" width="50%"  align="center"/>
      <!--      <el-table-column prop="pHighLimit" label="上限" width="50%"  align="center"/>-->
      <!--      <el-table-column prop="pLowLimit" label="下限" width="50%"  align="center"/>-->
      <el-table-column prop="pRealInventory" label="库存数" width="60%"  align="center"/>
      <!--      <el-table-column prop="pReturnCycle" label="退货周期（天）" width="60%"  align="center"/>-->
      <el-table-column prop="pId" label="零件数目和价格" align="center">
        <template slot-scope="scope">
          <el-form>
            <div style="display: flex;justify-content: space-evenly">
              <el-form-item>
                数量:<el-input-number @keyup.116.native="searchList(scope.row.pId)" v-model = "scope.row.odNumber"  size="small"></el-input-number>
              </el-form-item>
              <el-form-item>
                价格:<el-input  @keyup.native="scope.row.odRetailPrice = oninput(scope.row.odRetailPrice)" v-model = "scope.row.odRetailPrice" style="width: 150px;" size="small" ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-circle-plus" @click="addPart(scope.row)">添加</el-button>
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <!-- 整件添加表格 -->
    <el-table use-virtual
              :data="wholeList"
              border
              v-show="levelIV.odType===0"
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column
        label="序号"
        width="50%"
        align="center">
        <template slot-scope="scope">
          {{ (levelIV.pageNum - 1) * levelIV.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="wName" label="整件名" width="140px" align="center" />
      <el-table-column prop="wNumber" label="整件数量"  width="140px" align="center" />
      <el-table-column prop="wAlarmNumber" label="告警量"  width="140px" align="center" />
      <el-table-column prop="wId" label="零件数目和价格" align="center">
        <template slot-scope="scope">
          <div style="display: flex;justify-content: space-evenly">
            数量:<el-input-number  @keyup.116.native="searchList(scope.row.wId)"  v-model = "scope.row.odNumber"  size="small"></el-input-number>
            价格:<el-input @keyup.native="scope.row.odRetailPrice = oninput(scope.row.odRetailPrice)" v-model = "scope.row.odRetailPrice" style="width: 150px;" size="small" ></el-input>
            <el-button type="primary" icon="el-icon-circle-plus" @click="addPart(scope.row)">添加</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="levelIV.pageSize"
      :current-page="levelIV.pageNum"
      :total="total"
      style="padding: 30px 0; text-align: right;"
      @current-change="queryGoods"
    />
    <el-dialog
      title="零件或整件"
      :visible.sync="dialogVisible"
      width="65%"
    >
      <el-container>
        <el-main>
          <el-form :model="priceSlip" status-icon ref="priceSlip" label-width="100px" class="demo-ruleForm" >
            <div style="float: left;width: 55%" >
              <el-row :gutter="0" v-for="(item,index) in this.priceSlip.orderDetailList" :key="index" style="margin-bottom: 10px">
                <el-col :span="12">
                  <el-tag>零件名:{{item.pName}}</el-tag>
                </el-col>
                <el-col :span="12"><el-tag>零件数量:{{item.odNumber}}</el-tag></el-col>
              </el-row>
            </div>
            <div style="float: right;width: 45%">
              <el-row :gutter="0" v-for="(item,index) in this.priceSlip.wholeDetailsList" :key="index" style="margin-bottom: 10px">
                <el-col :span="10">
                  <el-tag>整件名:{{item.wName}}</el-tag>
                </el-col>
                <el-col :span="12"><el-tag>整件数量:{{item.odNumber}}</el-tag></el-col>
              </el-row>
            </div>
          </el-form>
        </el-main>
        <el-footer >
          <el-button style="margin-left:70% " @click="dialogVisible = false">取 消</el-button>
          <el-button style="margin-right:5% " type="primary" @click="submitForm">确 定</el-button>
        </el-footer>
      </el-container>
    </el-dialog>
    <!-- 历史价格 -->
    <el-dialog :visible.sync="dialogHistoryPrice"  title="历史价格" width="70%">
      <el-table
        :data="historyPriceList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (historyPage.pageNum - 1) * historyPage.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="odOrderId" label="订单ID"  align="center" />
        <el-table-column prop="odCustomerId" label="客户ID"  align="center" />
        <el-table-column prop="odPartsId" label="零件或整件ID"  align="center"/>
        <el-table-column prop="odType" label="类型"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odType===0?'整件':'零件'}}
          </template>
        </el-table-column>
        <el-table-column prop="odNumber" label="数量" align="center" />
        <el-table-column prop="odRetailPrice" label="价格"  align="center" />
        <el-table-column prop="odSizeType" label="零件大小"  align="center" >
        <template slot-scope="scope">
          {{ scope.row.odSizeType===0?'大':'小'}}
        </template>
       </el-table-column>
        <el-table-column prop="odCreateTime" label="创建时间"  align="center" />
        <el-table-column prop="odStatus" label="零件状态"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odStatus===0?'正常':scope.row.odStatus===1?'退货':'结束'}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>
<script>
import {levelIVDirectory,queryHistoryPrice} from "@/views/Slips/myApi";
import {getTime,stopF5F6} from "@/views/Slips/myUtils"
import {PostData} from "@/api";
import Cookie from "js-cookie";
export default {
  data() {
    return {
      //历史价格弹框
      dialogHistoryPrice:false,
      historyPage:{
        pageNum:1,
        pageSize:10
      },
      historyPriceList:[],
      whole:{},
      dialogVisible:false,
      customerPrince:null,
      wholeList:[],
      list:[],
      total:0,
      levelIV:{
        pageNum:1,
        pageSize:5
      },
      levelIVDirectoryList:[],
      priceSlip:{
        orderDetailList:[],
        wholeDetailsList:[]
      }

    }
  },
  created() {
    this.priceSlip=this.$route.query.priceSlip
    this.getList()
    this.getPrice()
    stopF5F6()
  },
  methods: {
    searchList(pId){
      this.dialogHistoryPrice=true
      let customerId=this.$route.query.priceSlip.oCustomerId
      let type=this.levelIV.odType
      let partsId=pId
      queryHistoryPrice(customerId,partsId,type).then(res=>
      {
        for (let i=0;i<res.length;i++){
          res[i].odCreateTime = getTime(res[i].odCreateTime)
        }
        this.historyPriceList=res
        if(this.historyPriceList&&this.historyPriceList.length>0){
          this.dialogHistoryPrice=true
        }else {
          this.$message({
            type:'info',
            message:"该客户还没有该订单的历史信息"
          })
        }
      })
    },
    showSelected(){
      this.dialogVisible=true
    },
    submitForm(){
      try {
        this.$refs['priceSlip'].validate((valid) => {
          if (valid) {
            this.priceSlip.oCustomerId=this.$route.query.priceSlip.oCustomerId
            this.priceSlip.qOrderStatus = 0
            this.priceSlip.oType=3
            this.priceSlip.oIsPackage=1
            this.priceSlip.oStatus=1
            this.priceSlip.oOrderClosingStatus=2
            this.priceSlip.oCreatePeopleId = parseInt(Cookie.get('aId'))
            if(this.priceSlip.wholeDetailsList&&this.priceSlip.wholeDetailsList.length>0){
              this.priceSlip.wholeDetailsList.forEach((value)=>{
                value.pName=value.wName
                value.odPartsId=value.wId
              })
            }
            this.priceSlip.orderDetailList=[...this.priceSlip.orderDetailList,...this.priceSlip.wholeDetailsList]
            let oSupposeIncome = 0
            for (let i = 0; i < this.priceSlip.orderDetailList.length; i++) {
              this.priceSlip.orderDetailList[i].odCustomerId = this.priceSlip.oCustomerId
              this.priceSlip.orderDetailList[i].odStatus=0
              this.priceSlip.orderDetailList[i].odSizeType= this.priceSlip.orderDetailList[i].pPartsSizeType
              let partPrince = this.priceSlip.orderDetailList[i].odRetailPrice
              oSupposeIncome += partPrince * this.priceSlip.orderDetailList[i].odNumber
            }
            this.priceSlip.oSupposeIncome = oSupposeIncome
            PostData('order/addOrder',this.priceSlip)
              .then(res=>{
                console.log(res)
                if (res.result === 'fails') {
                  res.lackPartList.forEach((value) => {
                    let number = null
                    number = +value.lackNumber - (2 * value.lackNumber)
                    alert('由于' + value.pName + '数量不足,添加销售单失败,目前' + value.pName + '的数量为'
                      + value.pRealInventory + '还缺少' + number)
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: '增加销售单成功'
                  })
                  this.$router.push({path:'/Slips/princeSlipManagement'})
                }
              }).catch(()=>{})

          } else {
            return false;
          }
        });
      }catch (e) {
      }finally {
        this.priceSlip.orderDetailList=[]
        this.priceSlip.wholeDetailsList=[]
      }
    },
    //添加零件
    addPart(item){
      let temp=Object.assign({},item)
      temp.odType=this.levelIV.odType
      if(temp.odType===1){
        let flag=false
        if(temp.odNumber&&temp.odRetailPrice){
          for(let part of this.priceSlip.orderDetailList){
            if(item.pId===part.pId) {
              part.odNumber += item.odNumber
              part.odRetailPrice=item.odRetailPrice
              flag = true
              this.$message({
                message: '已修改零件数量',
                type: "success"
              })
            }
          }
          if(!flag){
            temp.odPartsId=temp.pId
            this.priceSlip.orderDetailList.push(temp)
            this.$message({
              message:'已添加至已选零件库',
              type:"success"
            })
          }
        }
        else {
          this.$message({
            message:'请输入零件数量或价格',
            type:"warning"
          })
        }}
      else {
        let flag=false
        if(temp.odNumber&&temp.odRetailPrice){
          for (let part of this.priceSlip.wholeDetailsList) {
            if (item.wId === part.wId) {
              part.odNumber += item.odNumber
              part.odRetailPrice=item.odRetailPrice
              flag = true
              this.$message({
                message: '已修改整件数量',
                type: "success"
              })
            }
          }
          if(!flag){
            temp.odPartsId=temp.wId
            this.priceSlip.wholeDetailsList.push(temp)
            this.$message({
              message:'已添加至已选整件库',
              type:"success"
            })
          }
        }
        else {
          this.$message({
            message:'请输入整件数量或价格',
            type:"warning"
          })
        }
      }
    },
    //查询
    queryGoods(pageNum=1){
      if(this.levelIV.odType===1){
        let levelIVCopy={}
        if(typeof pageNum==="number"){
          this.levelIV.pageNum=pageNum
          levelIVCopy.pageNum=pageNum
          levelIVCopy=JSON.parse(JSON.stringify(this.levelIV))
          let categoryList=""
          if(levelIVCopy.pCategoryId &&levelIVCopy.pCategoryId.length>0&&typeof levelIVCopy.pCategoryId!="string") {
            levelIVCopy.pCategoryId.forEach((item, index, array) => {
              if (array[index + 1]) {
                categoryList += item + "/"
              } else {
                categoryList += item
              }
            })
          }
          levelIVCopy.pCategoryId=categoryList
        }else{
          let categoryList=""
          levelIVCopy=JSON.parse(JSON.stringify(this.levelIV))
          if(levelIVCopy.pCategoryId &&levelIVCopy.pCategoryId.length>0&&typeof levelIVCopy.pCategoryId!="string") {
            levelIVCopy.pCategoryId.forEach((item, index, array) => {
              if (array[index + 1]) {
                categoryList += item + "/"
              } else {
                categoryList += item
              }
            })
          }
          levelIVCopy.pCategoryId=categoryList
        }
        PostData('parts/selectAllByEnabled',levelIVCopy)
          .then(res=>{
            let middleList=res.list
            this.total=res.total
            if(middleList&&middleList.length>0){
              middleList.forEach(value => {
                value.odRetailPrice=this.customerPrince===0?value.pLowPrice:this.customerPrince===1?value.pMiddlePrice:value.pHighPrice
              })
            }
            this.list=middleList
          })
      }
      else {
        PostData('/whole/selectAll', this.levelIV).then(res => {
          this.wholeList=res
        })
      }
    },
    getList(){
      levelIVDirectory().then(res=>{
        this.levelIVDirectoryList=res
      })
    },
    getPrice(){
      let query={
        cuId:this.$route.query.priceSlip.oCustomerId
      }
      PostData('/customer/selectAllByLike',query).then(res=>{
        switch (res.list[0].cuDiscount){
          case "一级价格":
            this.customerPrince=0
            break;
          case "二级价格":
            this.customerPrince=1
            break;
          case "三级价格":
            this.customerPrince=2
            break;
        }
      })
    },
    previous() {
      this.$router.push({
        path: "/Slips/addSPriceSlips" ,
        query:{
          priceSlip:this.priceSlip
        }
      });
    },
    oninput(value) {
      let str = value;
      let len1 = str.substr(0, 1);
      let len2 = str.substr(1, 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
      }
      //第一位不能是.
      if (len1 == ".") {
        str = "";
      }
      if (len1 == "+") {
        str = "";
      }
      if (len1 == "-") {
        str = "";
      }

      //限制只能输入一个小数点
      if (str.indexOf(".") != -1) {
        let str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      //正则替换
      str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
      str = str.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, "$1"); // 小数点后只能输 2 位
      return str;
    }
  }
}
</script>
<style scoped>
.dialog-footer{
  padding: 0px;
  margin-bottom: 20px;
}
</style>
