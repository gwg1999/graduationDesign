<template>
  <div>
    <div class="app-container">
      <el-form label-width="120px" :rules="rules" :model="salesSlip" ref="salesSlip" >
        <div v-for="(itemList, index) in salesSlip.quotationDetailList" :key="index">
          <el-form-item  label="商品选择" >
            <el-row style="margin-bottom: 10px" >
              <el-col :span="3" style="width: 150px">
                <el-form-item  :prop="`quotationDetailList[${index}].qdType`" :rules="rules.qdType">
                  <el-select  :disabled="btnDisabled[index]" @change="changeBtn($event,index)"  v-model="itemList.qdType"   placeholder="选择商品类型" style="width: 140px"  >
                    <el-option :value="1" label="零件"/>
                    <el-option :value="0" label="整件"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 260px">
                <el-form-item label="零件类目:"  label-width="75px"  v-if="itemList.qdType===1" style="width: 250px" >
                  <el-cascader
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
              <el-col :span="3" style="width: 210px">
                <el-form-item label="零件号:" label-width="60px" v-if="itemList.qdType===1" style="width: 200px" >
                  <el-input   v-model="itemList.partStateNumber" placeholder="请输入零件号" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 220px">
                <el-form-item label="零件名:" label-width="60px" v-if="itemList.qdType===1" style="width: 210px">
                  <el-input v-model="itemList.partStateName" placeholder="请输入零件名"  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 100px">
                <el-form-item  v-if="itemList.qdType===1" >
                  <el-button  type="primary" size="mini" icon="el-icon-edit" @click="getPartName(index)" style="width: 80px">查询</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="width: 250px">
                <el-form-item label="整件名称:" label-width="83px" v-if="itemList.qdType===0" :prop="`quotationDetailList[${index}].pName`" :rules="rules.pName" style="width: 240px">
                  <el-autocomplete
                    v-model="itemList.pName"
                    :fetch-suggestions="querySearchAsync"
                    :placeholder="namePlaceholder"
                    :trigger-on-focus="false"
                    @select="handleSelect(itemList, $event)"
                  >
                    <template slot-scope="{ item }">
                      <div>{{item.pName}}</div>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row >
              <el-col :span="4" style="width: 310px">
                <el-form-item label="请选择零件" label-width="70" v-show="pNameListBtn[index]===true&&itemList.qdType" :prop="`quotationDetailList[${index}].qdPartsId`" :rules="rules.qdPartsId" style="width: 300px">
                  <el-select  v-model="itemList.qdPartsId"  filterable placeholder="选择选择零件名称" @change="getPrinceList($event,index)">
                    <el-option
                      v-for="partName in partNameList[index]"
                      :key="partName.pId"
                      :label="partName.pName"
                      :value="partName.pId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 250px">
                <el-form-item label="零件数量:" label-width="83px" v-if="(inputState[itemList.qdPartsId]&&itemList.pName)||(itemList.qdPartsId&&itemList.qdType)" :prop="`quotationDetailList[${index}].qdNumber`" :rules="rules.qdNumber" style="width: 240px">
                  <el-input v-model="itemList.qdNumber"  :placeholder="numberPlaceholder"/>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 250px" >
                <el-form-item label="零件价格:" label-width="83px" v-if="(inputState[itemList.qdPartsId]&&itemList.pName)||(itemList.qdPartsId&&itemList.qdType)" :prop="`quotationDetailList[${index}].qdRealTimePrice`" :rules="rules.qdRealTimePrice" style="width: 240px">
                  <el-input  v-model="itemList.qdRealTimePrice"  :placeholder="princePlaceholder"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3" style="width: 170px" v-if="itemList.qdType&&recommendedPrice[itemList.qdPartsId]">
                <el-form-item   style="width: 150px" v-for="princeList in salesList[itemList.qdPartsId]">
                  <template >
                    {{princeList}}
                  </template>
                </el-form-item>
              </el-col>
              <!--            <el-col :span="3">-->
              <!--              <el-form-item  v-if="pNameListBtn[index]" :prop="`quotationDetailList[${index}].qdDeliveryNum`" :rules="rules.qdDeliveryNum" style="width: 150px">-->
              <!--                <el-input v-model="itemList.qdDeliveryNum" style="width: 150px" :placeholder="numberPlaceholder"/>-->
              <!--              </el-form-item>-->
              <!--            </el-col>-->
              <el-col :span="3" style="width: 50px">
                <el-form-item style="width: 30px">
                  <i class="el-icon-delete" @click="deleteItem(itemList, index)"></i>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button @click="addItem" type="primary">增加零件或整件</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="saveSalesSlip()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import Cookie from "js-cookie";
