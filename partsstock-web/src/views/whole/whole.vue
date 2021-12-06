<!--<meta http-equiv="X-UA-Compatible" content="IE=8">-->
<!--<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />-->
<template>
  <div class="app-container" style="background: white">
    <router-view v-if="isRouterAlive"></router-view>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">
        <el-form-item>
<!--          <el-input v-model="wholeQuery.wName" clearable placeholder="整件名称"  style="width: 150px"/>-->
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            @select="handleSelect">
            <!--      <i-->
            <!--        class="el-icon-edit el-input__icon"-->
            <!--        slot="suffix"-->
            <!--        @click="handleIconClick">-->
            <!--      </i>-->
            <template slot-scope="{ item }">
              <div>{{ item.wName }}</div>
              <!--        <span class="addr">{{ item.address }}</span>-->
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>


        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 10px" @click="add()">添加</el-button>
      </template>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row>
      <el-table-column
        label="序号"
        width="90"
        align="center">
        <template slot-scope="scope">
          {{ (wholeQuery.pageNum - 1) * wholeQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!--<el-table-column prop="wId" label="整件id" width="50" align="center" />-->
      <el-table-column prop="wName" label="整件名称" width="360%" align="center" />
      <el-table-column prop="wAlarmNumber" label="告警量（下限）" width="220%"  align="center"/>
<!--      <el-table-column prop="wNumber" label="整件数量" width="220%"  align="center"/>-->
      <!--     <el-table-column prop="pNote" label="备注" width="80"  align="center"/>-->
      <!--      <el-table-column prop="pPicture" label="图片" width="120"  align="center"/>-->
      <!--<el-table-column prop="pRealInventory" label="实际库存数" width="50"  align="center"/>-->
      <!--      <el-table-column prop="pPartsSizeType" label="零件大小" width="100"  align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <tabs  v-if="scope.row.pPartsSizeType===0">小</tabs>-->
      <!--          <tabs  v-if="scope.row.pPartsSizeType===1">中</tabs>-->
      <!--          <tabs  v-if="scope.row.pPartsSizeType===2">大</tabs>-->
      <!--        </template>-->
      <!--      </el-table-column>-->


      <!--<el-table-column prop="pReturnCycle" label="退货周期（天）" width="100"  align="center"/>

      <el-table-column prop="pPartsStatus" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.pPartsStatus === 1
                    ? 'success'
                    : scope.row.pPartsStatus === 0
                    ? 'danger'
                    : ''
               "
          >{{ scope.row.pPartsStatus===1?'上架':'下架'}}</el-tag>
        </template>
      </el-table-column>-->

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!--          <router-link :to="'/parts/editPart/'+scope.row.pid">-->
          <!--            <el-button type="primary" size="mini" icon="el-icon-edit" >修改</el-button>-->
          <!--          </router-link>-->
          <!--        <router-link :to="{name:'part',params:scope.row }"> -->
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.$index)">查看详情</el-button>
          <!--       </router-link>   -->
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="insert(scope.row.wId)">添加零件</el-button>

          <el-button type="primary" size="mini" icon="el-icon-edit" @click="deleteWhole(scope.$index)">删除整件</el-button>
          <!--<el-button  size="mini" icon="el-icon-edit"
                      :type="scope.row.pPartsStatus === 1
                                ? 'danger'
                                : scope.row.pPartsStatus === 0
                                ? 'success'
                                : ''
                          "
                      @click="editCancel(scope.$index,scope.row)">{{ scope.row.pPartsStatus===1?'注销':'启用'}}
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加整件"
               :visible.sync="editFormVisible"
               class="edit-form"
               :before-close="handleClose">
      <el-form :model="whole" label-width="80px"  ref="editForm" :rules="rules">
        <el-form-item label="整件名" prop="wName">
          <el-input v-model="whole.wName" placeholder="请输入整件名"></el-input>

        </el-form-item>
        <el-form-item label="告警量（下限）" prop="wAlarmNumber">
          <el-input v-model="whole.wAlarmNumber" placeholder="请输入告警量"></el-input>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </el-dialog>

    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="wholeQuery.pageSize"
      :current-page="wholeQuery.pageNum"
      :total="pageTotal"
      style="padding: 30px 0; text-align: right;"
      @current-change="handlePageChange"
    />
  </div>
</template>
<script>
import {PostData,GetData} from "../../api/index"
import qs from 'qs'
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
  // provide(){
  //   return{
  //     reload: this.reload
  //   }
  // },

  data(){//定义变量和初始值
    return{
      isRouterAlive: true,
      list: [], //查询之后接口返回集合
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      wholeQuery:{
        pageSize: 10,
        pageNum: 1
      },
      whole:{
        pageSize: 10,
        pageNum: 1
      },
      selectCondition: {},
      pageTotal: 0,
      editFormVisible: false,
      rules:{
        wName:[
          {required:true,message:'请输入整件名',trigger:"blur"}
        ],
        wAlarmNumber:[
          {required:true,message:'请输入告警下限',trigger:"blur"},
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '只能输入数字',trigger: "blur"}
        ]

      }

    }
  },
  inject: ['reload'], //注入

  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
  },
  // watch: {
  // //   $route(to) {
  // //     //重新获取数据
  // //
  // //   }
  // // },
  resetData(){
    this.getList()
    this.getPageTotal()
  },

  methods: {//创建具体的方法
    // myCallBack(){
    //   this.reload() //局部刷新
    // },

    // reload(){
    //   this.isRouterAlive = false
    //   this.$nextTick(() => (this.isRouterAlive = true))
    // },

    add(){
      this.whole={}
      this.editFormVisible = true
    },
    save()
    {
      PostData('/whole/insertWhole',qs.stringify(this.whole))
        .then(res=>{
          console.log('------------------');
          console.log(res);
          if(res.code===500){
            this.$message({
              type:"warning",
              message:res.cause
            })
          }
          else {
            this.insert(parseInt(res.data))
            this.editFormVisible = false
          }
          // this.$router.go(0);
          // this.$root.reload()
          // this.getList()
          // this.$router.push('/whole')

        }).catch(()=>{})
    },
    getList() {
      PostData('/whole/selectAllByLike',this.wholeQuery)
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
          console.log(res.list);
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    // 分页处理
    handlePageChange(val){
      this.wholeQuery.pageNum = val
      this.getList()
    },
    search(){
      this.wholeQuery.pageNum = 1
      this.wholeQuery.wName=this.state
      this.getList()
    },
    // 跳转详情页
    showDetails(index){
      localStorage.setItem('wId',this.list[index].wId)
      this.$router.push('/whole/editWhole')
    },
    insert(wId){
      localStorage.setItem('wId',wId)
      this.$router.push('/whole/partsWhole')
    },
    editCancel(index,param){
      this.$confirm('是否将此零件'+(param.pPartsStatus===0?'上架':'下架')+'?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list[index].pPartsStatus = 1 - this.list[index].pPartsStatus
        PostData('parts/update',this.list[index])
          .then(res=>{
            this.getList()
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          })
      })
    },
    querySearch(queryString, cb) {
      this.wholeQuery.wName=queryString;
      PostData('/whole/selectAllByLike',qs.stringify(this.wholeQuery)).then(ref=>{
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.wName
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    deleteWhole(index){
      localStorage.setItem('wId',this.list[index].wId)
      this.wholeQuery.id = localStorage.getItem('wId')
      GetData('/whole/delete',this.wholeQuery)
        .then(res=>{
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    }
  }
}
</script>
<style>
body{
  background: white;
}
</style>
