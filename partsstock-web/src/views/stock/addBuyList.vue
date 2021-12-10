<template>
  <div>
    <!--    <div style="width: 300px;height:300px;position:absolute;left:50px;top:80px;background-color: red"></div>-->
    <el-dialog
      title="添加零件"
      :visible.sync="stepOneVisible"
      width="70%"
      :before-close="handleClose">
      <h2 style="text-align: center">请选择零件厂商</h2>
      <div style="text-align: center">
        <el-select  v-model="fIdValue" filterable placeholder="请选择厂商" style="text-align: center" @change="handleChange">
          <el-option
            v-for="item in factoryList"
            :label="item.fName"
            :value="item.fId">
            <span style="float: left">{{ item.fName }}</span>
            <!--        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
          </el-option>
        </el-select>
        <!--    <button @click="showValue">显示</button>-->
        <div style="text-align: center;margin-top: 50px">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="pKeyValue"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="['全选', '全选']"
            :button-texts="['删除', '添加']"
            :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
            :data="data">
            <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
            <!--        <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>-->
            <!--        <el-button class="transfer-footer" slot="right-footer" size="small" @click="option">操作</el-button>-->
<!--            <div class="transfer-footer" slot="right-footer">-->
<!--              <el-select  v-model="cuIdValue" filterable placeholder="选择客户" style="width: 62%">-->
<!--                <el-option-->
<!--                  v-for="item in customerList"-->
<!--                  :label="item.cuUnitName"-->
<!--                  :value="item.cuId">-->
<!--                  <span style="float: left">{{ item.cuUnitName }}</span>-->
<!--                  &lt;!&ndash;        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>&ndash;&gt;-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--              <el-button size="small" type="primary" @click="option" style="float: right">操作</el-button>-->
<!--            </div>-->
          </el-transfer>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="option">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="提示2"
      :visible.sync="stepTwoVisible"
      width="80%"
      :before-close="handleClose">
      <el-form :model="parts" ref="parts" label-width="100px" class="demo-dynamic">
        <div v-for="(item, index) in parts.selectedPart" style="display: flex;justify-content: space-around">
          <el-form-item :label="'零件' + index+':'" :prop="'selectedPart.' + index+'.pName'" :rules="rules.pName">
            <el-input v-model="item.pName" :disabled="true" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="供货周期:" :prop="'selectedPart.'+index+'.sdDeliveryCycle'" :rules="rules.sdDeliveryCycle">
            <el-input placeholder="请输入数字" v-model="item.sdDeliveryCycle" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="单价:" :prop="'selectedPart.'+index+'.sdPrice'" :rules="rules.sdPrice">
            <el-input placeholder="请输入数字" v-model="item.sdPrice" style="width: 200px">
              <el-select v-model="item.sdPrice" slot="append" placeholder="请选择" @focus="getPrice(item.pName)">
                <el-option :label="partPrice[0].pLowPrice" :value="partPrice[0].pLowPrice"></el-option>
                <el-option :label="partPrice[0].pMiddlePrice" :value="partPrice[0].pMiddlePrice"></el-option>
                <el-option :label="partPrice[0].pHighPrice" :value="partPrice[0].pHighPrice"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="零件数量:" :prop="'selectedPart.'+index+'.sdNumber'" :rules="rules.sdNumber">
            <el-input-number v-model="item.sdNumber" :min="1" label="描述文字" @change="changeVal($event)"></el-input-number>
          </el-form-item>
        </div>
        <div v-for="(item,index) in parts.selectedWhole" style="display: flex;justify-content: space-around">
          <el-form-item :label="'整件' + index+':'" :prop="'selectedWhole.' + index+'.wName'" :rules="rules.wName">
            <el-input v-model="item.wName" :disabled="true" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="供货周期:" :prop="'selectedWhole.'+index+'.sdDeliveryCycle'" :rules="rules.sdDeliveryCycle">
            <el-input placeholder="请输入数字" v-model="item.sdDeliveryCycle" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="单价:" :prop="'selectedWhole.'+index+'.sdPrice'" :rules="rules.sdPrice">
            <el-input placeholder="请输入数字" v-model="item.sdPrice" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="整件数量:" :prop="'selectedWhole.'+index+'.sdNumber'" :rules="rules.sdNumber">
            <el-input-number v-model="item.sdNumber" :min="1" label="描述文字" @change="changeVal($event)"></el-input-number>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="stepTwoVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('parts')">提 交</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="添加整件"
      :visible.sync="wholeVisible"
      width="70%"
      :before-close="handleClose">
      <div style="text-align: center;margin-top: 50px">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="wKeyValue"
          filterable
          :left-default-checked="[]"
          :right-default-checked="[]"
          :titles="['全选', '全选']"
          :button-texts="['删除', '添加']"
          :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
          :data="wholeData">
          <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
          <!--        <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>-->
          <!--        <el-button class="transfer-footer" slot="right-footer" size="small" @click="option">操作</el-button>-->
          <div class="transfer-footer" slot="right-footer">
          </div>
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
<!--        <el-button @click="wholeVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="openDialog">确 认</el-button>
        </span>
    </el-dialog>
    <div class="app-container" style="width: 70%;position: absolute;left: 200px;top: 60px">
      <el-form  ref="buyList" :model="buyList" label-width="120px" :rules="rules">
        <div style="width: 50%;float: left">
          <el-form-item label="仓库管理员" prop="swarehouseOperaterId">
            <el-select v-model="buyList.swarehouseOperaterId" filterable placeholder="请选择">
              <el-option
                v-for="item in houseOperator"
                :key="item.aId"
                :label="item.aName"
                :value="item.aId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户" prop="sCustomId">
            <el-select  v-model="buyList.sCustomId" placeholder="选择客户">
              <el-option
                v-for="item in customerList"
                :label="item.cuUnitName"
                :value="item.cuId">
