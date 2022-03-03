<template>
  <div>
    <div class="app-container">
      <el-form label-width="120px" :rules="rules" :model="priceSlip" ref="priceSlip">
        <el-form-item label="客户单位" prop="oCustomerId">
          <el-select
            v-model="priceSlip.oCustomerId" filterable placeholder="请选择客户单位" @change="getPrince($event)">
            <el-option
              v-for="customer in customerNameList"
              :key="customer.cuId"
              :label="customer.cuUnitName"
              :value="customer.cuId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库管理员" prop="oWarehouseOperaterId">
          <el-select
            v-model="priceSlip.oWarehouseOperaterId" filterable placeholder="请选择仓库管理员" >
            <el-option
              v-for="WarehouseOperator in WarehouseOperatorList"
              :key="WarehouseOperator.aId"
              :label="WarehouseOperator.aName"
              :value="WarehouseOperator.aId"/>
          </el-select>
        </el-form-item>
        <div v-for="(itemList, index) in priceSlip.orderDetailList" :key="index">
          <el-form-item  label="商品添加" >
            <el-row style="margin-bottom: 10px">
              <el-col :span="3"  style="width: 150px;">
                <el-form-item :prop="`orderDetailList[${index}].odType`" :rules="rules.odType"  style="width: 140px;">
                  <el-select :disabled="btnDisabled[index]" @change="changeBtn($event,index)" v-model="itemList.odType"   clearable placeholder="选择商品类型" style="width: 130px"  >
                    <el-option :value="1" label="零件"/>
                    <el-option :value="0" label="整件"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 260px;">
                <el-form-item  label="零件类目:"  label-width="75px"  v-if="itemList.odType===1" style="width: 250px" >
                  <el-cascader
                    clearable
                    placeholder="请选择零件类目"
                    v-model="itemList.id"
                    :props="{value:'name',label:'name'}"
                    :options="levelIVDirectoryList">
                    <template slot-scope="{ node, data }">
                      <span>{{ data["name"] }}</span>
                      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                    </template>
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 210px;">
                <el-form-item label="零件号:" label-width="60px" v-if="itemList.odType===1" style="width: 200px" >
                  <el-input   v-model="itemList.partStateNumber" placeholder="请输入零件号" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="width: 220px;">
                <el-form-item label="零件名:" label-width="60px" v-if="itemList.odType===1" style="width: 210px">
                  <el-input  v-model="itemList.partStateName" placeholder="请输入零件名"  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="width: 100px;">
                <el-form-item  v-if="itemList.odType===1" style="width: 80px"  >
                  <el-button  type="primary" size="mini" icon="el-icon-edit" @click="getPartName(index)" >查询</el-button>
                </el-form-item>
              </el-col>

              <el-col :span="3" style="width: 250px;">
                <el-form-item   label="整件名称:" label-width="83px" v-if="itemList.odType===0" :prop="`orderDetailList[${index}].pName`" :rules="rules.pName" style="width: 240px;">
                  <el-autocomplete
                    v-model="itemList.pName"
                    :fetch-suggestions="querySearchAsync"
                    :placeholder="namePlaceholder"
                    :trigger-on-focus="false"
                    @select="handleSelect(itemList, $event)"
                  >
                    <template slot-scope="{ item }">
                      <div>{{ item.pName}}</div>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="4" style="width:300px;">
                <el-form-item label="请选择零件" label-width="70" v-show="pNameListBtn[index]===true&&itemList.odType===1" :prop="`orderDetailList[${index}].odPartsId`" :rules="rules.qdPartsId" style="width: 290px;">
                  <el-select v-model="itemList.odPartsId" filterable placeholder="选择选择零件名称" @change="getPrinceList($event,index)">
                    <el-option
                      v-for="partName in partNameList[index]"
                      :key="partName.pId"
                      :label="partName.pName"
                      :value="partName.pId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 250px;">
                <el-form-item label="零件数量:" label-width="83px" v-if="(inputState[itemList.odPartsId]&&itemList.pName)||(itemList.odPartsId&&itemList.odType)" :prop="`orderDetailList[${index}].odNumber`" :rules="rules.odNumber" style="width: 240px;">
                  <el-input v-model="itemList.odNumber"  :placeholder="numberPlaceholder"/>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 250px;">
                <el-form-item label="零件价格:" label-width="83px" v-if="(inputState[itemList.odPartsId]&&itemList.pName)||(itemList.odPartsId&&itemList.odType)" :prop="`orderDetailList[${index}].odRetailPrice`" :rules="rules.odRetailPrice" style="width: 240px;">
                  <el-input  v-model="itemList.odRetailPrice" :placeholder="princePlaceholder"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="width: 170px;">
                <el-form-item   v-if="itemList.odType&&itemList.odNumber&&recommendedPrice[itemList.odPartsId]"  style="width: 160px;">
                  <template v-for="princeList in princeList[itemList.odPartsId]">
                    {{princeList}}
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <i class="el-icon-delete" @click="deleteItem(itemList, index)"></i>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button @click="addItem" type="primary">增加零件或整件数量</el-button>
        </el-form-item>
        <el-form-item label="发票类型" prop="oInvoiceTypeId">
          <el-select v-model="priceSlip.oInvoiceTypeId"   clearable placeholder="发票类型" style="width: 200px"  >
            <el-option :value="0" label="无"/>
            <el-option :value="1" label="普通发票"/>
            <el-option :value="2" label="增值税发票"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发货方式" prop="oDeliveryWay">
          <el-select v-model="priceSlip.oDeliveryWay"   clearable placeholder="发货方式" style="width: 200px"  >
            <el-option value="快递" label="快递"/>
            <el-option value="托运" label="托运"/>
            <el-option value="线下交易" label="线下交易"/>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="oPaymentWay">
          <el-select v-model="priceSlip.oPaymentWay"   clearable placeholder="支付方式" style="width: 200px"  >
            <el-option value="挂账" label="挂账"/>
            <el-option value="线下" label="线下"/>
            <el-option value="线上" label="线上"/>
          </el-select>
        </el-form-item>
        <el-form-item label="其他费用">
          <el-input v-model="priceSlip.oOtherCostMoney" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="priceSlip.oNote" style="width: 90%"  rows="5" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="saveSalesSlip()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import {mapGetters} from "vuex";
