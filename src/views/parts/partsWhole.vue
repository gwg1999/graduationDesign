<template>
  <div class="app-container" style="background: white">
    <el-dialog
      title="整件添加零件"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="whole" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="0" v-for="(item,index) in this.whole.partsMap">
          <el-col :span="12">
            <el-tag>零件名:{{item.pName}}</el-tag>
          </el-col>
          <el-col :span="12"><el-tag>零件数量:{{item.num}}</el-tag></el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">
        <el-form-item>
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="请输入零件名"
            :trigger-on-focus="false"
            @select="handleSelect">
            <template slot-scope="{ item }">
              <div>{{ item.pName }}</div>
            </template>
          </el-autocomplete>
          <el-input v-model="pGoodsNum" placeholder="请输入零件号" style="width: 30%;margin-left: 3px;margin-right: 3px" class="search"></el-input>
          <el-cascader
            ref="pCatCascader"
            :options="categoryOption"
            placeholder="请选择零件类目"
            :props="{value:'name', label:'name'}"
            @change="handleChange(pCategoryList)"
            :show-all-levels="false"
            v-model="pCategoryList"
            class="search"
            clearable>
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>
        <div style="float: right">
          <el-button type="primary" @click="backPre">返 回</el-button>
          <el-button type="primary" icon="el-icon-view" @click="showSelected">查看已选零件({{computeNum}})</el-button>
        </div>
      </template>
    </el-form>
    <!-- 表格 -->
    <el-table use-virtual
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column
        label="序号"
        width="50%"
        align="center">
        <template slot-scope="scope">
          {{ (partQuery.pageNum - 1) * partQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!--      <el-table-column prop="pId" label="零件号" width="50%" align="center" hidden/>-->
      <!--      <el-table-column prop="pCategoryId" label="零件类目" width="50%" align="center" />-->
      <el-table-column prop="pId" label="序列号" width="80px" align="center" />
      <el-table-column prop="pNumber" label="零件号" width="150px" align="center" />
      <el-table-column prop="pName" label="零件名" width="200px" align="center" />
      <el-table-column prop="place.plName" label="产地或品牌" width="120px"  align="center"/>
      <el-table-column prop="unit.uName" label="单位" width="60px" align="center"/>
      <el-table-column prop="pLowPrice" label="一级价格" width="80px"  align="center"/>
      <el-table-column prop="pMiddlePrice" label="二级价格" width="80px" align="center" />
      <el-table-column prop="pHighPrice" label="三级价格" width="80px"  align="center"/>
      <el-table-column prop="pBuyingPrice" label="进价" width="80px"  align="center"/>
      <el-table-column prop="pRealInventory" label="库存数" width="70px"  align="center"/>
      <el-table-column prop="pReturnCycle" label="退货周期（天）" width="90px"  align="center"/>
      <el-table-column prop="pId" label="零件数目" align="center">
        <template slot-scope="scope">
          <div style="display: flex;justify-content: space-between">
            <el-input-number v-model = "scope.row.num" label="请输入数量" size="small"></el-input-number>
            <el-button type="primary" icon="el-icon-circle-plus" @click="addPart(scope.row)">添加</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--    <el-form>-->
    <!--      <el-button :disabled="saveBtnDisabled" type="primary" @click="save" >保存</el-button>-->
    <!--    </el-form>-->
    <!--    <el-button type="primary" @click="backPre">返 回</el-button>-->
    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="partQuery.pageSize"
      :current-page="partQuery.pageNum"
      :total="pageTotal"
      style="padding: 30px 0; text-align: right;"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import {PostData} from "../../api/index"
import qs from "qs"
import request from "@/utils/request";
// export const PostData = (url, body) =>{
//   return request({
//     url: `http://192.168.31.135:8080/` + url,
//     method: 'post',
//     data: body,
//   })
// };

export default {
  name: "list",
  data(){//定义变量和初始值
    return{
      min:65535,
      categoryOption:[],
      pCategoryList:[],
      flag:false,
      dialogVisible: false,
      pGoodsNum:'',
      sequeNum:'',
      realInventory:'',
      list: [], //查询之后接口返回集合
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      partQuery:{
        pId:null,
        pName:null,
        pageSize: 10,
        pageNum: 1,
      },
      rules:{},
      whole:{
        partsMap: [],
        wholeId:null
      },
      partsWhole:{
        partsId:null,
        partsNum:null,
        wholeId:null
      },
      pCateQuery:{
        status:1,
        type:2
      },
      searchQuery:{
        pName:'',
        pNumber:'',
        pCategoryId:'',
        pageSize: 10,
        pageNum: 1
      },
      selectCondition: {},
      pageTotal: 0,
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
    this.getPCate()
    this.partsWhole.wholeId = localStorage.getItem('wId')
    this.whole.wholeId = localStorage.getItem('wId')
  },
  computed:{
    computeNum:function (){
      return this.whole.partsMap.length
    },
  },

  resetData(){
    // this.getList()
    // this.getPageTotal()
  },
  methods:{//创建具体的方法
    backPre(){
      this.$router.back()
    },
    addPart(item){
      let temp=Object.assign({},item)
      let flag=false
      if(temp.num){
        for(let part of this.whole.partsMap){
          if(item.pId===part.pId) {
            part.num += item.num
            part.partsNum=part.num+''
            flag = true
            this.$message({
              message: '已修改整件里的零件数量',
              type: "success"
            })
          }
        }
        if(!flag){
          temp.partsId=temp.pId+''
          temp.partsNum=temp.num+''
          this.whole.partsMap.push(temp)
          this.$message({
            message:'已添加至已选零件库',
            type:"success"
          })
        }
      }
      else {
        this.$message({
          message:'请输入零件数量',
          type:"warning"
        })
      }
    },
    getPCate(){
      PostData('/position/selectCatalogue',qs.stringify(this.pCateQuery)).then((ref)=>{
        this.categoryOption=this.getTreeData(ref)
      })
    },
    getTreeData(data){
      for(let i=0;i<data.length;i++){
        if(data[i].children.length<1){
          // children若为空数组，则将children设为undefined
          data[i].children=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    handleChange(value) {
      this.parts.pCarName=value.join("/")
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.whole);
          PostData('partsWhole/insertPartWhole',this.whole)
            .then(res=>{
              this.$message({
                type:'success',
                message:'添加成功'
              })
            }).catch(()=>{})
          this.$router.push({path:'/whole'})
        } else {
          return false;
        }
      });
    },
    showSelected(){
      this.dialogVisible=true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleChangeNum(param) {
      this.flag = false;
      this.whole.amount = parseInt(param.pRealInventory) / parseInt(param.num);
      this.whole.amount = parseInt(this.whole.amount)
      if (parseInt(param.pRealInventory) < parseInt(param.num))
      {
        this.whole.amount = this.min = 0
      }
      if(parseInt(this.amount) < parseInt(this.min))
      {
        this.min = this.amount
        this.whole.amount = parseInt(this.min)
      }
      for (var i in this.whole.partsMap){
        let data = param.pId
        if(this.whole.partsMap[i].partsId === data){
          this.whole.partsMap[i].partsNum = param.num
          this.flag = true
        }
      }
      if(!this.flag)
      {
        var partsMap = {partsId:param.pId, partsNum:param.num}
        this.whole.partsMap.push(partsMap)
      }
    },
    getList() {
      PostData('parts/selectAllByEnabled',this.searchQuery)
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    getPartList(){
      this.partQuery.pName = this.state
      PostData('parts/selectAllByLike',this.partQuery)
        .then(res=>{
          this.list=res
        }).catch(err=>{
        this.$message.error(err.message);
      })
    },

    getPageTotal(){
      this.selectCondition = JSON.parse(JSON.stringify(this.partQuery))
      this.selectCondition.pageNum = this.selectCondition.pageSize = 0
      PostData('parts/selectAll',this.selectCondition).then(res=>{
        this.pageTotal = res.length
      })
    },
    // 分页处理
    handlePageChange(val){
      this.searchQuery.pageNum = val
      this.getList()
    },
    search(){
      this.searchQuery.pageNum=1
      this.partQuery.pId=this.sequeNum
      this.searchQuery.pName=this.state
      this.searchQuery.pNumber=this.pGoodsNum
      this.searchQuery.pCategoryId=this.pCategoryList.join("/")
      this.getList()
    },
    // 跳转详情页
    showDetails(index){
      localStorage.setItem('pId',this.list[index].pId)
      this.$router.push('/parts/editPart')
    },
    editCancel(index,param){
      this.$confirm('是否将此零件'+(param.pPartsStatus===0?'上架':'下架')+'?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list[index].pPartsStatus = 1 - this.list[index].pPartsStatus
        PostData('/parts/deleteByLogic',this.list[index])
          .then(res=>{
            this.getList()
            this.$message({
              type: 'success',
              message: '注销成功!'
            })
          })
      })
    },
    querySearch(queryString, cb) {
      this.partQuery.pName=queryString;
      PostData('parts/selectAllByLike',this.partQuery).then(ref=>{
        cb(ref.list)
      })
    },

    save(){
      PostData('partsWhole/insertPartWhole',this.whole)
        .then(res=>{
          console.log(res);
          this.$message({
            type:'success',
            message:'整件添加零件成功'
          })
        }).catch(()=>{})
      this.$router.push({path:'/whole'})
    },

    handleSelect(item) {
      this.state=item.pName
    }
  }
}
</script>
<style scoped>
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
