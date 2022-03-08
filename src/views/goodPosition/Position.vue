<template>
  <div>
    <el-button type="primary" v-if="positionList.length===0" @click="addFirst">添加第一层目录</el-button>
    <el-dialog
      title="添加货物位置"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="positionForm" status-icon :rules="rules" ref="positionForm" label-width="100px" class="demo-ruleForm">
        <!--      <el-form-item label="上级位置" prop="name" v-if="positionForm.parentid===0">-->
        <!--        <el-input type="text" v-model="positionForm.parentName" disabled></el-input>-->
        <!--      </el-form-item>-->
        <el-form-item label="位置名" prop="name">
          <el-input type="text" v-model="positionForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>
    <div class="block">
      <el-tree
        :data="positionList"
        node-key="id"
        :props="defaultProps"
        :default-expanded-keys="expandedKeys"
        :expand-on-click-node="false"
         class="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="tree-data">{{ data.name }}</span>
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
  name: "Position",
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
      positionForm:{
        parentName:'',
        type:0,
        status:1
      },
      positionList:[],
      positionQuery:{
        status:1,
        type:0
      },
      deleteQuery:{},
      rules:{}
    }
  },
  created() {
    this.getPositionList()
  },
  updated() {
    this.changeColor();
  },
  methods:{
    getPositionList(){
      PostData('/position/selectCatalogue',qs.stringify(this.positionQuery)).then((ref=>{
        this.positionList=ref
        console.log(ref);
        console.log(Cookie.get('username'));
      }))
    },
    append(data,node) {
      this.positionForm={
        parentName:'',
        type:0,
        status:1
      }
      this.flag=true
      this.copyNode=node
      this.positionForm.parentName=data.name
      this.positionForm.parentid=data.id
      this.positionForm.grade=data.grade+1
      this.positionForm.userName=Cookie.get('username')
      this.dialogVisible=true
    },
    appendCurrentLevel(data,node){
      this.positionForm={
        parentName:'',
        type:0,
        status:1
      }
      this.flag=false
      this.copyNode=node
      this.positionForm.parentName=data.name
      this.positionForm.parentid=0
      this.positionForm.grade=1
      this.positionForm.userName=Cookie.get('username')
      this.dialogVisible=true
    },
    addFirst(){
      this.positionForm={
        parentName:'',
        type:0,
        status:1
      }
      this.positionForm.parentid=0
      this.positionForm.grade=1
      this.positionForm.userName=Cookie.get('username')
      this.dialogVisible=true
    },
    edit(data,node){
      console.log(data);
      this.positionForm=Object.assign({},data)
      this.positionForm.userName=Cookie.get('username')
      this.positionForm.time=undefined
      this.dialogVisible=true
      this.copyNode=node
    },
    remove(data,node) {
      this.deleteQuery.id=data.id
      console.log(this.deleteQuery);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PostData('/position/deleteCatalogue',qs.stringify(this.deleteQuery)).then((ref)=>{
          this.$message({
            message:'删除成功',
            type:"success"
          })
          this.getPositionList()
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
    changeColor() {
      // var content = document.getElementsByClassName('el-tree-node__content');
      // console.log(content);
      // for (var i = 0; i < content.length; i++) {
      //   if (i % 2 === 0) {
      //     content[i].style.background = 'red';
      //   } else {
      //     content[i].style.background = '';
      //   }
      // }
    },
    submitForm() {
      this.$refs['positionForm'].validate((valid) => {
        if (valid) {
          if(this.positionForm.id){
            PostData('/position/updateCatalogue',qs.stringify(this.positionForm)).then((ref=>{
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
                this.getPositionList()
                this.dialogVisible=false
                console.log(this.copyNode)
                this.expandedKeys=[this.copyNode.parent.data.id]
              }
            }))
          }
          else {
            PostData('/position/addCatalogue',qs.stringify(this.positionForm)).then((ref)=>{
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
                this.getPositionList()
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
