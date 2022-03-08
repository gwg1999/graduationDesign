<template>
  <div>
    <div class="app-container">
      <el-form :inline="true" class="demo-form-inline" style="position: relative">
        <el-form-item   style="width: 210px">
          <!--          <el-input @keyup.enter.native="queryGoods" v-model="queryDetails.pName" clearable placeholder="请输入零件名" ></el-input>-->
        </el-form-item>
        <!--        <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="queryGoods">查询</el-button>-->
        <el-button type="primary" icon="el-icon-view" style="position: absolute;right:10px"  @click="showSelected">查看已选零件</el-button>
      </el-form>
      <!--      退货商品-->
      <el-table use-virtual
                :data="returnGoodList"
                border
                fit
                highlight-current-row
                style="width: 100%">
        <el-table-column
          label="序号"
          width="50%"
          align="center">
          <template slot-scope="scope">
            {{ (queryDetails.pageNum - 1) * queryDetails.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="partName" label="零件名" width="300px" align="center" />
        <el-table-column prop="rdPartsNum" label="数量"  width="100px" align="center" />
        <el-table-column prop="rdRetailPrice" label="价格"  width="100px" align="center" />
        <el-table-column prop="rdType" label="类型" width="100px" align="center">
          <template slot-scope="scope">
            {{ scope.row.rdType===1?'整件':'零件'}}
          </template>
        </el-table-column>
        <el-table-column  label="坏件入库操作" align="center">
          <template slot-scope="scope">
            <el-form>
              <div style="display: flex;justify-content: space-evenly;font-size: 4px;height: 40px">
                <el-form-item>
                  数量:<el-input-number :min="0" :disabled="true" v-model="scope.row.number"  size="small"></el-input-number>
                </el-form-item>
                <el-form-item>
                  <el-switch
                    style="border-top: 10px"
                    v-model="scope.row.goodsType"
                    active-text="好件"
                    active-value="0"
                    inactive-value="1"
                    inactive-text="坏件">
                  </el-switch>
                </el-form-item>
                <!--                <el-select v-model="scope.row.goodsType"  clearable placeholder="损坏选择" style="width: 120px">-->
                <!--                  <el-option label="好件" :value="0"/>-->
                <!--                  <el-option label="坏件" :value="1"/>-->
                <!--                </el-select>-->
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addPart(scope.row)">添加</el-button>
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <!--        <el-pagination-->
      <!--          layout="total, prev, pager, next, jumper"-->
      <!--          :page-size="levelIV.pageSize"-->
      <!--          :current-page="levelIV.pageNum"-->
      <!--          :total="total"-->
      <!--          style="padding: 30px 0; text-align: right;"-->
      <!--          @current-change="queryGoods"-->
      <!--        />-->
      <!--      购物车-->
      <el-dialog
        :visible.sync="dialogVisible"
        width="80%"
        class="my-info-dialog"
        style="padding-top: 0;padding-bottom: 0"
      >
        <el-container class="my-info-container" style="padding-top: 0">
          <el-main style="padding-top: 0;padding-bottom: 0">
            <el-form :model="priceSlip" status-icon ref="priceSlip" label-width="100px" class="demo-ruleForm" style="padding-top: 0;padding-bottom: 0">
              <h4>零件信息</h4>
              <div style="float: top;padding:0" >
                <el-table
                  style="padding-top: 0"
                  :data="priceSlip.orderDetailList"
                  border
                  fit
                  highlight-current-row>
                  <el-table-column prop="partName" label="零件名" width="200px" align="center"/>
                  <el-table-column prop="number" label="退货数量" width="150px" align="center"/>
                  <el-table-column prop="rdRetailPrice" label="单价" width="80px" align="center"/>
                  <el-table-column prop="priceTotal" label="总价" width="110px" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.number*scope.row.rdRetailPrice}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                      <!--                      <el-button type="primary" size="mini" icon="el-icon-edit"  @click="openPartRecordDialog(scope.row)">修改</el-button>-->
                      <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deletePartRecord(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form>
          </el-main>
          <el-footer style="padding-top: 10px">
            <el-button style="margin-left:70% " @click="dialogVisible = false">取 消</el-button>
            <el-button style="margin-right:5% " type="primary" @click="openSubmitForm">确 定</el-button>
          </el-footer>
        </el-container>
      </el-dialog>
      <!--      批量坏件提交弹框-->
      <el-dialog :visible.sync="dialogDeliveryVisible"  title="其他信息填写" width="70%">
        <el-form :model="priceSlip" label-width="120px" ref="priceSlip" :rules="rules">
          <el-form-item label="坏件备注" prop="note">
            <el-input v-model="priceSlip.note" style="width:80%"  rows="5" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDeliveryVisible = false">取 消</el-button>
          <el-button  type="primary"
                      @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>

      <!--    修改购物车零件-->
      <el-dialog :visible.sync="dialogPartsVisible" title="修改坏件信息">
        <el-form :model="partsModify" label-width="120px" ref="partsModify" :rules="rules">
          <el-form-item label="坏件数量" prop="number">
            <el-input  @keyup.native="partsModify.number = number(partsModify.number)"  v-model="partsModify.number"/>
          </el-form-item>
          <!--          <el-form-item label="零件价格" prop="odRetailPrice">-->
          <!--            <el-input  @keyup.native="partsModify.odRetailPrice = oninput(partsModify.odRetailPrice)" v-model="partsModify.odRetailPrice"/>-->
          <!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPartsVisible = false">取 消</el-button>
          <el-button  type="primary"
                      @click="UpdateParts()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import {validatePassCheck} from "@/views/Slips/ruleNumber"
import {getReturnDetail} from "@/views/returnGood/myApi";
export default {
  created() {
    this.getList()
  },
  data(){
    return{
      //批量坏件提交弹框
      dialogDeliveryVisible:false,
      queryDetails:{
        pageSize:1000,
        pageNum:1
      },
      // 购物车
      dialogVisible:false,
      priceSlip:{
        returnDetailList:[],
        orderDetailList:[]
      },
      //修改购物车零件信息
      dialogPartsVisible:false,
      partsModify:{

      },
      princeSheetReturn:{
        returnDetailList:[
          {
            odId:'',
            odNumber:'',
            number:''
          }
        ]
      },
      // 打开提交
      dialogSubmitVisible:false,
      returnGoodList:[],
      rules:{
        odId: [
          { required: true, message: '请选择退货商品', trigger: 'change' }
        ],
        rType:[
          { required: true, message: '请选择交易属性', trigger: 'change' }
        ],
        odNumber: [
          { required: true, validator:validatePassCheck, trigger: 'change' }
        ]
      }
    }
  },
  computed:{
    numberPlaceholder(){
      return this.queryFlag===1 ? "请填写零件数量" : this.queryFlag===0?"请填写整件数量":'请先选择零件或整件'
    }
  },
  methods: {
    //向购物车中添加零件
    addPart(item){
      let temp=Object.assign({},item)
      let flag=false
      if(temp.number){
        for(let part of this.priceSlip.orderDetailList){
          if(item.rdPartsId===part.rdPartsId) {
            flag = true
            let num=part.number+item.number
            if(num>part.rdPartsNum){
              this.$message({
                message: `要收的坏件数量大于客户的退货数量`,
                type: "error"
              })
            }else {
              part.number += item.number
              part.rdRetailPrice=item.rdRetailPrice
              part.priceTotal=part.number*part.rdRetailPrice
              this.$message({
                message: '已修改零件数量',
                type: "success"
              })
            }
          }
        }
        if(!flag){
          if(temp.number<=temp.rdPartsNum){
            temp.priceTotal=temp.number*temp.rdRetailPrice
            this.priceSlip.orderDetailList.push(temp)
            this.$message({
              message:'已添加至已选零件库',
              type:"success"
            })
          }else{
            this.$message({
              message:'输入的坏件数量大于客户所退的数量',
              type:"error"
            })
          }
        }
      }
      else {
        this.$message({
          message:'请输入零件数量',
          type:"warning"
        })
      }
    },
    //获取退货列表
    getList(){
      getReturnDetail(this.$route.query.qId.rId,this.queryDetails.pageNum, this.queryDetails.pageSize).then(res=>{
        res.list.map((item)=>{
          item.goodsType=1
          item.number=item.rdPartsNum
        })
        this.returnGoodList=res.list
        this.total=res.total
      })
    },
    //购物车
    showSelected(){
      this.dialogVisible=true
    },
    //购物车操作
    openPartRecordDialog(record){
      this.dialogPartsVisible=true
      this.partsModify=JSON.parse(JSON.stringify(record))
    },
    deletePartRecord(record){
      this.$confirm('是否将此条零件信息从购物车删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        for(let i=0;i<this.priceSlip.orderDetailList.length;i++){
          if(this.priceSlip.orderDetailList[i].rdPartsId===record.rdPartsId){
            this.priceSlip.orderDetailList.splice(i, 1)
          }
        }
      })
    },
    UpdateParts(){
      this.$refs['partsModify'].validate((valid)=>{
        if(valid){
          for(let i=0;i<this.priceSlip.orderDetailList.length;i++){
            if(this.priceSlip.orderDetailList[i].rdPartsId===this.partsModify.rdPartsId){
              if(this.partsModify.number<=this.priceSlip.orderDetailList[i].rdPartsNum){
                this.priceSlip.orderDetailList[i].number=this.partsModify.number
                this.$message({
                  message:'修改成功',
                  type:"success"
                })
                this.dialogPartsVisible=false
              }
              else{
                this.$message({
                  message:`输入的坏件数量大于客户退货的总数量,最多坏件数量为${this.priceSlip.orderDetailList[i].rdPartsNum}`,
                  type:"warning"
                })
              }
            }
          }
        }
      })
    },
    //批量提交弹框
    openSubmitForm(){
      if(this.$refs['priceSlip']!==undefined){
        this.$refs['priceSlip'].resetFields()
      }
      this.priceSlip=JSON.parse(JSON.stringify(this.priceSlip))
      // this.priceSlip.note=''
      this.dialogDeliveryVisible=true
    },
    submitForm(){
      this.$refs['priceSlip'].validate((valid)=>{
        if(valid){
          let copyPriceSlip={}
          copyPriceSlip=this.$route.query.qId
          if(this.priceSlip.note){
            copyPriceSlip.note=this.priceSlip.note
          }
          copyPriceSlip.rIsReceive=1
          copyPriceSlip.rCreateTime=undefined
          this.priceSlip.orderDetailList.forEach((value)=>{
            value.partsId=value.rdPartsId
            value.amount=value.rdRetailPrice
            value.partsName=value.partName
            value.rdIsBad=value.goodsType
            value.note=copyPriceSlip.note
          })
          copyPriceSlip.returnDetailList=this.priceSlip.orderDetailList
          console.log(copyPriceSlip)
          PostData('/return/updateReturn',copyPriceSlip)
            .then(res => {
              this.$message({
                message:'收货成功',
                type:"success"
              })
              this.dialogVisible=false
              this.dialogDeliveryVisible=false
              this.$router.push({
                path: "/returnGood/cancelSlipsManagement"
              })
            })
        }
      })
    },
    //数字验证
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
    },
    //数量验证
    number(value){
      let str = value;
      let len1 = str.substr(0, 1);
      let len2 = str.substr(1, 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && (len2 == "0"||len2 != "^^")) {
        str = str.substr(1, 1);
      }
      //正则替换
      str = str.replace(/[^\d]+/g, "");
      str = str.replace(/^\D*([1-9]\d*)$/, "$1");
      return str;
    }
  }
}
</script>

<style scoped>
</style>