<!--                <span style="float: left">{{ item.cuUnitName }}</span>-->
                <!--        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
              </el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="用户ID" prop="aId">-->
          <!--            <el-input v-model="admin.aId" style="width: 300px"s/>-->
          <!--          </el-form-item>-->
<!--          <el-form-item label="是否已支付" prop="sisPayment">-->
<!--            <el-select v-model="buyList.sisPayment" filterable placeholder="请选择">-->
<!--              <el-option label="未支付" :value="0"></el-option>-->
<!--              <el-option label="已支付" :value="1"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="订单状态" prop="sstatus">-->
<!--            <el-select v-model="buyList.sstatus" filterable placeholder="请选择">-->
<!--              <el-option label="未发货" :value="0"></el-option>-->
<!--              <el-option label="部分发货" :value="1"></el-option>-->
<!--              <el-option label="全部发货" :value="2"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="进货单类型" prop="stype">-->
<!--            <el-select v-model="buyList.stype" filterable placeholder="请选择">-->
<!--              <el-option label="部分退货进货单" :value="0"></el-option>-->
<!--              <el-option label="全部退货进货单" :value="1"></el-option>-->
<!--              <el-option label="普通进货单" :value="2"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
        </div>
        <div style="width: 50%;float: right">
<!--          <el-form-item label="订单状态" prop="sorderStatus">-->
<!--            <el-select v-model="buyList.sorderStatus" filterable placeholder="请选择">-->
<!--              <el-option label="部分结清" :value="0"></el-option>-->
<!--              <el-option label="全部结清" :value="1"></el-option>-->
<!--              <el-option label="未结" :value="2"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="支付订单编号" prop="sorderNumber">-->
<!--            <el-input v-model="buyList.sorderNumber"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="应收价" prop="sprice">-->
<!--            <el-input v-model="buyList.sprice"/>-->
<!--          </el-form-item>-->
          <!--          <el-form-item label="创建时间" prop="aCreateTime">-->
          <!--            <el-input disabled v-model="admin.aCreateTime" style="width: 300px"/>-->
          <!--          </el-form-item>-->
<!--          <el-form-item label="实收价" prop="srealIncome">-->
<!--            <el-input v-model="buyList.srealIncome"/>-->
<!--          </el-form-item>-->
          <el-form-item label="付款方式" prop="spaymentWay">
            <el-select v-model="buyList.spaymentWay" filterable placeholder="请选择">
              <el-option
                v-for="item in spaymentWay"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息" prop="snote">
            <el-input v-model="buyList.snote" type="textarea"/>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="submitOneForm('buyList')" >保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import {GetData,PostData} from "@/api";
