<template>
<div>
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
        @change="handleTranChange"
        :data="data">
        <span slot-scope="{ option }">
          <el-popover placement="left-end" title="零件详情:" width="500" trigger="hover" @show="showStockDetail(option.part)">
            <div class="partDetail">
              <el-row :gutter="20">
                <el-col :span="12"><i class="partLabel">零件名:</i>{{option.part.pName}}</el-col>
                <el-col :span="12"><i class="partLabel">零件号:</i>{{option.part.pNumber}}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12"><i class="partLabel">库存数:</i>{{option.part.pRealInventory}}</el-col>
                <el-col :span="12"><i class="partLabel">退货周期:</i>{{option.part.pReturnCycle}}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12"><i class="partLabel">进价:</i>{{option.part.pBuyingPrice}}</el-col>
                <el-col :span="12"><i class="partLabel">备注:</i>{{option.part.pNote}}</el-col>
              </el-row>
            </div>
            <i style="font-style: normal" slot="reference">{{ option.label }}</i>
<!--                      <el-button slot="reference">hover 激活</el-button>-->
          </el-popover>
        </span>
<!--        <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>-->
<!--        <el-button class="transfer-footer" slot="right-footer" size="small" @click="option">操作</el-button>-->
        <div class="transfer-footer" slot="right-footer">
          <el-select  v-model="cuIdValue" filterable placeholder="选择客户" style="width: 62%">
            <el-option
              v-for="item in customerList"
              :label="item.cuUnitName"
              :value="item.cuId">
              <span style="float: left">{{ item.cuUnitName }}</span>
              <!--        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
            </el-option>
          </el-select>
          <el-button size="small" type="primary" @click="option" style="float: right">操作</el-button>
        </div>
      </el-transfer>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="85%"
        :before-close="handleClose">
        <el-form :model="parts" ref="parts" label-width="100px" class="demo-dynamic">
          <div v-for="(item,index) in parts.selectedPart" style="display: flex;justify-content: space-around">
            <el-form-item :label="'零件' + index+':'" :prop="'selectedPart.' + index+'.pName'" :rules="rules.pName">
              <el-input v-model="item.pName" :disabled="true" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="供货周期:" :prop="'selectedPart.'+index+'.indDeliveryCycle'" :rules="rules.indDeliveryCycle">
              <el-input placeholder="请输入数字" v-model="item.indDeliveryCycle" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="单价:" :prop="'selectedPart.'+index+'.indPrice'" :rules="rules.indPrice">
              <el-input placeholder="请输入数字" v-model="item.indPrice" style="width: 200px">
<!--                <el-select v-model="item.indPrice" slot="append" placeholder="请选择" @focus="getPrice(item.pName)">-->
<!--                  <el-option :label="partPrice[0].pLowPrice" :value="partPrice[0].pLowPrice"></el-option>-->
<!--                  <el-option :label="partPrice[0].pMiddlePrice" :value="partPrice[0].pMiddlePrice"></el-option>-->
<!--                  <el-option :label="partPrice[0].pHighPrice" :value="partPrice[0].pHighPrice"></el-option>-->
<!--                </el-select>-->
              </el-input>
            </el-form-item>
            <el-form-item label="零件数量:" :prop="'selectedPart.'+index+'.indNumber'" :rules="rules.indNumber">
              <el-input-number v-model="item.indNumber" :min="1" label="描述文字" @change="changeVal($event)" @keydown.native="showHistory($event)"></el-input-number>
            </el-form-item>
          </div>
          <div v-for="(item,index) in parts.selectedWhole" style="display: flex;justify-content: space-around">
            <el-form-item :label="'整件' + index+':'" :prop="'selectedWhole.' + index+'.wName'" :rules="rules.wName">
              <el-input v-model="item.wName" :disabled="true" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="供货周期:" :prop="'selectedWhole.'+index+'.indDeliveryCycle'" :rules="rules.indDeliveryCycle">
              <el-input placeholder="请输入数字" v-model="item.indDeliveryCycle" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="单价:" :prop="'selectedWhole.'+index+'.indPrice'" :rules="rules.indPrice">
              <el-input placeholder="请输入数字" v-model="item.indPrice" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="整件数量:" :prop="'selectedWhole.'+index+'.indNumber'" :rules="rules.indNumber">
              <el-input-number v-model="item.indNumber" :min="1" label="描述文字" @change="changeVal($event)"></el-input-number>
            </el-form-item>
          </div>
