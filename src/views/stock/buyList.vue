<template>
  <div class="app-container" style="background: white">
    <!--进货单-->
    <el-dialog
      title="进货单详情"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form  ref="oder" :model="order" label-width="120px" :rules="rules">
        <el-form-item label="操作员" prop="adminName">
          <el-input v-model="order.adminName" style="width: 300px" disabled/>
        </el-form-item>
        <el-form-item label="应付款" prop="sPrice">
          <el-input v-model="order.sPrice" style="width: 300px" disabled/>
        </el-form-item>
        <el-form-item label="是否已支付" prop="sIsPayment">
          <el-select v-model="order.sIsPayment" placeholder="选择订单状态" disabled>
            <el-option label="未支付" :value="0"></el-option>
            <el-option label="已支付" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="INote">
          <el-input  v-model="order.iNote" style="width: 400px" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('oder')">确 定</el-button>
  </span>
    </el-dialog>
    <!--    图片上传-->
    <el-dialog :visible.sync="receiveVisible" title="收货">
      <el-form :model="receiveGoods" label-width="120px" ref="PackageGoods">
        <el-form-item label="收货凭证上传">
          <el-upload
            ref="inUpload"
            :action="baseURL+'/upload/uploadStockImage?'+inPicture"
            class="upload-demo"
            accept="image/png,image/gif,image/jpg,image/jpeg"
            list-type="picture"
            :auto-upload="false"
            :limit=limitNum
            :before-upload="handleBeforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只支持格式为png,gif,jpg,jpeg的图片,且小于2MB</div>
            <el-dialog :visible.sync="selectedVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="receiveVisible = false">取 消</el-button>
        <el-button  type="primary"
                    @click="handleReceiveGoods">确 定</el-button>
      </div>
    </el-dialog>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">

        <el-form-item>
          <el-select
            v-model="buyQuery.SFactoryId"
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
          <el-autocomplete
            v-model="buyQuery.adminName"
            @change="handleOperator1($event)"
            :fetch-suggestions="querySearchAsync1"
            clearable
            placeholder="请输入操作员"
            :trigger-on-focus="false"
            @select="handleSelect2(buyQuery,$event)"
          >
          </el-autocomplete>
          <el-select v-model="buyQuery.SStatus" placeholder="请选择订单状态" style="margin-left: 3px" clearable>
            <el-option label="未收货" :value="1"></el-option>
            <el-option label="已收货" :value="2"></el-option>
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
        <!--        <template slot-scope="scope">-->
        <!--          {{ (adminQuery.pageNum - 1) * adminQuery.pageSize + scope.$index + 1 }}-->
        <!--        </template>-->
      </el-table-column>
      <el-table-column prop="factory.fName" label="工厂名" width="130"  align="center"/>
      <el-table-column prop="wareHouseName" label="仓库管理员" width="100" align="center" />
      <el-table-column prop="adminName" label="操作员" width="100" align="center" />
      <!--      <el-table-column prop="sOrderNumber" label="支付订单号" width="220%"  align="center"/>-->
      <!--      <el-table-column prop="sPaymentWay" label="付款方式" width="100%"  align="center"/>-->
      <!--      <el-table-column prop="sBuyWay" label="进货方式" width="100%"  align="center"/>-->
      <!--      <el-table-column prop="sInvoiceType" label="发票类型" width="80%"  align="center"/>-->
      <el-table-column prop="sIsPayment" label="是否已支付" width="80%"  align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.sIsPayment===0?'success':'danger'">
            {{scope.row.sIsPayment===0?'未支付':'已支付'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sPrice" label="应付款" width="90%"  align="center"/>
      <el-table-column prop="sStatus" label="订单状态" width="80%"  align="center">
        <template slot-scope="scope">
          {{oderStatus(scope.row.sStatus)}}
        </template>
      </el-table-column>
      <el-table-column label="进货零件" width="120" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:'/stock/buyPartList',query: {orderId:scope.row.sId,factoryId:scope.row.factoryId}}">
            <el-button type="primary">查看</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" width="230">
        <template slot-scope="scope">
          <div>
            <el-carousel trigger="click" height="200px" style="width: 200px">
              <el-carousel-item v-for="item in scope.row.stockPictures" :key="item.sId">
                <el-image :src="item.path"
                          :preview-src-list="[item.path]"
                          style="height:95%;width: 95%;padding-top: 2px;padding-left: 10px">
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" style="margin-right: 2%" @click="showDetails(scope.row)">修改</el-button>
          <el-button type="warning" icon="el-icon-edit" style="margin-right: 2%" @click="recGoods(scope.row)">收 货</el-button>

          <!--          <el-button type="danger" icon="el-icon-delete" circle @click="deleteOder(scope.row.sId)"></el-button>-->
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="buyQuery.pageSize"
      :current-page="buyQuery.pageNum"
      :total="pageTotal"
      style="padding: 30px 0; text-align: right;"
      @current-change="handlePageChange"
    />
  </div>
</template>
<script>
import {PostData} from "../../api/index"
import qs from 'qs'
import {baseURL} from "@/api/http";
export default {
  name: "staff",
  data(){//定义变量和初始值
    return{
      list: [], //查询之后接口返回集合
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      dialogImageUrl: '',
      receiveGoods:{},
      route:{
        name:'/showParts'
      },
      limitNum:1,
      baseURL:baseURL,
      receiveVisible:false,
      inPicPar:{
        stockId:-1,
        type:0
      },
      customerQuery:{},
      factoryQuery:{
        pageNum: 0,
        pageSize: 0
      },
      factoryNameList:[],
      factoryList:[],
      order: {
      },
      adminQuery:{
        pageNum: 0,
        pageSize: 0
      },
      adminList:[],
      rules:{
        sRealIncome:[
          { required: true, message: '请输入实收价', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '只能输入数字',trigger: "blur"}
        ],
        sIsPayment:[
          { required: true, message: '请选择支付状态', trigger: 'blur' }
        ],
        sType:[
          { required: true, message: '请选择进货单类型', trigger: 'blur' }
        ],
        sOrderStatus:[
          { required: true, message: '请选择订单状态', trigger: 'blur' }
        ],
      },
      dialogVisible:false,
      selectedVisible:false,
      buyQuery:{
        adminName:'',
        SStatus:null,
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
    this.getAdmins()
    this.getFactory()
  },
  computed:{
    inPicture(){
      return this.$qs.stringify(this.inPicPar)
    },
    sType(){
      return function (status){
        if(status===0){
          return '部分退货'
        }
        else if(status===1){
          return '全部退货'
        }
        else return '普通进货单'
      }
    },
    oderStatus(){
      return function (status){
        if(status===1){
          return '未收货'
        }
        else if(status===2) return '已收货'
      }
    }
  },
  resetData(){
    this.getList()
    // this.getPageTotal()
  },
  methods:{
    //工厂过滤的方法
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
        this.buyQuery.adminName=undefined
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
      console.log(event)
      this.buyQuery.adminName=event.aName
      this.getList()
    },

    //查询
    search(){
      this.buyQuery.pageNum=1
      this.getList()
    },
    //创建具体的方法
    getList() {
      PostData('/stock/queryStock',qs.stringify(this.buyQuery))
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },


    handleReceiveGoods(){
      this.$refs.inUpload.submit()
      PostData('stock/updateStock',{sId:this.inPicPar.stockId,sStatus:2}).then(res=>{
        this.receiveVisible=false
        this.$message({
          type: 'success',
          message: '收货成功'
        })
      })
      setTimeout(()=>{
        this.getList()
      },2000)
    },
    recGoods(data){
      this.inPicPar.stockId=data.sId
      this.receiveVisible=true
    },


    getFactory(){
      PostData('/factory/selectAllByLike',this.factoryQuery)
        .then(res=>{
          this.factoryList=res.list
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    handlePageChange(val){
      this.buyQuery.pageNum = val
      this.getList()
    },
    getAdmins(){
      PostData('admin/selectAllByLike',qs.stringify(this.adminQuery))
        .then(res=>{
          this.adminList = res.list
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    toInsert(){
      this.$router.push('/stock/addBuy')
    },
    handleBeforeUpload(file){
      if(!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片'
        })
      }
      let size = file.size / 1024 / 1024 / 2
      if(size > 2) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于2M'
        })
      }
    },
    handleRemove(file) {
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 跳转详情页
    showDetails(data){
      this.order=data
      this.dialogVisible=true
    },
    querySearch(queryString, cb) {
      this.customerQuery.cuUnitName=queryString;
      PostData('/customer/selectAllByLike',this.customerQuery).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.buyQuery.customerName=item.cuUnitName
    },
    deleteOder(id){
      this.deleteQuery.sId=id
      console.log(id);
      PostData('/inquiry/deleteInquiry',qs.stringify(this.deleteQuery)).then((res)=>{
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.getList()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/stock/updateStock',this.order)
            .then(res=>{
              this.$message({
                type:'success',
                message:'修改进货单成功'
              })
              this.dialogVisible=false
            }).catch(()=>{})
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
    },
  }
}
</script>
<style scoped>
.block{
  display: table-cell;
  text-align: center;
  vertical-align: middle
}
</style>
