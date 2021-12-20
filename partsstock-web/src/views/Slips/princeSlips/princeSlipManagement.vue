<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
          <el-input v-model="queryPrinceSheet.name"  clearable placeholder="客户名称" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            v-model="queryPrinceSheet.princeCreateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="销售单创建时间开始日期"
            end-placeholder="销售单创建时间结束日期"
            style="width: 420px">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList(1)">查 询</el-button>
        <router-link to="/Slips/addSPriceSlips">
          <el-button type="primary"
                     icon="el-icon-circle-plus" style="position: absolute;right: 10px">添加</el-button>
        </router-link>
      </el-form>
      <!--      销售单管理列表-->
      <el-table
        :data="princeSheetList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            {{ (queryPrinceSheet.pageNum - 1) * queryPrinceSheet.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column type="expand" label="详情" width="60px">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" label-width="150px" :label-position="right">
              <el-form-item label="创建人员:">
                <span>{{ props.row.createPeopleName }}</span>
              </el-form-item>
              <el-form-item label="仓库操作人员:">
                <span>{{ props.row.warehouseOperaterName }}</span>
              </el-form-item>
              <el-form-item label="应收价:">
                <span>{{ props.row.oSupposeIncome }}</span>
              </el-form-item>
              <el-form-item label="实收价:">
                <span>{{ props.row.oRealIncome }}</span>
              </el-form-item>
              <el-form-item label="支付方式:">
                <span>{{ props.row.oPaymentWay }}</span>
              </el-form-item>
              <el-form-item label="发货方式:">
                <span>{{ props.row.oDeliveryWay }}</span>
              </el-form-item>
              <el-form-item label="发票类型:">
                <span>{{ props.row.oInvoiceTypeId===0?'无':props.row.oInvoiceTypeId===1?'普通发票':'增值税发票' }}</span>
              </el-form-item>
              <el-form-item label="备忘录:">
                <span>{{ props.row.oNote }}</span>
              </el-form-item>
              <el-form-item label="客户其他费用总金额:">
                <span>{{ props.row.oOtherCostMoney }}</span>
              </el-form-item>
              <el-form-item label="支付订单编号:">
                <span>{{ props.row.oOrderNumber }}</span>
              </el-form-item>
              <el-form-item label="打包图片:">
                <div class="demo-image__placeholder">
                  <div class="block">
                    <el-image  :src="props.row.packageUrl" style="height: 150px;width: 100%;padding-top: 10px;padding-left: 90px">
                      <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                      </div>
                    </el-image>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="发货图片:">
                <div class="demo-image__placeholder">
                  <div class="block">
                    <el-image :src="props.row.deliverUrl" style="height: 150px;width: 100%;padding-top: 10px;padding-left: 90px">
                      <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                      </div>
                    </el-image>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户" width="80px" align="center" />
        <el-table-column prop="oCreateTime" label="创建时间"  width="100px"   align="center"/>
        <el-table-column prop="oResultTime" label="发货时间" width="100px"  align="center"/>
        <el-table-column prop="oIsPackage" label="是否打包" width="80px" align="center">
          <template slot-scope="scope">
            {{ scope.row.oIsPackage===0?'打包':'未打包'}}
          </template>
        </el-table-column>
        <el-table-column prop="oStatus" label="订单状态" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.oStatus===1?'未发货':'已发货'}}
          </template>
        </el-table-column>
        <el-table-column label="详情表信息"  align="center" width="120px">
          <template slot-scope="scope">
            <router-link :to="{path:'/Slips/princeSlipDetails',query:{oId:scope.row.oId,oStatus:scope.row.oStatus,oCustomerId:scope.row.oCustomerId}}">
              <el-button type="primary" size="mini" icon="el-icon-edit">查看详情</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <!--            <el-button type="primary" size="mini" icon="el-icon-edit" @click="InverseSales(scope.row.oId)">转成报价单</el-button>-->
            <router-link :to="{path:'/returnGood/addCancelPriceSlips',query:{row:scope.row}}" style="margin-right: 10px">
              <el-button v-if="scope.row.isReturn===1" type="primary" size="mini" icon="el-icon-edit" >退货</el-button>
            </router-link>
            <el-button  type="primary" size="mini" icon="el-icon-bottom" @click="openPackageGood(scope.row.oId)">{{scope.row.oIsPackage===0?'已打包':'打包'}}</el-button>
            <el-button :disabled="scope.row.oIsPackage===1||scope.row.oStatus===0" type="primary" size="mini" icon="el-icon-bottom" @click="openDeliverGood(scope.row.oId)">{{scope.row.oStatus===1?'发货':'已发货'}}</el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="!(scope.row.oIsPackage===1&&scope.row.oStatus===1)"  @click="openUpdatePrinceSlips(scope.row)">修改</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deletePrinceSlips(scope.row.oId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      修改销售单弹框-->
      <el-dialog :visible.sync="dialogPrinceSheetFormVisible" title="修改销售单">
        <el-form :model="princeSheetModify" label-width="120px" :rules="rules" ref="princeSheetModify">
          <el-form-item label="发票类型" prop="oInvoiceTypeId">
            <el-select v-model="princeSheetModify.oInvoiceTypeId"  clearable  placeholder="发票类型" style="width: 200px"  >
              <el-option :value="0" label="无"/>
              <el-option :value="1" label="普通发票"/>
              <el-option :value="2" label="增值税发票"/>
            </el-select>
          </el-form-item>
          <el-form-item label="发货方式" prop="oDeliveryWay">
            <el-select v-model="princeSheetModify.oDeliveryWay" clearable  placeholder="发货方式" style="width: 200px"  >
              <el-option value="线下交易" label="线下交易"/>
              <el-option value="快递" label="快递"/>
              <el-option value="托运" label="托运"/>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式" prop="oPaymentWay">
            <el-select v-model="princeSheetModify.oPaymentWay"   clearable placeholder="支付方式" style="width: 200px"  >
              <el-option value="挂账" label="挂账"/>
              <el-option value="线下" label="线下"/>
              <el-option value="线上" label="线上"/>
            </el-select>
          </el-form-item>
          <el-form-item label="其他费用">
            <el-input @keyup.native="princeSheetModify.oOtherCostMoney = oninput(princeSheetModify.oOtherCostMoney)" v-model="princeSheetModify.oOtherCostMoney"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPrinceSheetFormVisible = false">取 消</el-button>
          <el-button :disabled="princeSheetBtnDisabled" type="primary"
                     @click="updatePrinceSlips()">确 定</el-button>
        </div>
      </el-dialog>
      <!--      发货弹框-->
      <el-dialog :visible.sync="dialogDeliverGoodsVisible" title="发货">
        <el-form :model="DeliverGoods" label-width="120px" :rules="rules" ref="DeliverGoods">
          <el-form-item label="发货单上传">
            <el-upload
              ref="inDownload"
              :action="baseURL+'/upload/uploadOrderImage?'+DeliverPicture"
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
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="DeliverGoods.note" style="width: 90%" rows="5" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDeliverGoodsVisible = false">取 消</el-button>
          <el-button  type="primary"
                      @click="handleDeliverGoods">确 定</el-button>
        </div>
      </el-dialog>
      <!--      打包弹框-->
      <el-dialog :visible.sync="dialogPackageGoodsVisible" title="打包">
        <el-form :model="PackageGoods" label-width="120px" :rules="rules" ref="PackageGoods">
          <el-form-item label="打包单上传">
            <el-upload
              ref="inUpload"
              :action="baseURL+'/upload/uploadOrderImage?'+inPicture"
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
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="PackageGoods.note" style="width: 90%" rows="5" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPackageGoodsVisible = false">取 消</el-button>
          <el-button  type="primary"
                      @click="handlePackageGoods">确 定</el-button>
        </div>
      </el-dialog>
      <!--      分页-->
      <el-pagination
        :current-page="queryPrinceSheet.pageNum"
        :page-size="queryPrinceSheet.pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>
  </div>
</template>

<script>
import princeSlips from "@/api/slips/princeSlips";
import {PostData} from "@/api";
import {getTime} from "../myUtils"
import {twoPoint} from "@/views/Slips/ruleNumber";
import {baseURL} from "@/api/http";
export default {
  data(){
    return{
      inPicPar:{},
      DeliverPicPar:{},
      //图片上传
      limitNum:1,
      baseURL:baseURL,
      //打包
      dialogPackageGoodsVisible:false,
      PackageGoods:{},
      //图片上传
      dialogImageUrl: '',
      dialogVisible: false,
      //发货弹框
      dialogDeliverGoodsVisible:false,
      DeliverGoods:{},
      //退货弹框
      dialogDetailsVisible:false,
      DetailsBtnDisabled:false,
      princeSheetReturn:{
        returnDetailList:[]
      },
      returnGoodList:[],
      //详情表信息查询
      queryDetails:{
        pageSize:0,
        pageNum:0
      },
      total:0,
      dialogPrinceSheetFormVisible:false,
      princeSheetBtnDisabled:false,

      queryPrinceSheet:{
        pageSize:10,
        pageNum:1,
        createTimeSequence:0,
        endTimeSequence:0,
      },
      princeSheetList:[
      ],
      princeSheetModify:{},
      queryDetailsSheet:{
        pageNum:0,
        pageSize:0
      },
      rules:{
        oStatus: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        oOrderClosingStatus: [
          { required: true, message: '请选择订单结清状态', trigger: 'change' }
        ],
        oInvoiceTypeId: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        oDeliveryWay: [
          { required: true, message: '请选择发货方式', trigger: 'change' }
        ],
        oPaymentWay: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        oOtherCostMoney: [
          { required: true, message: '请填写其他费用', trigger: 'change' },
          {validator:twoPoint,  trigger: 'change' }
        ],
        DeliverGoodsPicture:[
          { required: true, message: '请上传图片', trigger: 'change' },
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  computed:{
    inPicture(){
      return this.$qs.stringify(this.inPicPar)
    },
    DeliverPicture(){
      return this.$qs.stringify(this.DeliverPicPar)
    }
  },
  methods: {
    //打包
    openPackageGood(oId){
      this.PackageGoods={}
      this.dialogPackageGoodsVisible=true
      this.PackageGoods.orderId=oId
      this.PackageGoods.type=0
    },
    //处理打包
    handlePackageGoods(){
      this.inPicPar=this.PackageGoods
      setTimeout(()=>{
        this.$refs.inUpload.submit()
        this.dialogPackageGoodsVisible=false
        this.$message({
          type:'success',
          message:'打包成功'
        })
      },0)
      setTimeout(()=>{
        let princeSheetModify={}
        princeSheetModify.oId=this.PackageGoods.orderId
        princeSheetModify.oIsPackage=0
        PostData('order/updateOrder', princeSheetModify).then(res=>{
        })
      },0)
      setTimeout(()=>{
        this.getList()
      },1000)
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
    //发货处理
    openDeliverGood(oId){
      this.DeliverGoods={}
      this.dialogDeliverGoodsVisible=true
      this.DeliverGoods.orderId=oId
      this.DeliverGoods.type=1
    },
    //处理发货
    handleDeliverGoods(){
      this.DeliverPicPar=this.DeliverGoods
      setTimeout(()=>{
        this.$refs.inDownload.submit()
        this.dialogDeliverGoodsVisible=false
        this.$message({
          type:'success',
          message:'发货成功'
        })
      },0)
      setTimeout(()=>{
        let princeSheetModify={}
        princeSheetModify.oId=this.DeliverGoods.orderId
        princeSheetModify.oStatus=0
        PostData('order/updateOrder', princeSheetModify).then(res=>{
        })
        PostData('/order/deliverOrder',princeSheetModify).then(res=>{
        })
      },0)
      setTimeout(()=>{
        this.getList()
      },1000)
    },
    //转报价单
    InverseSales(params){
      princeSlips.becomeQuotation(params)
        .then(res=>{
          this.$message({
            type:"success",
            message:'转化报价单成功'
          })
          this.getList()
        })
    },
    getList(pageNum=1){
      this.queryPrinceSheet.pageNum=pageNum
      if(this.queryPrinceSheet.princeCreateTime){
        this.queryPrinceSheet.beginTime=getTime(this.queryPrinceSheet.princeCreateTime[0])
        this.queryPrinceSheet.endTime=getTime(this.queryPrinceSheet.princeCreateTime[1])
      }else {
        this.queryPrinceSheet.beginTime=undefined
        this.queryPrinceSheet.endTime=undefined
      }
      princeSlips.queryAll(this.queryPrinceSheet.name,this.queryPrinceSheet.beginTime
        ,this.queryPrinceSheet.endTime,this.queryPrinceSheet.createTimeSequence,
        this.queryPrinceSheet.endTimeSequence, this.queryPrinceSheet.pageNum,
        this.queryPrinceSheet.pageSize)
        .then(res=>{
          this.total=res.total
          for (let i=0;i<res.list.length;i++){
            res.list[i].oCreateTime=getTime(res.list[i].oCreateTime)
            if(res.list[i].oResultTime)
              res.list[i].oResultTime=getTime(res.list[i].oResultTime)
            if(res.list[i].orderPictures){
              for (let j=0;j<res.list[i].orderPictures.length;j++){
                if(res.list[i].orderPictures[j].type===0){
                  res.list[i].packageUrl=res.list[i].orderPictures[j].path
                }else{
                  res.list[i].deliverUrl=res.list[i].orderPictures[j].path
                }
              }
            }
          }
          this.princeSheetList=res.list
        })
    },
    openUpdatePrinceSlips(params){
      this.dialogPrinceSheetFormVisible=true
      if (this.$refs['princeSheetModify'] !== undefined)
        this.$refs['princeSheetModify'].resetFields();
      this.princeSheetModify=JSON.parse(JSON.stringify(params))

    },
    updatePrinceSlips(){
      this.$refs['princeSheetModify'].validate((valid)=> {
        if(valid){
          this.princeSheetBtnDisabled = true
          setTimeout(() => {
            this.princeSheetBtnDisabled = false
          }, 1000)
          this.princeSheetModify.oCreateTime = null,
            this.princeSheetModify.oResultTime = null,
            PostData('order/updateOrder', this.princeSheetModify)
              .then(res => {
                console.log(res)
                this.$message({
                  type: 'success',
                  message: '修改销售单信息成功'
                })
                this.dialogPrinceSheetFormVisible = false
                this.getList()
              })
        }
      })
    },
    deletePrinceSlips(params){
      this.$confirm('是否将此销售单信息删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        princeSlips.deleteOrder(params)
          .then(res=>{
            this.$message({
              type:'success',
              message:'删除销售单信息成功'
            })
            this.getList()
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
.demo-table-expand {
  border-top: 1px solid #000000;
  border-left:1px solid #000000;
  border-right:1px solid #000000;
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  border-bottom: 1px solid #000000;
  border-right:1px solid #000000;
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

</style>
