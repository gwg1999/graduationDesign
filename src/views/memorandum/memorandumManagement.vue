<template>
  <div>
    <div class="app-container" >
      <!--      查询表单-->
      <el-form :inline="true" class="demo-form-inline" style="position: relative ">
        <el-autocomplete
          v-model="queryMemorandum.aName"
          @change="handleOperator($event)"
          :fetch-suggestions="querySearchAsync"
          clearable
          placeholder="请输入创建人员姓名"
          :trigger-on-focus="false"
          @select="handleSelect(queryMemorandum,$event)"
        >
        </el-autocomplete>
        <el-form-item>
          <el-select v-model="queryMemorandum.status" clearable placeholder="是否解决"
                     @change="getList"
                     style=" margin-left: 10px;width: 150px"  >
            <el-option :value="0" label="未解决"/>
            <el-option :value="1" label="已解决"/>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            v-model="queryMemorandum.createMemorandumTime"
            type="daterange"
            @change="getList"
            range-separator="至"
            start-placeholder="备忘录创建时间开始日期"
            end-placeholder="备忘录创建时间结束日期"
            style="width: 420px">
          </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" style="position: absolute" icon="el-icon-search" @click="getList()">查 询</el-button>
        </el-form-item >
      </el-form>
      <!--      备忘录表-->
      <el-table
        :data="memorandumList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (queryMemorandum.pageNum - 1) * queryMemorandum.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="admin.aName" label="创建人姓名" width="100px" align="center" />
        <el-table-column prop="note" label="备注"  align="center" />
        <el-table-column prop="createTime" label="创建时间" width="100px" align="center" />
        <el-table-column label="备忘录状态" prop="status" width="80px" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status ===1">
              <span style="color:#00B46D">已打款</span>
            </span>
            <span v-else>
              <span style="color:#D75C89">未打款</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope" >
            <el-button   type="primary" size="mini" icon="el-icon-edit"  @click="openUpdateMemorandum(scope.row)">修改</el-button>
            <el-button   type="danger" size="mini" icon="el-icon-delete"  @click="deleteMemorandum(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
        :current-page="queryMemorandum.pageNum"
        :page-size="queryMemorandum.pageSize"
        :total="total"
        style="padding: 30px 0; text-align: center;float: right"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>
    <!--修改备忘录-->
    <el-dialog :visible.sync="dialogMemorandumVisible" title="修改备忘录">
      <el-form :model="memorandumModify" label-width="120px" :rules="rules" ref="memorandumModify">
        <el-form-item label="选择创建人员" prop="operateId">
          <el-select v-model="memorandumModify.operateId" filterable placeholder="选择仓库管理员" >
            <el-option
              v-for="admin in adminList"
              :key="admin.aId"
              :label="admin.aName"
              :value="admin.aId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="解决状态" prop="status">
          <el-select v-model="memorandumModify.status" clearable placeholder="是否解决" style="width: 200px"  >
            <el-option :value="0" label="未解决"/>
            <el-option :value="1" label="已解决"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="memorandumModify.note" style="width: 90%" rows="5" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMemorandumVisible = false">取 消</el-button>
        <el-button :disabled="memorandumBtnDisabled" type="primary"
                   @click="UpdateMemorandum()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {PostData} from "@/api";
import {getTime, reserveTime} from "@/views/Slips/myUtils";
import {commonList} from "@/views/Slips/myApi";
export default {
  data(){
    return{
      adminList:[],
      total:0,
      dialogMemorandumVisible:false,
      memorandumBtnDisabled:false,
      queryMemorandum:{
        pageNum:1,
        pageSize:8
      },
      memorandumList:[],
      memorandumModify:{},
      rules:{
        note: [
          { required: true, message: '请选输入备注信息', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择备忘录状态', trigger: 'change' }
        ],
        operateId:[
          { required: true, message: '请选择备创建人员姓名', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getCommonList()
  },
  watch:{

  },
  methods:{
    handleOperator(event){
      if(event===''){
        this.queryMemorandum.operateId=undefined
        this.getList()
      }
    },
    querySearchAsync(queryString, cb) {
      let adminQuery={}
      adminQuery.aName=queryString
      PostData('admin/selectAdmin',adminQuery).then(res => {
        res.forEach((v)=>{
          v.value=v.aName
        })
        cb(res)
      })
    },
    handleSelect(item,event) {
      this.queryMemorandum.operateId=event.aId
      this.getList()
    },
    getCommonList(){
      commonList('admin/selectAdmin').then(res=>{
        this.adminList=res
      })
    },
    getList(pageNum=1){
      if(this.queryMemorandum.createMemorandumTime){
        this.queryMemorandum.startCreateTime=reserveTime(this.queryMemorandum.createMemorandumTime[0])
        this.queryMemorandum.endCreateTime=reserveTime(this.queryMemorandum.createMemorandumTime[1])
      }else {
        this.queryMemorandum.startCreateTime=undefined
        this.queryMemorandum.endCreateTime=undefined
      }
      if(pageNum>1){
        this.queryMemorandum.pageNum=pageNum
      }
      else{
        this.queryMemorandum.pageNum=1
      }
      PostData('note/selectAllByLike',this.$qs.stringify(this.queryMemorandum))
        .then(res=>{
          res.list.forEach((value)=>{
            value.createTime=getTime(value.createTime)
          })
          this.memorandumList=res.list
          this.total=res.total
        })
    },
    openUpdateMemorandum(params){
      this.dialogMemorandumVisible=true
      if (this.$refs['memorandumModify'] !== undefined)
        this.$refs['memorandumModify'].resetFields();
      // params.operateId=params.admin.aName
      this.memorandumModify=JSON.parse(JSON.stringify(params))
    },
    UpdateMemorandum(){
      this.$refs['memorandumModify'].validate((valid)=>{
        if(valid){
          PostData('note/update',this.memorandumModify)
            .then(res=>{
              this.$message({
                type:'success',
                message:'修改备忘录信息成功'
              })
              this.dialogMemorandumVisible=false
              this.getList()
            })
        }
      })
    },
    deleteMemorandum(id){
      this.$confirm('是否将此备忘录信息删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        let Memorandum={}
        Memorandum.id=id
        PostData('note/delete',Memorandum)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除备忘录信息成功'
            })
            this.getList()
          })
      })
    }
  }
}
</script>

<style scoped>

</style>