import Cookie from "js-cookie"
import qs from "qs";
import part from "@/views/parts/part";
export default {
  components:{
    ImageCropper,
    PanThumb
  },
  data() {
    return {
      data: [],
      wholeData:[],
      wholeList:[],
      parts:{
        selectedPart: [],
        selectedWhole: []
      },
      priceQuery:{},
      partPrice:[{
        pLowPrice:0,
        pMiddlePrice:0,
        pHighPrice:0
      }],
      submitInfo:{
        stockDetailList:[]
      },
      value:'',
      pKeyValue: [],
      wKeyValue: [],
      renderFunc(h, option) {
        return <span>{ option.key } - { option.label }</span>;
      },
      getPrice(pName){
        this.priceQuery.pName=pName
        PostData('/parts/selectAllByLike',qs.stringify(this.priceQuery)).then((ref)=>{
          console.log(ref.list);
          this.partPrice=ref.list
        })
      },
      fIdValue:'',
      cuIdValue:'',
      factoryList:[],
      customerList:[],
      partList:[],
      selectedPart:[],
      selectedWhole:[],
      partQuery:{
        pageNum:1,
        pageSize:50
      },
      wholeQuery:{
        pageSize:0,
        pageNum:0
      },
      factoryQuery:{
        pageNum:0,
        pageSize:0
      },
      customerQuery:{
        pageNum:0,
        pageSize:0
      },
      stepOneVisible:false,
      stepTwoVisible:false,
      wholeVisible:false,
      buyList: {
        sisPayment:0,
        sstatus:0,
        stype:2,
        sorderStatus:2,
        srealIncome:0,
      },
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
      houseOperatorQuery:{
        type:4
      },
      editId:'',
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      adminQuery:{
        pageSize: 10,
        pageNum: 1,
        aId: 0
      },
      query:{
        pageSize: 10,
        pageNum: 1
      },
      rules:{
        swarehouseOperaterId:[
          {required:true,message:'请选择仓库管理员',trigger:'blur'}
        ],
        spaymentWay:[
          {required:true,message:'请选择仓库管理员',trigger:'blur'}
        ],
        sisPayment:[
          {required:true,message:'请选择支付状态',trigger:'blur'}
        ],
        sstatus:[
          {required:true,message:'请选择订单状态',trigger:'blur'}
        ],
        sorderStatus:[
          {required:true,message:'请选择订单状态',trigger:'blur'}
        ],
        sCustomId:[
          {required:true,message:'请选择客户',trigger:'change'}
        ],
        sorderNumber:[
          {required:true,message:'请填写支付订单编号',trigger:'blur'}
        ],
        srealIncome:[
          {required:true,message:'请输入实收价',trigger:'blur'},
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '只能输入数字',trigger: "blur"}
        ],
        stype:[
          {required:true,message:'请选择进货单类型',trigger:'blur'},
        ],
        pName:[{ required: true, message: '请输入零件名称', trigger: 'blur' }],
        wName: [{ required: true, message: '请输入整件名称', trigger: 'blur' }],
        sdDeliveryCycle:[
          { required: true, message: '请输入供货周期', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+$/,message: '只能输入数字',trigger: "blur"}
        ],
        sdPrice:[
          { required: true, message: '请输入单价', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '只能输入数字',trigger: "blur"}
        ],
        sdNumber:[
          { required: true, message: '请输入数量', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+$/,message: '只能输入数字',trigger: "blur"}
        ]
      }
    }
  },
  created() {
    this.getHouseOperator()
    this.getFactory()
    this.getCustomer()
  },
  // computed:{
  //   isSubmit(){
  //     return (this.admin.aName==='' && this.admin.aUsername==='' && this.admin.aSecondaryPassword==='' && this.admin.aWechat==='' && this.admin.aPhoneNumber==='' && this.admin.aPermission==='' && this.admin.aIsEnable==='')
  //   }
  // },
  methods: {
    save(){

    },
    getFactory(){
      PostData('/factory/selectAllByLike',qs.stringify(this.factoryQuery)).then((res=>{
        this.factoryList=res.list
      }))
    },
    changeVal(){
      this.$forceUpdate();
    },
    getCustomer(){
      PostData('/customer/selectAllByLike',this.customerQuery).then((res=>{
        this.customerList=res.list
        console.log(this.customerList);
      }))
    },
    handleChange(){
      this.partQuery.factoryId=this.fIdValue
      PostData('/inquiry/selectPartsByFactoryId',qs.stringify(this.partQuery)).then((res)=>{
        this.partList=res.list
        this.data.splice(0,this.data.length)
        this.pKeyValue.splice(0,this.pKeyValue.length)
        for (let i = 0; i < res.list.length; i++) {
          this.data.push({
            key: i,
            label:res.list[i].pName
          });
        }
      })
    },
    option(){
      if(false){
        alert('请选择客户')
      }
      else {
        // this.selectedPart.splice(0,this.selectedPart.length)
        // for(let i = 0;i < this.pKeyValue.length;i++){
        //   this.partList[this.pKeyValue[i]].sdNumber=1
        //   this.selectedPart.push(this.partList[this.pKeyValue[i]])
        // }
        // this.stepOneVisible=false
        // this.stepTwoVisible=true
        this.$confirm('是否添加整件?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          PostData('/whole/selectAllByLike',qs.stringify(this.wholeQuery)).then((res)=>{
            this.wholeList=res.list
            this.wholeData.splice(0,this.wholeData.length)
            this.wKeyValue.splice(0,this.wKeyValue.length)
            for (let i = 0; i < res.list.length; i++) {
              this.wholeData.push({
                key: i,
                label:res.list[i].wName
              });
            }
            this.stepOneVisible=false
            this.wholeVisible=true
          })
        }).catch(() => {
          this.selectedPart.splice(0,this.selectedPart.length)
          for(let i = 0;i < this.pKeyValue.length;i++){
            this.partList[this.pKeyValue[i]].sdNumber=1
            this.partList[this.pKeyValue[i]].sdType=1
            this.selectedPart.push(this.partList[this.pKeyValue[i]])
          }
          this.parts.selectedPart=this.selectedPart
          this.stepOneVisible=false
          this.stepTwoVisible=true
          console.log(this.selectedPart);
        });
      }
    },
    openDialog(){
      this.selectedPart.splice(0,this.selectedPart.length)
      for(let i = 0;i < this.pKeyValue.length;i++){
        this.partList[this.pKeyValue[i]].sdNumber=1
        this.partList[this.pKeyValue[i]].sdType=1
        this.selectedPart.push(this.partList[this.pKeyValue[i]])
      }
      this.selectedWhole.splice(0,this.selectedWhole.length)
      for(let i = 0;i < this.wKeyValue.length;i++){
        this.wholeList[this.wKeyValue[i]].sdNumber=1
        this.wholeList[this.wKeyValue[i]].sdType=0
        this.selectedWhole.push(this.wholeList[this.wKeyValue[i]])
      }
      this.parts.selectedPart=this.selectedPart
      this.parts.selectedWhole=this.selectedWhole
      this.wholeVisible=false
      this.stepTwoVisible=true
      console.log(this.selectedPart);
    },
    oldToNew(){
      for(let i=0;i<this.selectedPart.length;i++){
        this.selectedPart[i].sdCustomerId=parseInt(this.buyList.sCustomId)
        this.selectedPart[i].sdPartsId=parseInt(this.selectedPart[i].pId)
        this.selectedPart[i].sdType=1
        this.selectedPart[i].sdPartsName=this.selectedPart[i].pName
        this.selectedPart[i].sdOrderId=this.submitInfo.orderId
        this.selectedPart[i].sdStatus=0
      }
      for(let j=0;j<this.selectedWhole.length;j++){
        this.selectedWhole[j].sdCustomerId=parseInt(this.buyList.sCustomId)
        this.selectedWhole[j].sdPartsId=parseInt(this.selectedWhole[j].wId)
        this.selectedWhole[j].sdType=0
        this.selectedWhole[j].sdPartsName=this.selectedWhole[j].wName
        this.selectedWhole[j].sdOrderId=this.submitInfo.orderId
        this.selectedWhole[j].sdStatus=0
      }
    },
    assignment(){
      this.submitInfo.sCustomId=parseInt(this.buyList.sCustomId)
      this.submitInfo.sStatus=0
      this.submitInfo.stockDetailList.splice(0,this.submitInfo.stockDetailList.length)
      this.submitInfo.stockDetailList.push(...this.selectedPart)
      this.submitInfo.stockDetailList.push(...this.selectedWhole)
    },
    getHouseOperator(){
      GetData('/admin/selectAdminByType',this.houseOperatorQuery).then(res=>{
        this.houseOperator=res
      })
    },
    voluation(){
      this.buyList.screateOperatorId=Cookie.get('aId')
      // this.buyList.sCustomId=0
    },
    submitOneForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.voluation()
          PostData('/stock/addStock',this.buyList)
            .then(res=>{
              console.log(res.data);
              this.submitInfo.orderId=res.data
              this.stepOneVisible=true
            }).catch(()=>{})
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.oldToNew()
          this.assignment()
          console.log(this.submitInfo);
          PostData("/stock/addStockDetail",this.submitInfo).then((ref)=>{
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.stepTwoVisible=false
            this.$router.push('/stock/buy')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}
</script>

<style>
body{
  background: white;
}
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}

</style>
