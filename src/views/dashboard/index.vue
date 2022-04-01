<template>
  <div class="dashboard-container">

    <el-descriptions style="margin-top: 20px;margin-left: 30px;margin-right: 30px" class="margin-top" :column="4" size="small" border v-model="topStatistic">
      <el-descriptions-item>
        <template slot="label" >
          今日销售额
        </template>
        {{topStatistic.todaySale}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          今日已入账
        </template>
        {{topStatistic.todayIn}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          今日退货额
        </template>
        {{topStatistic.todayStock}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          今日已支付
        </template>
        {{topStatistic.todayOut}}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          本月销售额
        </template>
        {{topStatistic.mouthSale}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          当月已入账
        </template>
        {{topStatistic.mouthIn}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          本月进货额
        </template>
        {{topStatistic.mouthStock}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          当月已支付
        </template>
        {{topStatistic.mouthOut}}
      </el-descriptions-item>
    </el-descriptions>

    <div style="float: left;width: 50%">
      <el-form :inline="true" class="demo-form-inline" style="position: relative;margin-left: 20px;margin-top: 20px ">
        <template slot-scope="scoped">
          <el-form-item>
            <el-select
              v-model="enquiryQuery.iFactoryId"
              ref="agentSelect"
              filterable clearable placeholder="请选择客户单位"
              :filter-method="factoryNameListFilter"
            >
              <el-option
                v-for="factory in factoryNameList"
                :key="factory.fId"
                :label="`${factory.fName}`"
                :value="factory.fId"/>
            </el-select>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查 询</el-button>
        </template>
      </el-form>

      <h3 style="margin: 0"> 采购列表</h3>
      <el-table use-virtual
                :data="enquiryList"
                border
                fit
                highlight-current-row
                style="width: 93%;left: 30px">
        <el-table-column
          label="序号"
          width="50%"
          align="center"
          type="index">
        </el-table-column>
        <el-table-column prop="factory.fName" label="工厂名" width="130px"  align="center"/>
        <el-table-column prop="iPrice" label="订单总价" width="170px"  align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" style="margin-right: 2%" @click="transOrder(scope.row)">转为进货单</el-button>
            <router-link :to="{path:'showParts',query:{iId:JSON.stringify(scope.row.iId),factoryId:scope.row.iFactoryId}}">
              <el-button type="primary" size="small" @click="">查看</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-divider direction="vertical"></el-divider>

    <div style="float: right;width: 50%">
      <el-form :inline="true" class="demo-form-inline" style="position: relative;margin-left: 20px;margin-top: 20px ">
        <el-form-item >
          <el-select v-model="queryMemorandum.status" clearable placeholder="是否解决"
                     @change="getList"
                     style=" margin-left: 10px;width: 150px"  >
            <el-option :value="0" label="未解决"/>
            <el-option :value="1" label="已解决"/>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getNoteList()">查 询</el-button>
        </el-form-item >
      </el-form>
      <h3 style="margin: 0">备忘录</h3>
      <el-table use-virtual
                :data="noteList"
                border
                fit
                highlight-current-row
                style="width: 90%;left: 35px">
        <el-table-column
          label="序号"
          width="50%"
          align="center"
          type="index">
        </el-table-column>
        <el-table-column prop="note" label="备注"  align="center" />
        <el-table-column label="状态" prop="status" width="80px" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status ===1">
              <span style="color:#00B46D">已解决</span>
            </span>
            <span v-else>
              <span style="color:#D75C89">未解决</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope" >
            <el-button   type="primary" size="mini" icon="el-icon-edit"  @click="openUpdateMemorandum(scope.row)">修改</el-button>
            <el-button   type="danger" size="mini" icon="el-icon-delete"  @click="deleteMemorandum(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    转进货单-->
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="60%">
      <el-form :model="buyList" ref="buyList" label-width="100px" class="demo-dynamic" :rules="rules">
        <el-form-item label="仓库管理员" prop="sWarehouseOperaterId">
          <el-select v-model="buyList.sWarehouseOperaterId" filterable placeholder="请选择" clearable>
            <el-option
              v-for="item in houseOperator"
              :key="item.aId"
              :label="item.aName"
              :value="item.aId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进货方式" prop="sBuyWay">
          <el-input  v-model="buyList.sBuyWay" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="应付款" prop="sPrice">
          <el-input @keyup.native="buyList.sPrice = oninput(buyList.sPrice )" v-model="buyList.sPrice" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="发票类型" prop="sInvoiceType">
          <el-select v-model="buyList.sInvoiceType"   clearable placeholder="发票类型" style="width: 200px"  >
            <el-option :value="0" label="无"/>
            <el-option :value="1" label="普通发票"/>
            <el-option :value="2" label="增值税发票"/>
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式" prop="sPaymentWay">
          <el-select v-model="buyList.sPaymentWay" filterable placeholder="请选择付款方式" clearable>
            <el-option
              v-for="item in spaymentWay"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="buyList.sNote" style="width: 60%"  rows="5" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm()">提 交</el-button>
  </span>
    </el-dialog>

    <!--修改备忘录-->
    <el-dialog :visible.sync="dialogMemorandumVisible" title="修改备忘录">
      <el-form :model="memorandumModify" label-width="120px" :rules="rules" ref="memorandumModify">
        <el-form-item label="选择创建人员" prop="operateId">
          <el-select v-model="memorandumModify.operateId" filterable placeholder="选择仓库管理员" >
            <el-option
              v-for="admin in adminList"
              :key="admin.aId"
              :label="admin.aName"
              :value="admin.aId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="解决状态" prop="status">
          <el-select v-model="memorandumModify.status" clearable placeholder="是否解决" style="width: 200px"  >
            <el-option :value="0" label="未解决"/>
            <el-option :value="1" label="已解决"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="memorandumModify.note" style="width: 90%" rows="5" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMemorandumVisible = false">取 消</el-button>
        <el-button :disabled="memorandumBtnDisabled" type="primary"
                   @click="UpdateMemorandum()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import adminDashboard from './admin'
import editorDashboard from './editor'
import qs from 'qs'
import {GetData, PostData} from "@/api";
import Cookie from "js-cookie";
import {getTime, reserveTime} from "@/views/Slips/myUtils";
import {commonList} from "@/views/Slips/myApi";

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      //顶边栏数据
      topStatistic:{},
      //询价单相关
      enquiryQuery:{
        pageSize: 10000,
        pageNum: 1
      },
      enquiryList:[],
      //备忘录相关
      queryMemorandum:{
        pageNum:1,
        pageSize:8
      },
      adminList:[],
      dialogMemorandumVisible:false,
      memorandumBtnDisabled:false,
      memorandumModify:{},
      noteList:[],
      //一键转进货单
      dialogVisible:false,
      buyList:{},
      houseOperator:[],
      spaymentWay:[
        {
          label:'挂账',
          value:'0'
        },
        {
          label:'线上',
          value:'1'
        },
        {
          label:'线下',
          value:'2'
        }
      ],
      //工厂列表
      factoryList:[],
      factoryNameList:[],
      rules:{
        sWarehouseOperaterId:[
          { required: true, message: '请输入选择仓库管理员', trigger: 'blur' }
        ],
        sPaymentWay:[
          {required:true,message:'请选择付款方式',trigger:'blur'}
        ],
        sBuyWay:[
          {required:true,message:'请输入进货方式',trigger:'blur'}
        ],
        sInvoiceType:[
          {required:true,message:'请选择发票类型',trigger:'blur'}
        ],
        note: [
          { required: true, message: '请选输入备注信息', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择备忘录状态', trigger: 'change' }
        ],
        operateId:[
          { required: true, message: '请选择备创建人员姓名', trigger: 'change' }
        ]
      },

    }
  },
  created() {
    this.getList()
    this.getNoteList()
    this.getCommon()
  },
  methods:{
    getCommon(){
      PostData('/factory/selectAllByLike',{pageSize:0,pageNum:0})
        .then(res=>{
          this.factoryList=res.list
        })

      GetData('admin/selectAdminByType',{type:4}).then(res=>{
        this.houseOperator=res
      })
      commonList('admin/selectAdmin').then(res=>{
        this.adminList=res
      })
    },
    //工厂过滤
    factoryNameListFilter(query = '') {
      if(query!==''){
        let PinyinMatch = this.$pinyinmatch;
        if (query) {
          let result = [];
          this.factoryList.forEach(i => {
            let m = PinyinMatch.match(i.fName, query);
            if (m) {
              result.push(i);
            }
          });
          if(result.length>10){
            this.factoryNameList = result.slice(0, 10);
          } else
          {
            this.factoryNameList=result
          }
        }
      }else {
        this.factoryNameList=[]
      }
    },
    //备忘录列表
    getNoteList(pageNum=1){
      if(this.queryMemorandum.createMemorandumTime){
        this.queryMemorandum.startCreateTime=reserveTime(this.queryMemorandum.createMemorandumTime[0])
        this.queryMemorandum.endCreateTime=reserveTime(this.queryMemorandum.createMemorandumTime[1])
      }else {
        this.queryMemorandum.startCreateTime=undefined
        this.queryMemorandum.endCreateTime=undefined
      }
      if(pageNum>1){
        this.queryMemorandum.pageNum=pageNum
      }
      else{
        this.queryMemorandum.pageNum=1
      }
      PostData('note/selectAllByLike',this.$qs.stringify(this.queryMemorandum))
        .then(res=>{
          res.list.forEach((value)=>{
            value.createTime=getTime(value.createTime)
          })
          this.noteList=res.list
        })
    },
    //询价单列表
    getList(){
      PostData('/statistics/getHomeData',{}).then(res=>{
        this.topStatistic=res
      })
      PostData('inquiry/queryInquiry',this.enquiryQuery)
        .then(res=>{
          this.enquiryList = res.list
        })
    },
    //一键转进货单
    transOrder(data){
      if(this.$refs['buyList']!==undefined){
        this.$refs['buyList'].resetFields()
      }
      this.buyList.iId=data.iId
      this.buyList.sFactoryId=data.iFactoryId
      this.buyList.sCreateOperatorId=data.iCreateOperatorId
      this.buyList.sIsPayment=0
      this.buyList.sStatus=1
      this.buyList.sType=2
      this.buyList.sOrderStatus=2
      this.buyList.sExistBill=0
      this.buyList.sCustomId=0
      this.buyList.sPrice=data.iPrice
      this.buyList=JSON.parse(JSON.stringify(this.buyList))
      this.dialogVisible=true
    },
    submitForm() {
      this.$refs['buyList'].validate((valid) => {
        if (valid) {
          console.log(this.buyList)
          PostData("inquiry/oneKeyConversionInquiry",this.buyList).then((res)=>{
            this.$message({
              message: '转换成功',
              type: 'success'
            });
            this.dialogVisible=false
            this.getList()
          })
        }
      });
    },
    //备忘录修改和删除
    openUpdateMemorandum(params){
      this.dialogMemorandumVisible=true
      if (this.$refs['memorandumModify'] !== undefined)
        this.$refs['memorandumModify'].resetFields();
      // params.operateId=params.admin.aName
      this.memorandumModify=JSON.parse(JSON.stringify(params))
    },
    UpdateMemorandum(){
      console.log(this.memorandumModify)
      this.memorandumModify.createTime=undefined
      this.$refs['memorandumModify'].validate((valid)=>{
        if(valid){
          PostData('note/update',this.memorandumModify)
            .then(res=>{
              this.$message({
                type:'success',
                message:'修改备忘录信息成功'
              })
              this.dialogMemorandumVisible=false
              this.getNoteList()
            })
        }
      })
    },
    deleteMemorandum(id){
      this.$confirm('是否将此备忘录信息删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        let Memorandum={}
        Memorandum.id=id
        PostData('note/delete',Memorandum)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除备忘录信息成功'
            })
            this.getNoteList()
          })
      })
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
.el-divider--vertical{
  display: inline-block;
  width:3px;
  height:100%;
  margin: 0 8px;
  position: absolute;
  left: 50%;
}
h3{
  text-align: center;
}
</style>