<!--          <el-form-item-->
<!--            v-for="(item, index) in selectedWhole"-->
<!--            :label="'整件' + index"-->
<!--            :prop="'whole' + index"-->
<!--          >-->
<!--            &lt;!&ndash;            <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>&ndash;&gt;-->
<!--            <el-input placeholder="请输入内容" v-model="item.wName" :disabled="true" style="width: 15%"></el-input>-->
<!--            &lt;!&ndash;            零件大小:&ndash;&gt;-->
<!--            &lt;!&ndash;            <el-select v-model="item.pPartsSizeType" style="width: 10%" placeholder="请选择零件大小" label="零件大小">&ndash;&gt;-->
<!--            &lt;!&ndash;              <el-option label="小" :value="2"></el-option>&ndash;&gt;-->
<!--            &lt;!&ndash;              <el-option label="中" :value="1"></el-option>&ndash;&gt;-->
<!--            &lt;!&ndash;              <el-option label="大" :value="0"></el-option>&ndash;&gt;-->
<!--            &lt;!&ndash;            </el-select>&ndash;&gt;-->
<!--            供货周期:-->
<!--            <el-input placeholder="请输入数字" v-model="item.indDeliveryCycle" style="width: 15%"></el-input>-->
<!--            单价:-->
<!--            <el-input placeholder="请输入数字" v-model="item.indPrice" style="width: 20%"></el-input>-->
<!--            整件数量:-->
<!--            <el-input-number v-model="item.indNumber" :min="1" label="描述文字"></el-input-number>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="submitForm('parts')">提交</el-button>-->
<!--          </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
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
            @change="handleTranChange"
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
    </div>
  </div>
</div>
</template>