import Cookie from "js-cookie";
import {validatePassCheck,twoPoint} from "@/views/Slips/ruleNumber";
import {commonList, levelIVDirectory, queryPart} from "../../myApi"
import qs from "qs";
export default {
  name: "addSalesSlip",
  computed:{
    ...mapGetters({
      oCreatePeopleId:'urId'
    }),
    namePlaceholder() {
      return this.queryFlag===1 ? "请填写零件名称" : this.queryFlag===0?"请填写整件名称":'请先选择零件或整件'
    },
    dNumberPlaceholder(){
      return this.queryFlag===1 ? "请填写零件状态" : this.queryFlag===0?"请填写整件状态":'请先选择零件或整件'
    },
    numberPlaceholder(){
      return this.queryFlag===1 ? "请填写零件数量" : this.queryFlag===0?"请填写整件数量":'请先选择零件或整件'
    },
    princePlaceholder(){
      return this.queryFlag===1 ? "请填写零件价格" : this.queryFlag===0?"请填写整件价格":'请先选择零件或整件'
    }
  },
  created() {
    this.getList()
  },
  data(){
    return{
      recommendedPrice:[],
      levelIVDirectoryList:[],
      partNameList:[],
      pNameListBtn:[],
      itemLength:0,
      itemIndexLength:0,
      btnDisabled:[],
      inputState:[],
      queryFlag:'',
      princeListBtn:true,
      partTypeBtn:true,
      priceSlip:{
        orderDetailList:[{
          odPartsId:'',
          pName:'',
          odRetailPrice:'',
          odType:'',
          odPartsSizeType:'',
          odNumber:1,
        }]
      },
      customerNameList:[],
      WarehouseOperatorList:[],
      partQuery:{
        "pageNum": 0,
        "pageSize": 0
      },
      partList:[],
      princeList:[],
      princeIndex:'',
      rules: {
        oCustomerId: [
          {required: true, message: '请选择客户单位', trigger: 'change'}
        ],
        oWarehouseOperaterId: [
          {required: true, message: '请选仓库管理员', trigger: 'change'}
        ],
        pName: [
          {required: true, message: '请输入并选择零件', trigger: 'change'}
        ],
        odRetailPrice: [
          {required: true, message: '请输入价格', trigger: 'change'},
          {validator:twoPoint,  trigger: 'change' }
        ],
        odNumber: [
          {required: true, message: '请填购买数量', trigger: 'change'},
          {  validator:validatePassCheck, trigger: 'change' }
        ],
        odPartsId:[
          { required: true, message: '请选择零件名称', trigger: 'change' }
        ],
        oInvoiceTypeId: [
          {required: true, message: '请选择发票类型', trigger: 'change'}
        ],
        oDeliveryWay: [
          {required: true, message: '请选择选择发货方式', trigger: 'change'}
        ],
        oPaymentWay: [
          {required: true, message: '请选择支付方式', trigger: 'change'}
        ],
        odType: [
          {required: true, message: '请选择商品类型', trigger: 'change'}
        ]
      }
    }
  },
  methods:{
    getPrince(id){
      let query={
        cuId:id
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
    getPrinceList(event,index){
      return new Promise((resolve)=>{
        queryPart(event).then(  res=>{
          const princeList = []
          princeList.push('('+'低价' + res.pLowPrice + ',' + '中价:' + res.pMiddlePrice + ',' + '高价' + res.pHighPrice+")")
          this.priceSlip.orderDetailList[index].odRetailPrice=this.customerPrince===0?res.pLowPrice:this.customerPrince===1?res.pMiddlePrice:res.pHighPrice
          this.priceSlip.orderDetailList[index].odPartsSizeType=res.pPartsSizeType
          this.princeIndex=event
          this.$set(this.recommendedPrice,event,true)
          resolve(princeList)
        })
      }).then( async res=>{
        this.$set( this.princeList,this.princeIndex , res )
      })
    },
    getPartName(index){
      if (!this.priceSlip.orderDetailList[index].partStateName && !this.priceSlip.orderDetailList[index].partStateNumber && !this.priceSlip.orderDetailList[index].id) {
        this.$message({
          type: 'error',
          message: "请至少填写零件名称或者选择零件类目或者填写零件号"
        })
      }
      else {
        this.pNameListBtn[index] = true
        let categoryList = ""
        if (this.priceSlip.orderDetailList[index].id && this.priceSlip.orderDetailList[index].id.length > 0)
          this.priceSlip.orderDetailList[index].id.forEach((item, index, array) => {
            if (array[index + 1]) {
              categoryList += item + "/"
            } else {
              categoryList += item
            }
          })
        let queryPart = {
          pCategoryId: categoryList || undefined,
          pName: this.priceSlip.orderDetailList[index].partStateName || undefined,
          pNumber: this.priceSlip.orderDetailList[index].partStateNumber || undefined,
          pageSize: 0,
          pageNum: 0
        }
          PostData("/parts/selectAllByLike", qs.stringify(queryPart)).then(async res => {
            this.$set(this.pNameListBtn, index, true)
            this.$set(this.partNameList, index, res.list)
          })
      }
    },
    getList(){
      levelIVDirectory().then(res=>{
        this.levelIVDirectoryList=res
      })
      commonList("customer/selectAllByLike").then(res=>{
        this.customerNameList=res.list
      })
      commonList('admin/selectAllByLike').then(res=>{
        this.WarehouseOperatorList=res.list
      })
    },
    changeBtn(event,index){
      if(event!=null) {
        this.partTypeBtn=false
        this.queryFlag=event
        this.itemIndexLength+=1
        this.btnDisabled[index] = true
      }
    },
    querySearchAsync(queryString, cb) {
      this.partQuery.pName = queryString;
      if(this.queryFlag===1){
        this.partQuery.odType=this.queryFlag
        PostData('/parts/selectAll',this.partQuery).then(res => {
          cb(res)
        })
      }else{
        this.partQuery.wName = queryString;
        this.partQuery.odType=this.queryFlag
        PostData('/whole/selectAll', this.partQuery).then(res => {
          res.forEach((value)=>{
            value.pName=value.wName
          })
          cb(res)
        })
      }
    },
    handleSelect(item, selectItem) {
      if(this.queryFlag===1) {
        if (selectItem) {
          this.princeListBtn = false
          item.pName = selectItem.pName
          item.odPartsId = selectItem.pId
          item.flag=1
          if (item.pName) {
            this.inputState[selectItem.pId]=1
            const princeList = []
            princeList.push('('+'低价'+selectItem.pLowPrice+','+'中价:'+selectItem.pMiddlePrice+','+'高价'+selectItem.pHighPrice+")")
            this.princeList[selectItem.pId] = princeList
          }
        }
      }else{
        item.pName = selectItem.pName
        this.inputState[selectItem.wId]=1
        item.odPartsId = selectItem.wId
        this.princeListBtn = false
      }
    },
    addItem () {
      if(parseInt(this.itemLength)>=0||this.itemLength===-1){
        if(this.itemLength===-1){
          this.itemLength=parseInt(this.itemLength)+1*1
          this.priceSlip.orderDetailList.push({
            odPartsId: '',
            pName:'',
            odRetailPrice:'',
            odType:'',
            odPartsSizeType:'',
            odNumber:1,
          })
        }
        else if(this.priceSlip.orderDetailList[parseInt(this.itemLength)].odRetailPrice){
          this.itemLength=parseInt(this.itemLength)+1*1
          this.priceSlip.orderDetailList.push({
            odPartsId: '',
            pName:'',
            odRetailPrice:undefined,
            odType:'',
            odPartsSizeType:"",
            odNumber:1,
          })
        }else{
          this.$message({
            type:"error",
            message:"请先将第"+(parseInt(this.itemLength)+1*1)+"行数据填写完整后在进行添加"
          })
        }
      }
    },
    deleteItem (itemList, index) {
      this.priceSlip.orderDetailList.splice(index, 1)
      if((this.itemLength-this.itemIndexLength)>=0) {
        this.btnDisabled[parseInt(this.itemLength)-1]=false
      }
      this.btnDisabled[this.itemLength]=false
      this.itemIndexLength=parseInt(this.itemIndexLength)-1*1
      this.itemLength=parseInt(this.itemLength)-1*1
    },
    saveSalesSlip(){
      if(this.priceSlip.orderDetailList.length>0) {
        this.$refs['priceSlip'].validate((valid) => {
          if (valid) {
            let inputFlag = []
            // this.priceSlip.oCreatePeopleId=this.oCreatePeopleId
            this.priceSlip.oCreatePeopleId = parseInt(Cookie.get('aId'))
            this.priceSlip.oStatus=1
            let oSupposeIncome = 0
            for (let i = 0; i < this.priceSlip.orderDetailList.length; i++) {
              this.priceSlip.orderDetailList[i].odCustomerId = this.priceSlip.oCustomerId
              this.priceSlip.orderDetailList[i].odStatus=0
              let partPrince = this.priceSlip.orderDetailList[i].odRetailPrice
              oSupposeIncome += partPrince * this.priceSlip.orderDetailList[i].odNumber
              if (this.priceSlip.orderDetailList[i].qdPartsId === '') {
                inputFlag[i] = 1
              }
            }
            this.priceSlip.oSupposeIncome = oSupposeIncome
            if (this.priceSlip.orderDetailList.length > 0) {
              let state=1
              inputFlag.forEach((value, index) => {
                if (inputFlag[index]) {
                  state=0
                  alert("您填的第" + (index + 1) * 1 + "个零件或整件无法被检索到")
                }
              })
              if(state===1) {
                this.priceSlip.oType=3
                this.priceSlip.oIsPackage=1
                this.priceSlip.oOrderClosingStatus=2
                console.log(this.priceSlip)
                PostData('order/addOrder', this.priceSlip)
                  .then(res => {
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
                      this.$router.push({path: '/Slips/princeSlipManagement'})
                    }
                  })
              }
            }
          } else {
            alert("请安要求填写完整")
          }
        })
      }else {
        alert("请至少添加一个商品信息")
      }

    }
  }
}
</script>

<style scoped>

</style>
