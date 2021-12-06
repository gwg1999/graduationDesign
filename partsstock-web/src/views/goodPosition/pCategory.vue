<template>
  <div>
    <el-button type="primary" v-if="pCateList.length===0" @click="addFirst">添加第一层目录</el-button>
    <el-dialog
      title="添加零件类目"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="pCateForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <!--      <el-form-item label="上级位置" prop="name" v-if="positionForm.parentid===0">-->
        <!--        <el-input type="text" v-model="positionForm.parentName" disabled></el-input>-->
        <!--      </el-form-item>-->
        <el-form-item label="零件类目名" prop="name">
          <el-input type="text" v-model="pCateForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>
    <div class="block">
      <el-tree
        :data="pCateList"
        node-key="id"
        accordion
        default-expand-all
        :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.data.name }}</span>
        <span>
          <el-button
            type="primary"
            size="small"
            class="posBtn"
            v-if="data.parentid===0"
            @click="() => appendCurrentLevel(data)">
            添加本层
          </el-button>
          <el-button
            type="primary"
            size="small"
            class="posBtn"
            @click="() => append(data)">
            添加下一层
          </el-button>
          <el-button
            type="danger"
            size="small"
            class="posBtn"
            @click="() => remove(data)">
            删除
          </el-button>
          <!--          <el-button type="primary" @click="show(node,data)">显示</el-button>-->
        </span>
      </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import {PostData} from "@/api";
import qs from 'qs'
import Cookie from "js-cookie";
export default {
  name: "Car",
  data(){
    return {
      dialogVisible: false,
      pCateForm:{
        parentName:'',
        type:2,
        status:1
      },
      pCateList:[],
      pCateQuery:{
        status:1,
        type:2
      },
      deleteQuery:{}
    }
  },
  created() {
    this.getPCateList()
  },
  methods:{
    getPCateList(){
      PostData('/position/selectCatalogue',qs.stringify(this.pCateQuery)).then((ref=>{
        this.pCateList=ref
        console.log(ref);
      }))
    },
    append(data) {
      this.pCateForm={
        parentName:'',
        type:2,
        status:1
      }
      this.pCateForm.parentName=data.name
      this.pCateForm.parentid=data.id
      this.pCateForm.grade=data.grade+1
      this.pCateForm.userName=Cookie.get('username')
      this.dialogVisible=true
    },
    appendCurrentLevel(data){
      this.pCateForm={
        parentName:'',
        type:2,
        status:1
      }
      this.pCateForm.parentName=data.name
      this.pCateForm.parentid=0
      this.pCateForm.grade=1
      this.pCateForm.userName=Cookie.get('username')
      this.dialogVisible=true
    },
    addFirst(){
      this.pCateForm={
        parentName:'',
        type:2,
        status:1
      }
      this.pCateForm.parentid=0
      this.pCateForm.grade=1
      this.pCateForm.userName=Cookie.get('username')
      this.dialogVisible=true
    },
    remove(data) {
      this.deleteQuery.id=data.id
      console.log(this.deleteQuery);
      PostData('/position/deleteCatalogue',qs.stringify(this.deleteQuery)).then((ref)=>{
        this.$message({
          message:'删除成功',
          type:"success"
        })
        this.getPCateList()
      })
    },
    show(node,data){
      console.log(node);
      console.log(data)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PostData('/position/addCatalogue',qs.stringify(this.pCateForm)).then((ref)=>{
            if(ref.code===500){
              this.$message({
                type:"warning",
                message:ref.cause
              })
            }
            else {
              this.$message({
                message:'添加成功',
                type:'success'
              })
              this.getPCateList()
              this.dialogVisible=false
            }
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  color: #c26a3e;
}
.posBtn{
  padding: 3px;
}
.block{
  width: 40%;
  margin: 80px auto;
}
</style>
