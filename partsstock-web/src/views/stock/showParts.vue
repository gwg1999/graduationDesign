<template>
  <div class="app-container" style="background: white">
    <el-dialog
      title="修改零件数量"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="editPartNum" status-icon :rules="rules" ref="editPart" label-width="100px" class="demo-ruleForm">
        <el-form-item label="零件名" prop="pName">
          <el-input v-model="editPartNum.pName" disabled></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="indPrice">
          <el-input v-model="editPartNum.indPrice"></el-input>
        </el-form-item>
        <el-form-item label="零件数量" prop="indNumber">
            <el-input-number v-model="editPartNum.indNumber" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmEdit('editPart')">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="添加零件"
      :visible.sync="addVisible"
      width="40%"
      :before-close="handleClose">
      <el-form :model="addPart" status-icon :rules="rules" ref="addPart" label-width="100px" class="demo-ruleForm">
        <el-form-item label="零件名" prop="indPartsName">
          <el-autocomplete
            v-model="addPart.indPartsName"
            :fetch-suggestions="querySearch"
            placeholder="请输入零件名"
            :trigger-on-focus="false"
            @select="handleSelect">
            <template slot-scope="{ item }">
              <div>{{ item.pName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
        </el-form-item>
<!--        <el-form-item label="类型" prop="indType">-->
<!--          <el-select v-model="addPart.indType" placeholder="请选择">-->
<!--            <el-option label="整件" :value="0"></el-option>-->
<!--            <el-option label="零件" :value="1"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="零件数量" prop="indNumber">
          <el-input-number v-model="addPart.indNumber" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="供货周期" prop="indDeliveryCycle">
          <el-input v-model="addPart.indDeliveryCycle" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="发货周期" prop="indDeliveryNum">
          <el-input v-model="addPart.indDeliveryNum" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="indPrice">
          <el-input v-model="addPart.indPrice" style="width: 30%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmAdd">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="添加整件"
      :visible.sync="addWholeVisible"
      width="40%"
      :before-close="handleClose">
      <el-form :model="addWhole" status-icon :rules="rules" ref="wholeForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="整件名" prop="indPartsName">
          <el-autocomplete
            v-model="addWhole.indPartsName"
            :fetch-suggestions="SearchWhole"
            placeholder="请输入整件名"
            :trigger-on-focus="false"
            @select="handleWholeSelect">
            <template slot-scope="{ item }">
              <div>{{ item.wName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
        </el-form-item>
<!--        <el-form-item label="类型" prop="indType">-->
<!--          <el-select v-model="addPart.indType" placeholder="请选择">-->
<!--            <el-option label="整件" :value="0"></el-option>-->
<!--            <el-option label="零件" :value="1"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="整件数量" prop="indNumber">
          <el-input-number v-model="addWhole.indNumber" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="供货周期" prop="indDeliveryCycle">
          <el-input v-model="addWhole.indDeliveryCycle" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="发货周期" prop="indDeliveryNum">
          <el-input v-model="addWhole.indDeliveryNum" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="indPrice">
          <el-input v-model="addWhole.indPrice" style="width: 30%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addWholeVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmWholeAdd">确 定</el-button>
  </span>
    </el-dialog>
    <el-button type="primary" style="margin-bottom: 3px" @click="addPartMethod">添加零件</el-button>
<!--    <el-button type="primary" style="margin-bottom: 3px" @click="addWholeMethod">添加整件</el-button>-->
    <el-table
      :data="list"
      border
      fit
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
      <el-table-column prop="indPartsName" label="零件名" width="200%"  align="center"/>
<!--      <el-table-column prop="type" label="类型" width="200%" align="center"/>-->
<!--      <el-table-column prop="type" label="类型" width="120%"  align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <h3 v-if="scope.row.type===0">整件</h3>-->
<!--          <h3 v-if="scope.row.type===1">零件</h3>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="indNumber" label="零件数量" width="120%"  align="center"/>
      <el-table-column prop="indPrice" label="零件单价" width="120%"  align="center"/>
      <el-table-column prop="indType" label="类型" width="120%"  align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.indType===0">整件</h3>
          <h3 v-else>零件</h3>
        </template>
      </el-table-column>
      <el-table-column prop="indDeliveryCycle" label="供货周期" width="130%"  align="center"/>
      <el-table-column prop="indDeliveryNum" label="发货数量" width="120%" align="center" />
      <!--      <el-table-column prop="aPassword" label="用户密码" width="120%"  align="center"/>-->
<!--      <el-table-column prop="indPrice" label="零件价格" width="200%"  align="center"/>-->
      <el-table-column prop="indIsDelivery" label="是否能供货" width="120%" align="center">
        <template slot-scope="scope">
          <h3 v-if="scope.row.indIsDelivery===0">
            <el-tag type="danger">否</el-tag>
          </h3>
          <h3 v-else>
            <el-tag>是</el-tag>
          </h3>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button size="mini"  icon="el-icon-edit" type="primary" style="width: auto" @click="editPartNumMethod(scope.row)">修改零件数量</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" style="width: auto" @click="deletePart(scope.$index)">删除该零件</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="backPre" style="float: right;margin-top: 2%">返 回</el-button>
  </div>
</template>
<script>
import {PostData} from "../../api/index"
import qs from 'qs'
export default {
  name: "showParts",
  data(){//定义变量和初始值
    return{
      list: [], //查询之后接口返回集合
      partState:'',//模糊查询后返回的值
      wholeState:'',
      total:0,//总记录数
      stockQuery:{
        pageSize: 10,
        pageNum: 1
      },
      detailQuery:{
        indOrderId:null
      },
      editPartNum:{
        indNumber:1,
        indPrice:0
      },
      addPart:{
        indNumber:1,
        indPartsName:'',
        indDeliveryCycle:null,
        indDeliveryNum:null,
        indPrice:null,
        indType:1
      },
      addWhole:{
        indPartsName:'',
        indNumber:1,
        indDeliveryCycle:null,
        indDeliveryNum:null,
        indPrice:null,
        indType:0
      },
      rules:{
        indPrice:[
          { required: true, message: '请输入单价', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '只能输入数字',trigger: "blur"}
        ],
        indPartsName:[
          { required: true, message: '请输入零整件名', trigger: 'blur' }
        ],
        indDeliveryCycle:[
          { required: true, message: '请输入供货周期', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+$/,message: '只能输入数字',trigger: "blur"}
        ],
        indDeliveryNum:[
          { required: true, message: '请输入发周期', trigger: 'blur' },
          {required: true, pattern: /^[0-9]+$/,message: '只能输入数字',trigger: "blur"}
        ]

      },
      dialogVisible:false,
      addWholeVisible:false,
      addVisible:false,
      selectCondition: {},
      pageTotal: 0,
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
    // this.getPageTotal()
  },
  resetData(){
    this.getList()
  },
  methods:{//创建具体的方法
    getList() {
      // this.list=this.$route.query.partList
      this.detailQuery.indOrderId = JSON.parse(this.$route.query.iId)
      console.log(this.detailQuery.indOrderId);
      PostData('/inquiry/queryInquiryDetail',qs.stringify(this.detailQuery)).then(ref=>{
        console.log(ref);
        this.list=ref
        this.addPart.factoryId=JSON.parse(this.$route.query.factoryId)
        this.addPart.indOrderId=this.list[0].indOrderId
        this.addPart.indCustomerId=this.list[0].indCustomerId
        this.addWhole.factoryId=JSON.parse(this.$route.query.factoryId)
        this.addWhole.indOrderId=this.list[0].indOrderId
        this.addWhole.indCustomerId=this.list[0].indCustomerId
      })
      console.log(this.list);
    },
    backPre(){
      this.$router.back()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    editPartNumMethod(row){
      this.editPartNum.indPartsName=row.indPartsName
      this.editPartNum.indNumber=row.indNumber
      this.editPartNum.indId=row.indId
      this.editPartNum.indPrice=row.indPrice
      this.editPartNum.indOrderId=row.indOrderId
      this.dialogVisible=true
    },
    confirmEdit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/inquiry/editInquiryDetail',this.editPartNum).then(res=>{
            this.list.forEach(item=>{
              if(item.indId===this.editPartNum.indId){
                item.indNumber=this.editPartNum.indNumber
                item.indPrice=this.editPartNum.indPrice
              }
            })
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.dialogVisible=false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    deletePart(index){
      this.editPartNum.indId=this.list[index].indId
      PostData('/inquiry/deleteInquiryDetail',qs.stringify(this.editPartNum)).then(res=>{
        this.list.splice(index,1)
        this.$message({
          showClose: true,
          message: '删除成功成功',
          type: 'success'
        })
      })
    },
    addPartMethod(){
      this.addPart.indPartsName=''
      this.addPart.indNumber=1
      this.addPart.indDeliveryCycle=null
      this.addPart.indDeliveryNum=null
      this.addPart.indPrice=null
      this.addVisible=true
    },
    addWholeMethod(){
      this.addWhole.indPartsName=''
      this.addWhole.indNumber=1
      this.addWhole.indDeliveryCycle=null
      this.addWhole.indDeliveryNum=null
      this.addWhole.indPrice=null
      this.addWholeVisible=true
    },
    querySearch(queryString, cb) {
      this.addPart.pName=queryString;
      this.addPart.pageNum=1
      PostData('/inquiry/selectPartsByFactoryId',qs.stringify(this.addPart)).then(ref=>{
        cb(ref.list)
        console.log(ref.list);
      })

      // 调用 callback 返回建议列表的数据
    },
    SearchWhole(queryString, cb){
      this.addWhole.wName=queryString;
      this.addWhole.pageNum=1
      PostData('/whole/selectAllByLike',qs.stringify(this.addWhole)).then(ref=>{
        cb(ref.list)
        console.log(ref.list);
      })
    },
    handleSelect(item) {
      this.addPart.indPartsName=item.pName
      this.addPart.indPartsId=item.pId
    },
    handleWholeSelect(item){
      this.wholeState=item.wName
      this.addWhole.indPartsName=item.wName
      this.addWhole.indPartsId=item.wId
    },
    confirmAdd(){
      console.log(this.addPart);
      PostData('/inquiry/addInquiryDetail',this.addPart).then(ref=>{
        this.$message({
          type:"success",
          message:"添加成功",
        })
        this.addVisible=false
        this.getList()
      })
    },
    confirmWholeAdd(){
      console.log(this.addWhole);
      PostData('/inquiry/addInquiryDetail',this.addWhole).then(ref=>{
        this.$message({
          type:"success",
          message:"添加成功",
        })
        this.addWholeVisible=false
        this.getList()
      })
    }
  }
}
</script>
<style scoped>

</style>