<script>
import {PostData} from "@/api";
import qs from 'qs'
import {stopF5F6} from "@/api/stopf5f6"
import Cookie from "js-cookie";
export default {
  name: "stockAdd",
  data() {
    const generateData = _ => {
      const data = [];
      for (let i = 0; i < 15; i++) {
        data.push({
          key: i,
          label: 'dd',
          disabled: i % 4 === 0
        });
        console.log(this.partList);
      }
      return data;
    };
    return {
      data: [],
      wholeData:[],
      wholeList:[],
      // parts:{
      //   list:[]
      // },
      parts:{
        selectedPart:[],
        selectedWhole:[]
      },
      submitInfo:{
        inquiryDetailList:[]
      },
      value:'',
      pKeyValue: [],
      wKeyValue: [],
      renderFunc(h, option) {
        return <span>{ option.key } - { option.label }</span>;
      },
      dialogVisible: false,
      wholeVisible:false,
      fIdValue:'',
      cuIdValue:'',
      wholeQuery:{
        pageSize:0,
        pageNum:0
      },
      priceQuery:{},
      partPrice:[{
        pLowPrice:0,
        pMiddlePrice:0,
        pHighPrice:0
      }],
      factoryList:[],
      customerList:[],
      partList:[],
      selectedPart:[],
      selectedWhole:[],
      partQuery:{
        pageNum:1,
        pageSize:50
      },
      factoryQuery:{
        pageNum:0,
        pageSize:0
      },
      customerQuery:{
        pageNum:0,
        pageSize:0
      },
      rules:{
        pName:[{ required: true, message: '请输入零件名称', trigger: 'blur' }],
        wName: [{ required: true, message: '请输入整件名称', trigger: 'blur' }],
        indDeliveryCycle:[
          { required: true, message: '请输入供货周期', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+$/,message: '只能输入数字',trigger: "blur"}
        ],
        indPrice:[
          { required: true, message: '请输入单价', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '只能输入数字',trigger: "blur"}
        ],
        indNumber:[
          { required: true, message: '请输入数量', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+$/,message: '只能输入数字',trigger: "blur"}
        ]
      }
    }
  },
  created() {
    console.log(Cookie.get('aId'))
    this.getFactory()
    this.getCustomer()
    stopF5F6()
  },
  computed:{

  },
  methods:{
     getFactory(){
       PostData('/factory/selectAllByLike',this.factoryQuery).then((res=>{
         this.factoryList=res.list
       }))
     },
    getCustomer(){
      PostData('/customer/selectAllByLike',this.customerQuery).then((res=>{
        this.customerList=res.list
      }))
    },
    changeVal(){
      this.$forceUpdate();
    },
    showStockDetail(data){
      console.log(data);
    },
    showValue(){
      // console.log(this.$refs['select'].value);
      // console.log(this.partList.length);
      console.log(Cookie.get('aId'));
    },
    handleTranChange(value, direction, movedKeys) {
      console.log(value);
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
            label:res.list[i].pName,
            part:res.list[i]
          });
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    option(){
       if(this.cuIdValue===''){
         alert('请选择客户')
       }
       else if(this.pKeyValue.length===0){
         alert('请选择零件')
       }
       else {
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
             this.wholeVisible=true
           })
         }).catch(() => {
           this.selectedPart.splice(0,this.selectedPart.length)
           for(let i = 0;i < this.pKeyValue.length;i++){
             this.partList[this.pKeyValue[i]].indNumber=1
             this.partList[this.pKeyValue[i]].indType=1
             this.selectedPart.push(this.partList[this.pKeyValue[i]])
           }
           this.parts.selectedPart=this.selectedPart
           this.dialogVisible=true
           console.log(this.selectedPart);
         });
       }
    },
    oldToNew(){
       for(let i=0;i<this.selectedPart.length;i++){
         this.selectedPart[i].indCustomerId=parseInt(this.cuIdValue)
         this.selectedPart[i].indPartsId=parseInt(this.selectedPart[i].pId)
         this.selectedPart[i].indType=1
         this.selectedPart[i].indIsDelivery=0
         this.selectedPart[i].indDeliveryNum=2
       }
      for(let i=0;i<this.selectedWhole.length;i++){
        this.selectedWhole[i].indCustomerId=parseInt(this.cuIdValue)
        this.selectedWhole[i].indPartsId=parseInt(this.selectedWhole[i].wId)
        this.selectedWhole[i].indType=0
        this.selectedWhole[i].indIsDelivery=0
        this.selectedWhole[i].indDeliveryNum=2
      }
    },
    assignment(){
      this.submitInfo.icreateOperatorId=parseInt(Cookie.get('aId'))
      this.submitInfo.icustomId=parseInt(this.cuIdValue)
      this.submitInfo.istatus=0
      this.submitInfo.iprice=0
      this.submitInfo.inquiryDetailList.splice(0,this.submitInfo.inquiryDetailList.length)
      this.submitInfo.inquiryDetailList.push(...this.selectedPart)
      this.submitInfo.inquiryDetailList.push(...this.selectedWhole)
    },
    getPrice(pName){
       this.priceQuery.pName=pName
       PostData('/parts/selectAllByLike',qs.stringify(this.priceQuery)).then((ref)=>{
         console.log(ref.list);
         this.partPrice=ref.list
       })
    },
    openDialog(){
      this.selectedPart.splice(0,this.selectedPart.length)
      for(let i = 0;i < this.pKeyValue.length;i++){
        this.partList[this.pKeyValue[i]].indNumber=1
        this.partList[this.pKeyValue[i]].indType=1
        this.selectedPart.push(this.partList[this.pKeyValue[i]])
      }
      this.selectedWhole.splice(0,this.selectedWhole.length)
      for(let i = 0;i < this.wKeyValue.length;i++){
        this.wholeList[this.wKeyValue[i]].indNumber=1
        this.wholeList[this.wKeyValue[i]].indType=0
        this.selectedWhole.push(this.wholeList[this.wKeyValue[i]])
      }
      this.parts.selectedWhole=this.selectedWhole
      this.parts.selectedPart=this.selectedPart
      this.dialogVisible=true
      console.log(this.selectedPart);
    },
    showHistory(event){
      console.log(event.code);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.oldToNew()
          this.assignment()
          console.log(this.submitInfo);
          PostData("/inquiry/addInquiry",this.submitInfo).then(()=>{
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.dialogVisible=false
            this.$router.push('/stock')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.partDetail{

}
.partLabel{
  font-weight: bold;
  font-style: normal;
  color: deepskyblue;
  font-size: large;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
