<template>
  <div class="app-container" style="background: white">
    <!--询价单-->
    <!--    转进货单-->
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
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
    <!--    修改-->
    <el-dialog
      title=""
      :visible.sync="dialogStockVisible"
      width="50%"
      :before-close="handleClose">
      <el-form ref="editModify" :model="editModify" label-width="120px">
        <div>
          <el-form-item label="工厂名称" prop="fName">
            <el-input v-model="editModify.fName" style="width: 200px" disabled/>
          </el-form-item>
          <el-form-item label="操作员" prop="adminName">
            <el-select v-model="editModify.iCreateOperatorId" style="margin-left: 3px;width: 200px"  placeholder="请选择操作员" clearable>
              <el-option v-for="item in adminList"  :key="item.aId" :label="item.aName" :value="item.aId" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总价格" prop="indPrice">
            <el-input v-model="editModify.iPrice" style="width: 200px" disabled/>
          </el-form-item>
          <el-form-item label="订单状态" prop="iStatus">
            <el-select v-model="editModify.iStatus" placeholder="选择订单状态" disabled>
              <el-option label="询价中" :value="0"></el-option>
              <el-option label="已询价" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="INote">
            <el-input  v-model="editModify.iNote"  rows="5" style="width: 400px" type="textarea"/>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogStockVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitUpdate()">提 交</el-button>
  </span>
    </el-dialog>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">
        <el-form-item>

          <el-select
            v-model="stockQuery.iFactoryId"
            ref="agentSelect"
            filterable clearable placeholder="请填写工厂名称"
            :filter-method="factoryNameListFilter"
            @hook:mounted="cancelReadOnly"
            @visible-change="cancelReadOnly"
          >
            <el-option
              v-for="factory in factoryNameList"
              :key="factory.fId"
              :label="`${factory.fName}`"
              :value="factory.fId"/>
          </el-select>

          <el-autocomplete
            v-model="stockQuery.adminName"
            @change="handleOperator1($event)"
            :fetch-suggestions="querySearchAsync1"
            clearable
            placeholder="请输入操作员"
            :trigger-on-focus="false"
            @select="handleSelect2(stockQuery,$event)"
          >
          </el-autocomplete>

          <el-select v-model="stockQuery.iStatus" style="margin-left: 3px" placeholder="请选择订单状态" clearable>
            <el-option label="询价中" :value="0"></el-option>
            <el-option label="已询价" :value="1"></el-option>
          </el-select>

        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查 询</el-button>
        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 10px" @click="toInsert()">添加</el-button>
      </template>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="序号"
        width="50%"
        align="center"
        type="index">
      </el-table-column>
      <el-table-column prop="factory.fName" label="工厂名" width="130"  align="center"/>
      <el-table-column prop="adminName" label="操作员" width="170%" align="center" />
      <el-table-column prop="iPrice" label="订单总价" width="170%"  align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.iPrice===0&&scope.row.iStatus===0">未报价</h3>
          <h3 v-else>{{scope.row.iPrice}}元</h3>
        </template>
      </el-table-column>
      <el-table-column prop="iStatus" label="订单状态" width="150%"  align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.iStatus === 1
                    ? 'success'
                    : scope.row.iStatus === 0
                    ? 'danger'
                    : ''
               "
          >{{scope.row.iStatus===1?'已询价':'询价中'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="询价零件" width="160%" align="center" prop="">
        <template slot-scope="scope">
          <router-link :to="{path:'showParts',query:{iId:JSON.stringify(scope.row.iId),factoryId:scope.row.iFactoryId}}">
            <el-button type="primary" size="mini" @click="">查看</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" slot="reference" @click="showDetails(scope.row)" style="margin-right: 2%">修改</el-button>
          <el-button  size="mini" type="primary" icon="el-icon-edit" style="margin-right: 2%" @click="transOrder(scope.row)">转为进货单</el-button>
          <el-button  size="mini" type="danger" icon="el-icon-delete" circle @click="deleteOder(scope.row.iId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="stockQuery.pageSize"
      :current-page="stockQuery.pageNum"
      :total="pageTotal"
      style="padding: 30px 0; text-align: right;"
      @current-change="handlePageChange"
    />
  </div>
</template>
<script>
import {GetData,PostData} from "../../api/index"
import qs from 'qs'
import Cookie from "js-cookie";
export default {
  name: "staff",
  data(){//定义变量和初始值
    return{
      //修改
      dialogStockVisible:false,
      editModify:{},

      dialogVisible:false,
      list: [], //查询之后接口返回集合
      buyList: {},
      houseOperator:[],
      houseOperatorQuery:{
        type:4
      },
      adminQuery:{
        pageNum: 0,
        pageSize: 0
      },
      adminList:[],
      customerQuery:{},
      oder: {
        customName:'',
        adminName:'',
        iPrice:'',
        iStatus:'',
        iNote:''
      },
      oldOder:{},
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
        sFactoryId:[
          {required:true,message:'请选择工厂',trigger:'blur'}
        ],
      },
      visible:false,
      spaymentWay:[
        {
          label:'线上',
          value:'1'
        },
        {
          label:'线下',
          value:'2'
        }
      ],
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      route:{
        name:'/showParts'
      },
      //工厂列表
      factoryNameList:[],
      factoryList:[],
      stockQuery:{
        adminName:'',
        iStatus:null,
        pageSize: 10,
        pageNum: 1
      },
      deleteQuery:{
        iId:-1
      },
      selectCondition: {},
      pageTotal: 0,
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
    this.getHouseOperator()
    this.getAdmins()
    this.getFactory()
  },
  resetData(){
    this.getList()
    // this.getPageTotal()
  },
  methods:{
    //ipad支持输入框
    cancelReadOnly(onOff) {
      this.$nextTick(() => {
        if (!onOff) {
          const Selects = this.$refs
          if (Selects.agentSelect) {
            const input = Selects.agentSelect.$el.querySelector('.el-input__inner')
            input.removeAttribute('readonly')
          }
        }
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
    //操作员模糊查询
    handleOperator1(event){
      if(event===''){
        this.stockQuery.adminName=undefined
        this.getList()
      }
    },
    querySearchAsync1(queryString, cb) {
      let adminQuery={}
      adminQuery.aName=queryString
      PostData('admin/selectAllByLike',qs.stringify(adminQuery)).then(res => {
        res.list.forEach((v)=>{
          v.value=v.aName
        })
        if(res.list.length>10) {
          res.list = res.list.slice(0, 10);
        }
        cb(res.list)
      })
    },
    handleSelect2(item,event) {
      this.stockQuery.adminName=event.aName
      this.getList()
    },



    //获得工厂列表
    getFactory(){
      PostData('/factory/selectAllByLike',{pageSize:0,pageNum:0})
        .then(res=>{
          this.factoryList=res.list
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    //创建具体的方法
    getList() {
      PostData('inquiry/queryInquiry',this.stockQuery)
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    getAdmins(){
      PostData('admin/selectAllByLike',qs.stringify(this.adminQuery))
        .then(res=>{
          this.adminList = res.list
          console.log("enter")
          console.log(res.list)
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    backPre(){
      this.$router.back()
    },
    showTest(data){
      console.log(data);
    },
    toInsert(){
      this.$router.push('/stockAdd')
    },
    // 分页处理
    handlePageChange(val){
      this.stockQuery.pageNum = val
      this.getList()
    },
    search(){
      this.stockQuery.pageNum=1
      this.getList()
    },
    editCancel(index,param){
      this.$confirm('是否将该用户'+(param.aIsEnable===0?'启用':'禁用')+'?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list[index].aIsEnable = 1 - this.list[index].aIsEnable
        PostData('admin/update',this.list[index])
          .then(res=>{
            this.getList()
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          })
      })
    },
    querySearch(queryString, cb) {
      this.customerQuery={
        cuUnitName:'',
        cuPhoneNumber:'',
        cuAddress:'',
        pageSize: 10,
        pageNum: 1,
      }
      this.customerQuery.cuUnitName=queryString;
      this.customerQuery.pageNum=1
      PostData('/customer/selectAllByLike',this.customerQuery).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.stockQuery.iCustomName=item.cuUnitName
    },
    getHouseOperator(){
      GetData('admin/selectAdminByType',this.houseOperatorQuery).then(res=>{
        console.log(res)
        this.houseOperator=res
      })
    },
    deleteOder(id){
      this.deleteQuery.iId=id
      console.log(id);
      PostData('/inquiry/deleteInquiry',qs.stringify(this.deleteQuery)).then((res)=>{
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.getList()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
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
      console.log(this.buyList)
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
    // 询价单修改
    showDetails(data){
      this.dialogStockVisible=true
      this.editModify=JSON.parse(JSON.stringify(data))
      this.editModify.fName=data.factory.fName
    },
    submitUpdate() {
      this.$refs['editModify'].validate((valid) => {
        if (valid) {
          PostData('inquiry/ediInquiry',this.editModify)
            .then(res=>{
              this.$message({
                type:'success',
                message:'修改成功'
              })
              this.dialogStockVisible=false
              this.getList()
            })
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

</style>
