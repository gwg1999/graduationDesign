<template>
  <div>
    <el-button type="primary" v-if="carList.length===0" @click="addFirst">添加第一层目录</el-button>
    <el-dialog
      title="添加车型号目录"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="carForm" status-icon :rules="rules" ref="carForm" label-width="100px" class="demo-ruleForm">
        <!--      <el-form-item label="上级位置" prop="name" v-if="positionForm.parentid===0">-->
        <!--        <el-input type="text" v-model="positionForm.parentName" disabled></el-input>-->
        <!--      </el-form-item>-->
        <el-form-item label="车型号名" prop="name">
          <el-input type="text" v-model="carForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>
    <div class="block">
      <el-tree
        :data="carList"
        node-key="id"
        :props="defaultProps"
        :default-expanded-keys="expandedKeys"
        :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span>
          <el-button
            type="primary"
            size="small"
            class="posBtn"
            v-if="data.parentid===0"
            @click="() => appendCurrentLevel(data,node)">
            添加本层
          </el-button>
          <el-button
            type="primary"
            size="small"
            class="posBtn"
            @click="() => append(data,node)">
            添加下一层
          </el-button>
          <el-button
            type="success"
            size="small"
            class="posBtn"
            @click="() => edit(data,node)">
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            class="posBtn"
            @click="() => remove(data,node)">
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
      //区分本层和下一层
      flag:'',
      //优化
      defaultProps:{
        children:"children",
        label:'name'
      },
      copyNode:{},
      expandedKeys:[],
      dialogVisible: false,
      carForm:{
        parentName:'',
        type:1,
        status:1
      },
      carList:[],
      carQuery:{
        status:1,
        type:1
      },
      deleteQuery:{},
      rules: {}
    }
  },
  created() {
    this.getCarList()
  },
  methods:{
    getCarList(){
      PostData('/position/selectCatalogue',qs.stringify(this.carQuery)).then((ref=>{
        this.carList=ref
        console.log(ref);
      }))
    },
    append(data,node) {
      this.carForm={
        parentName:'',
        type:1,
        status:1
      }
      this.flag=true
      this.copyNode=node
      this.carForm.parentName=data.name
      this.carForm.parentid=data.id
      this.carForm.grade=data.grade+1
      this.carForm.userName=Cookie.get('username')
      this.dialogVisible=true
    },
    appendCurrentLevel(data,node){
      this.carForm={
        parentName:'',
        type:1,
        status:1
      }
      this.flag=false
      this.copyNode=node
      this.carForm.parentName=data.name
      this.carForm.parentid=0
      this.carForm.grade=1
      this.carForm.userName=Cookie.get('username')
      this.dialogVisible=true
    },
    addFirst(){
      this.carForm={
        parentName:'',
        type:1,
        status:1
      }
      this.carForm.parentid=0
      this.carForm.grade=1
      this.carForm.userName=Cookie.get('username')
      this.dialogVisible=true
    },
    edit(data,node){
      console.log(data);
      this.carForm=Object.assign({},data)
      this.carForm.userName=Cookie.get('username')
      this.carForm.time=undefined
      this.dialogVisible=true
      this.flag=false
      this.copyNode=node
    },
    remove(data,node) {
      this.deleteQuery.id=data.id
      console.log(this.deleteQuery);
      this.$confirm('此操作将永久删除该目录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PostData('/position/deleteCatalogue',qs.stringify(this.deleteQuery)).then((ref)=>{
          this.$message({
            message:'删除成功',
            type:"success"
          })
          this.getCarList()
          this.expandedKeys=[node.parent.data.id]
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
    submitForm() {
      this.$refs["carForm"].validate((valid) => {
        if (valid) {
          if(this.carForm.id){
            PostData('/position/updateCatalogue',qs.stringify(this.carForm)).then((ref=>{
              if(ref.code===500){
                this.$message({
                  type:"warning",
                  message:ref.cause
                })
              }
              else {
                this.$message({
                  message:'修改成功',
                  type:'success'
                })
                this.getCarList()
                this.dialogVisible=false
                console.log(this.copyNode)
                this.expandedKeys=[this.copyNode.parent.data.id]
              }
            }))
          }
          else {
            PostData('/position/addCatalogue',qs.stringify(this.carForm)).then((ref)=>{
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
                this.getCarList()
                this.dialogVisible=false
                if(this.flag){
                  this.expandedKeys=[this.copyNode.data.id]
                }
              }
            })
          }
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
  font-size: 14px;
  color: #c26a3e;
}
.posBtn{
  padding: 3px;
}
.block{
  width: 40%;
  margin-left: 5%;
  margin-top: 5%;
}
</style>
