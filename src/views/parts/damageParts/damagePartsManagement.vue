<template>
  <div>
    <div class="app-container" >
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-form-item>
          <el-input v-model="queryDamageParts.partsName"  clearable placeholder="零件名称" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            v-model="queryDamageParts.DamagePartsCreateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="坏件信息创建日期"
            end-placeholder="坏件信息结束日期"
            @change="getList()"
            style="width: 420px">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList(1)">查 询</el-button>

        <el-button type="primary" icon="el-icon-circle-plus" style="position: absolute;right: 10px" @click="openAddDamageParts">添加</el-button>
      </el-form>
      <!--      销售单管理列表-->
      <el-table
        :data="damagePartsList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            {{ (queryDamageParts.pageNum - 1) * queryDamageParts.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="parts.pName" label="零件名称" width="300px" align="center" />
        <el-table-column prop="number" label="损坏数量"  width="100px"   align="center"/>
        <el-table-column prop="amount" label="单价"  width="100px"   align="center"/>
        <el-table-column prop="date" label="产生日期"  width="100px"   align="center"/>
        <el-table-column prop="note" label="备注"   align="center"/>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"   @click="openDamageParts(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"  @click="deleteDamageParts(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      修改额外订单信息-->
      <el-dialog :visible.sync="dialogDamagePartsFormVisible" title="修改额外订单信息"
      width="60%">
        <el-form :model="damagePartsModify" label-width="120px" :rules="rules" ref="damagePartsModify">
          <el-form-item label="数量" prop="number" style="width: 600px">
            <el-input @keyup.native="damagePartsModify.number = number(damagePartsModify.number)" v-model="damagePartsModify.number"/>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="damagePartsModify.note" style="width: 90%"  rows="5" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDamagePartsFormVisible = false">取 消</el-button>
          <el-button :disabled="damagePartsBtnButton" type="primary"
                     @click="UpdateDamageParts()">确 定</el-button>
        </div>
      </el-dialog>
      <!--      分页-->
      <el-pagination
        :current-page="queryDamageParts.pageNum"
        :page-size="queryDamageParts.pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
      <!--      添加坏件-->
      <el-dialog :visible.sync="dialogDamagePartsVisible" title="坏件添加" width="60%">
        <el-form :model="damageParts" label-width="80px" :rules="rules" ref="damageParts">
          <el-form-item label="名称" prop="partsId" style="width: 600px">
            <el-select
              v-model="damageParts.partsId" filterable clearable placeholder="请选零件"
              ref="agentSelect"
              :filter-method="partListFilter"
              @hook:mounted="cancelReadOnly"
              @visible-change="cancelReadOnly"
              style="width: 600px" @change="cacheInfo($event)">
              <el-option
                v-for="part in partList"
                :key="part.pId"
                :label="`${part.pName}`"
                :value="part.pId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="数量" prop="number" style="width: 600px">
            <el-input @keyup.native="damageParts.number = number(damageParts.number)" v-model="damageParts.number"/>
          </el-form-item>
          <el-form-item label="单价" prop="amount" style="width: 600px">
            <el-input @keyup.native="damageParts.amount = oninput(damageParts.amount)" v-model="damageParts.amount"/>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="damageParts.note" style="width: 90%"  rows="5" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDamagePartsVisible = false">取 消</el-button>
          <el-button :disabled="damagePartsBtnButton" type="primary"
                     @click="AddDamageParts()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {PostData} from "@/api";
import {getTime} from "@/views/Slips/myUtils";

export default {
  data(){
    return {
      //价格数组
      damagePartsPrice:{},
      //添加零件时的坏件信息
      damagePartsInfo:{},
      //零件列表
      partNameList:[],
      partList:[],
      //坏件弹框
      dialogDamagePartsVisible:false,
      damageParts:{},
      //分页
      total:0,
      queryDamageParts:{
        pageNum:1,
        pageSize:10
      },
      //修改弹框
      damagePartsBtnButton:false,
      dialogDamagePartsFormVisible:false,
      damagePartsModify:{},
      //坏件列表
      damagePartsList:[],
      rules:{
        number:[
          {required:true,message:'填写坏件数量',trigger:"change"}
        ],
        partsId:[
          {required:true,message:"请选择坏件名称",trigger:'change'}
        ],
        amount:[
          {required:true,message:"请输入坏件单价",trigger:'change'}
        ]
      }

    }
  },
  created() {
    this.getList()
    this.getPartList()
  },
  methods: {
    //价格选择
    cacheInfo(params){
     this.partList.forEach((value)=>{
        if(value.pId===params){
        this.damagePartsPrice=value
        }
      })
      this.damageParts.amount=this.damagePartsPrice.pMiddlePrice
    },
    //坏件弹框
    openAddDamageParts(){
      if (this.$refs['damageParts'] !== undefined)
        this.$refs['damageParts'].resetFields();
      this.dialogDamagePartsVisible=true
    },
    AddDamageParts(){
      this.partList.forEach(value => {
        if(value.pId===this.damageParts.partsId){
          this.damageParts.partsName=value.pName
        }
      })
      this.$refs['damageParts'].validate((valid)=>{
        if(valid){
          PostData('/partsBad/insert',this.$qs.stringify(this.damageParts)).then(res=>{
            this.$message({
              type: 'success',
              message: '添加坏件成功'
            })
            this.dialogDamagePartsVisible=false
            this.getList()
          })
        }
      })
    },
    //获取零件
    getPartList(){
      PostData('parts/selectAllByEnabled',{pageNum:1,pageSize:20000,pPartsStatus:1})
        .then(res=>{
          this.partNameList=res.list
        })
    },
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
    // 零件显示列表
    partListFilter(query = ''){
      if(query!==''){
        let PinyinMatch = this.$pinyinmatch;
        if (query) {
          let result = [];
          this.partNameList.forEach(i => {
            let m = PinyinMatch.match(i.pName, query);
            if (m) {
              result.push(i);
            }
          });
          if(result.length>20){
            this.partList = result.slice(0, 20);
          } else
          {
            this.partList=result
          }
        }
      }else {
        this.partList=[]
      }
    },
    //获取额外订单信息列表
    getList(pageNum=1){
      this.queryDamageParts.pageNum=pageNum
      if(this.queryDamageParts.DamagePartsCreateTime){
        this.queryDamageParts.startTime=getTime(this.queryDamageParts.DamagePartsCreateTime[0])
        this.queryDamageParts.endTime=getTime(this.queryDamageParts.DamagePartsCreateTime[1])
      }else {
        this.queryDamageParts.startTime=undefined
        this.queryDamageParts.endTime=undefined
      }
      if(this.queryDamageParts.partsName===""){
        this.queryDamageParts.partsName=undefined
      }
      PostData('partsBad/selectAllByLike',this.$qs.stringify(this.queryDamageParts)).then(res=>{
        res.list.forEach(value=>{
          value.date=getTime(value.date)
        })
        console.log(res.list)
        this.damagePartsList=res.list
        this.total=res.total
      })
    },
    //打开修改额外订单信息
    openDamageParts(params){
      this.dialogDamagePartsFormVisible=true
      this.damagePartsModify=JSON.parse(JSON.stringify(params))
    },
    //修改额外订单信息
    UpdateDamageParts(){
      this.$refs['damagePartsModify'].validate((valid)=>{
        this.damagePartsModify.date=undefined
        let ModifyData={}
        ModifyData.note=this.damagePartsModify.note
        ModifyData.id=this.damagePartsModify.id
        ModifyData.number=this.damagePartsModify.number
        PostData('partsBad/update',this.$qs.stringify(ModifyData)).then(res=>{
          this.$message({
            type: 'success',
            message: '修改额外订单信息成功'
          })
          this.dialogDamagePartsFormVisible=false
          this.getList()
        })
      })
    },
    //删除额外订单信息
    deleteDamageParts(params){
      this.$confirm('是否将进行退款' + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let deleteOtherFee={}
        deleteOtherFee.id=params
        console.log(deleteOtherFee)
        PostData('partsBad/delete', this.$qs.stringify(deleteOtherFee)).then(res => {
          this.$message({
            type: 'success',
            message: '删除坏件信息成功'
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
    },
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
