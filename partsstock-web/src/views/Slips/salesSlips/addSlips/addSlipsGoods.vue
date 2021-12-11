<template>
  <div class="app-container">
    <h2 style="text-align: center;">增加零件或整件</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写报价单信息" />
      <el-step title="添加零件或整件" />
      <!--      <el-step title="最终发布" />-->
    </el-steps>
<!--    查询表格数据-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative ">
      <el-form-item>
        <el-select   v-model="levelIV.qdType"   clearable placeholder="选择商品类型" style="width: 130px"  >
          <el-option :value="1" label="零件"/>
          <el-option :value="0" label="整件"/>
        </el-select>
      </el-form-item>
      <el-form-item   v-if="levelIV.qdType===1" style="width: 200px" >
        <el-input   v-model="levelIV.pNumber" placeholder="请输入零件号" ></el-input>
      </el-form-item>
      <el-form-item   v-if="levelIV.qdType===1" style="width: 200px" >
        <el-cascader
          placeholder="请选择零件类目"
          v-model="levelIV.pCategoryId"
          :props="{value:'name',label:'name'}"
          :show-all-levels="false"
          @change="queryGoods"
          clearable
          :options="levelIVDirectoryList"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data["name"] }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item   v-if="levelIV.qdType===1" style="width: 210px">
        <el-input v-model="levelIV.pName" placeholder="请输入零件名" ></el-input>
      </el-form-item>
      <el-form-item   v-if="levelIV.qdType===0" style="width: 210px">
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
              v-show="levelIV.qdType===1"
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
                数量:<el-input-number @keyup.116.native="searchList(scope.row.pId)" v-model = "scope.row.qdNumber"  size="small"></el-input-number>
              </el-form-item>
              <el-form-item>
                价格:<el-input  @keyup.native="scope.row.price = oninput(scope.row.price)" v-model = "scope.row.price" style="width: 150px;" size="small" ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-circle-plus" @click="addPart(scope.row)">添加</el-button>
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
<!--    整件添加表格-->
    <el-table use-virtual
              :data="wholeList"
              border
              v-show="levelIV.qdType===0"
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
            数量:<el-input-number @keyup.116.native="searchList(scope.row.wId)" v-model = "scope.row.qdNumber"  size="small"></el-input-number>
            价格:<el-input @keyup.native="scope.row.price = oninput(scope.row.price)" v-model = "scope.row.price" style="width: 150px;" size="small" ></el-input>
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
<!--    查看购买的零件或整件-->
    <el-dialog
      title="零件或整件"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-container>
        <el-main>
          <el-form :model="salesSlip" status-icon ref="salesSlip" label-width="100px" class="demo-ruleForm" >
            <div style="float: left;width: 40%" >
              <el-row :gutter="0" v-for="(item,index) in this.salesSlip.quotationDetailList" :key="index" style="margin-bottom: 10px">
                <el-col :span="12">
                  <el-tag>零件名:{{item.pName}}</el-tag>
                </el-col>
                <el-col :span="12"><el-tag>零件数量:{{item.qdNumber}}</el-tag></el-col>
              </el-row>
            </div>
            <div style="float: right;width: 50%">
              <el-row :gutter="0" v-for="(item,index) in this.salesSlip.wholeDetailsList" :key="index" style="margin-bottom: 10px">
                <el-col :span="12">
                  <el-tag>整件名:{{item.wName}}</el-tag>
                </el-col>
                <el-col :span="12"><el-tag>整件数量:{{item.qdNumber}}</el-tag></el-col>
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
import {levelIVDirectory, queryHistoryPrice} from "@/views/Slips/myApi";
import {PostData} from "@/api";
import {getTime,stopF5F6} from "@/views/Slips/myUtils"
import Cookie from "js-cookie";
export default {
  data() {
    return {
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
      salesSlip:{
        quotationDetailList:[],
        wholeDetailsList:[]
      }
    }
  },
  created() {
    this.salesSlip=this.$route.query.salesSlips
    this.getList()
    this.getPrince()
    stopF5F6()
  },
  methods: {
    searchList(pId){
      let customerId=this.$route.query.salesSlips.qCustomerId
      let type=this.levelIV.qdType
      queryHistoryPrice(customerId,pId,type).then(res=>
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
      this.$refs['salesSlip'].validate((valid) => {
        if (valid) {
          this.salesSlip.qOrderStatus = 0
          this.salesSlip.qCreatePeopleId = parseInt(Cookie.get('aId'))
          let qPrice = 0
          if(this.salesSlip.wholeDetailsList&&this.salesSlip.wholeDetailsList.length>0){
            this.salesSlip.wholeDetailsList.forEach((value)=>{
              value.pName=value.wName
              value.qdRealTimePrice=parseInt(value.price)
              value.qdPartsId=value.wId
            })
          }
          this.salesSlip.quotationDetailList=[...this.salesSlip.quotationDetailList,...this.salesSlip.wholeDetailsList]
          if(this.salesSlip.quotationDetailList&&this.salesSlip.quotationDetailList.length>0) {
            this.salesSlip.quotationDetailList.forEach((value) => {
              value.qdPartsSizeType=value.pPartsSizeType
              value.qdRealTimePrice=parseInt(value.price)
              let partPrince = parseInt(value.price)
              qPrice += partPrince * value.qdNumber
              value.qdCustomerId = this.salesSlip.qCustomerId
            })
            this.salesSlip.qPrice = qPrice
          }
          console.log(this.salesSlip)
          PostData('quotation/addQuotation',this.salesSlip)
            .then(res=>{
              this.$message({
                type:'success',
                message:'添加成功'
              })
              this.$router.push({path:'/Slips/salesSlipManagement'})
            }).catch(()=>{})
        } else {
          return false;
        }
      });
    },
    //添加零件
    addPart(item){
      let temp=Object.assign({},item)
      temp.qdType=this.levelIV.qdType
      if(temp.qdType===1){
        let flag=false
        if(temp.qdNumber&&temp.price){
          for(let part of this.salesSlip.quotationDetailList){
            if(item.pId===part.pId) {
              part.qdNumber += item.qdNumber
              part.price=item.price
              flag = true
              this.$message({
                message: '已修改零件数量',
                type: "success"
              })
            }
          }
          if(!flag){
            temp.qdPartsId=temp.pId+''
            this.salesSlip.quotationDetailList.push(temp)
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
        if(temp.qdNumber&&temp.price){
          console.log(item)
          for (let part of this.salesSlip.wholeDetailsList) {
            console.log(part)
            if (item.wId === part.wId) {
              part.qdNumber += item.qdNumber
              part.price=item.price
              flag = true
              this.$message({
                message: '已修改整件数量',
                type: "success"
              })
            }
          }
          if(!flag){
            temp.odPartsId=temp.wId
            this.salesSlip.wholeDetailsList.push(temp)
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
        if (this.levelIV.qdType === 1) {
          let levelIVCopy = {}
          if (typeof pageNum === "number") {
            this.levelIV.pageNum = pageNum
            levelIVCopy.pageNum = pageNum
            levelIVCopy = JSON.parse(JSON.stringify(this.levelIV))
            let categoryList = ""
            if (levelIVCopy.pCategoryId && levelIVCopy.pCategoryId.length > 0 && typeof levelIVCopy.pCategoryId != "string") {
              levelIVCopy.pCategoryId.forEach((item, index, array) => {
                if (array[index + 1]) {
                  categoryList += item + "/"
                } else {
                  categoryList += item
                }
              })
            }
            levelIVCopy.pCategoryId = categoryList
          } else {
            let categoryList = ""
            levelIVCopy = JSON.parse(JSON.stringify(this.levelIV))
            if (levelIVCopy.pCategoryId && levelIVCopy.pCategoryId.length > 0 && typeof levelIVCopy.pCategoryId != "string") {
              levelIVCopy.pCategoryId.forEach((item, index, array) => {
                if (array[index + 1]) {
                  categoryList += item + "/"
                } else {
                  categoryList += item
                }
              })
            }
            levelIVCopy.pCategoryId = categoryList
          }
          PostData('parts/selectAllByEnabled', levelIVCopy)
            .then(res => {
              console.log(res.list)
              let middleList = res.list
              this.total = res.total
              if (middleList && middleList.length > 0) {
                middleList.forEach(value => {
                  value.price = this.customerPrince === 0 ? value.pLowPrice : this.customerPrince === 1 ? value.pMiddlePrice : value.pHighPrice
                })
              }
              this.list = middleList
            })
        } else {
          PostData('/whole/selectAll', this.levelIV).then(res => {
            console.log(res)
            this.wholeList = res
          })
        }

    },
    getList(){
      levelIVDirectory().then(res=>{
        this.levelIVDirectoryList=res
      })
    },
    getPrince(){
      let query={
        cuId:this.$route.query.salesSlips.qCustomerId
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
        path: "/Slips/addSlips" ,
        query:{
          salesSlip:this.salesSlip
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
        console.log(str.indexOf("."))
        console.log(str.indexOf(".") + 1)
        let str_ = str.substr(str.indexOf(".") + 1);
        console.log(str_)
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