import {validatePassCheck,twoPoint} from "@/views/Slips/ruleNumber";
import {levelIVDirectory,queryPart} from '../../myApi'
import qs from "qs"
export default {
  computed:{
    namePlaceholder() {
      return this.queryFlag===1 ? "请填写零件名称" : this.queryFlag===0?"请填写整件名称":'请先选择零件或整件'
    },
    dNumberPlaceholder(){
      return this.queryFlag===1 ? "请填写零件发货数量" : this.queryFlag===0?"请填写整件发货数量":'请先选择零件或整件'
    },
    numberPlaceholder(){
      return this.queryFlag===1 ? "请填写零件数量" : this.queryFlag===0?"请填写整件数量":'请先选择零件或整件'
    },
    princePlaceholder(){
      return this.queryFlag===1 ? "请填写零件价格" : this.queryFlag===0?"请填写整件价格":'请先选择零件或整件'
    }
  },
  data(){
    return{
      rowStatus:0,
      update:'',
      recommendedPrice:[],
      pNameListBtn:[],
      pOneLevelId:'',
      partStateName:'',
      partStateNumber:'',
      itemLength:0,
      itemIndexLength:0,
      btnDisabled:[],
      inputState:[],
      inputPartPrince:true,
      queryFlag:'',
      queryPartBtn:true,
      qCustomerIdBtn:true,
      salesListBtn:true,
      partSizeBtn:true,
      salesSlip:{
        qCustomerId:this.$route.query.qCustomerId,
        quotationDetailList:[{
          qdPartsId:'',
          pName:'',
          qdRealTimePrice:'',
          qdType:'',
          qdNumber:1,
          qdPartsSizeType:'',
          pNumber:"",
          qdDeliveryNum:"",
        }]
      },
      princeIndex:'',
      saveBtnDisabled:false,
      partQuery:{
        pageNum: 0,
        pageSize: 0
      },
      queryCustomer:{
        cuId:this.$route.query.qCustomerId
      },
      customerPrince:"",
      partNameList:[],
      salesList:[],
      levelIVDirectoryList:[],
      indexFlag:0,
      rules:{
        qCustomerId: [
          { required: true, message: '请选择客户单位', trigger: 'change' }
        ],
        pName: [
          { required: true, message: '请输入并选择零件', trigger: 'change' }
        ],
        qdRealTimePrice: [
          { required: true, message: '请输入价格', trigger: 'change' },
          {validator:twoPoint,   trigger: 'change' }
        ],
        qdPartsId:[
          { required: true, message: '请选择零件名称', trigger: 'change' }
        ],
        pSize: [
          { required: true, message: '请选择选择零件大小', trigger: 'change' }
        ],
        qdNumber: [
          { required: true, message: '请填写零件数量', trigger: 'change' },
          {  validator:validatePassCheck, trigger: 'change' }
        ],
        qdType: [
          { required: true, message: '请选择商品类型', trigger: 'change' }
        ],
        qOrderStatus:[
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        qdDeliveryNum:[
          { required: true, message: '请填写发货数量', trigger: 'change' },
          {  validator:validatePassCheck, trigger: 'change' }
        ]
      }
    }
  },
  updated() {
    this.recommendedPrice[this.princeIndex]=true
  },
  created() {
    this.getList()
    this.getCustomerPrince()
  },
  methods: {
    getCustomerPrince(){
      PostData('/customer/selectAllByLike',this.queryCustomer).then(res=>{
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
      return new Promise((resolve => {
        queryPart(event).then( async res=>{
          await this.getCustomerPrince()
          let princeList = []
          princeList.push('('+'低价' + res.pLowPrice + ',' + '中价:' + res.pMiddlePrice + ',' + '高价' + res.pHighPrice+")")
          this.$set(this.recommendedPrice,event,true)
          this.salesSlip.quotationDetailList[index].qdRealTimePrice=this.customerPrince===0?res.pLowPrice:this.customerPrince===1?res.pMiddlePrice:res.pHighPrice
          this.salesSlip.quotationDetailList[index].qdPartsSizeType=res.pPartsSizeType
          this.princeIndex=event
          resolve(princeList)
        })
      })).then( async res=>{
        this.$set( this.salesList,this.princeIndex , res )
      })
    },
    getPartName(index) {
      if (!this.salesSlip.quotationDetailList[index].partStateName && !this.salesSlip.quotationDetailList[index].partStateNumber && !this.salesSlip.quotationDetailList[index].id) {
        this.$message({
          type: 'error',
          message: "请至少填写零件名称或者选择零件类目或者填写零件号"
        })
      }
      else {
        let categoryList = ""
        if (this.salesSlip.quotationDetailList[index].id && this.salesSlip.quotationDetailList[index].id.length > 0)
          this.salesSlip.quotationDetailList[index].id.forEach((item, index, array) => {
            if (array[index + 1]) {
              categoryList += item + "/"
            } else {
              categoryList += item
            }
          })
        let queryPart = {
          pCategoryId: categoryList || undefined,
          pName: this.salesSlip.quotationDetailList[index].partStateName || undefined,
          pNumber: this.salesSlip.quotationDetailList[index].partStateNumber || undefined,
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
    },
    changeBtn(event,index) {
      if (event != null) {
        this.queryPartBtn = false
        this.queryFlag = event
        this.itemIndexLength+=1
        this.btnDisabled[index] = true
      }
    },
    querySearchAsync(queryString, cb) {
      this.partQuery.pName = queryString;
      if (this.queryFlag === 1) {
        this.partQuery.qdType = this.queryFlag
        PostData('/parts/selectAll', this.partQuery).then(res => {
          cb(res)
        })
      } else {
        this.partQuery.wName = queryString;
        this.partQuery.odType = this.queryFlag
        PostData('/whole/selectAll', this.partQuery).then(res => {
          res.forEach((value) => {
            value.pName = value.wName
          })
          cb(res)
        })
      }
    },
    handleSelect(item, selectItem) {
      if (this.queryFlag === 1) {
        if (selectItem) {
          this.salesListBtn = false
          item.pName = selectItem.pName
          item.qdPartsId = selectItem.pId
          item.flag = 1
          // if (item.pName) {
          //   this.inputState[selectItem.pId]=1
          //   const princeList = []
          //   princeList.push('('+'低价' + selectItem.pLowPrice + ',' + '中价:' + selectItem.pMiddlePrice + ',' + '高价' + selectItem.pHighPrice+")")
          //   this.salesList[selectItem.pId] = princeList
          //   this.partSizeBtn = false
          // }
        }
      } else {
        if (selectItem) {
          this.princeListBtn = false
          this.inputState[selectItem.wId]=1
          item.pName = selectItem.pName
          item.qdPartsId = selectItem.wId

        }
      }
    },
    addItem () {
      if(parseInt(this.itemLength)>=0||this.itemLength===-1){
        if(this.itemLength===-1) {
          this.itemLength = parseInt(this.itemLength) + 1 * 1
          this.salesSlip.quotationDetailList.push({
            qdPartsId: '',
            pName: '',
            qdRealTimePrice: '',
            qdType: '',
            qdNumber:1,
            qdPartsSizeType:'',
            qdDeliveryNum: ''
          })
        }
        else if(this.salesSlip.quotationDetailList[parseInt(this.itemLength)].qdRealTimePrice){
          this.itemLength=parseInt(this.itemLength)+1*1
          this.salesSlip.quotationDetailList.push({
            qdPartsId: '',
            pName:'',
            qdRealTimePrice:undefined,
            qdType:'',
            qdPartsSizeType:'',
            qdNumber:1,
            qdDeliveryNum:""
          })
        }else{
          this.$message({
            type:"error",
            message:"请先将第"+(parseInt(this.itemLength)+1*1)+"行数据填写完整后在进行添加"
          })
        }
      }
    },
    deleteItem (item, index) {
      this.salesSlip.quotationDetailList.splice(index, 1)
      if((this.itemLength-this.itemIndexLength)>=0) {
        this.btnDisabled[parseInt(this.itemLength)-1]=false
      }
      this.btnDisabled[this.itemLength]=false
      this.itemIndexLength=parseInt(this.itemIndexLength)-1*1
      this.itemLength=parseInt(this.itemLength)-1*1
    },
    saveSalesSlip(){
      if(this.salesSlip.quotationDetailList.length>0) {
        this.$refs['salesSlip'].validate((valid) => {
          if (valid) {
            let inputFlag = []
            this.salesSlip.qCustomerId = this.$route.query.qCustomerId
            this.salesSlip.qCreatePeopleId = parseInt(Cookie.get('aId'))
            let qPrice = 0
            for (let i = 0; i < this.salesSlip.quotationDetailList.length; i++) {
              this.salesSlip.quotationDetailList[i].qdOrderId = this.$route.query.qId
              this.salesSlip.quotationDetailList[i].qdCustomerId = this.$route.query.qCustomerId
              let partPrince = this.salesSlip.quotationDetailList[i].qdRealTimePrice
              qPrice += partPrince * this.salesSlip.quotationDetailList[i].qdNumber
              if (this.salesSlip.quotationDetailList[i].qdPartsId === '') {
                inputFlag[i] = 1
              }
            }
            this.salesSlip.qPrice = qPrice
            if (this.salesSlip.quotationDetailList.length > 0) {
              let state = 1
              inputFlag.forEach((value, index) => {
                if (inputFlag[index]) {
                  state = 0
                  alert("您填的第" + (index + 1) * 1 + "个零件或整件无法被检索到")
                }
              })
              if (state === 1) {
                PostData('quotationDetail/addQuotationDetail', this.salesSlip)
                  .then(res => {
                    this.$message({
                      type: 'success',
                      message: '增加报价单成功'
                    })
                    // this.$router.back()
                    this.$router.push({
                      path: '/Slips/salesSlipDetails',
                      query: {qId: this.$route.query.qId, qCustomerId: this.$route.query.qCustomerId}
                    })
                  })
              }
            }
          } else {
            alert("请按要求填写")
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
