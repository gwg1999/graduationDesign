<template>
  <div class="app-container" style="background: white">
    <el-dialog
      title="修改零件数量"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="singlePart" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="零件名">
          <el-input v-model="singlePart.parts.pName" disabled></el-input>
        </el-form-item>
        <el-form-item label="零件数量">
          <el-input-number v-model="singlePart.partsNum" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateInfo('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">
<!--        <el-form-item>-->
          <!--        <el-input v-model="partQuery.pName" clearable placeholder="零件名"  style="width: 150px"/>-->
<!--          <el-autocomplete-->
<!--            v-model="state"-->
<!--            :fetch-suggestions="querySearch"-->
<!--            placeholder="请输入内容"-->
<!--            :trigger-on-focus="false"-->
<!--            @select="handleSelect">-->
<!--            &lt;!&ndash;      <i&ndash;&gt;-->
<!--            &lt;!&ndash;        class="el-icon-edit el-input__icon"&ndash;&gt;-->
<!--            &lt;!&ndash;        slot="suffix"&ndash;&gt;-->
<!--            &lt;!&ndash;        @click="handleIconClick">&ndash;&gt;-->
<!--            &lt;!&ndash;      </i>&ndash;&gt;-->
<!--            <template slot-scope="{ item }">-->
<!--              <div>{{ item.pName }}</div>-->
<!--              &lt;!&ndash;        <span class="addr">{{ item.address }}</span>&ndash;&gt;-->
<!--            </template>-->
<!--          </el-autocomplete>-->
<!--        </el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>-->


<!--        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 10px" @click="toInsert()">添加</el-button>-->
      </template>
    </el-form>
    <!-- 表格 -->
    <el-button type="primary" @click="backPre" style="margin-bottom: 5px">返 回</el-button>
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
          {{ (wholetQuery.pageNum - 1) * wholetQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="parts.pCategoryId" label="零件类目" width="50%" align="center" />
      <el-table-column prop="parts.pNumber" label="零件号" width="50%" align="center" />
      <el-table-column prop="parts.pName" label="零件名" width="140%" align="center" />
      <el-table-column prop="parts.place.plName" label="产地或品牌" width="60%"  align="center"/>
      <el-table-column prop="parts.factory.fName" label="厂家" width="60%"  align="center"/>
      <el-table-column prop="parts.unit.uName" label="单位" width="50%" align="center"/>
<!--      <el-table-column prop="parts.supplier.sName" label="供应商" width="60%"  align="center"/>-->
      <el-table-column prop="parts.pCarName" label="车属性" width="60%"  align="center"/>
      <el-table-column prop="parts.pLowPrice" label="一级价格" width="60%"  align="center"/>
      <el-table-column prop="parts.pMiddlePrice" label="二级价格" width="60%" align="center" />
      <el-table-column prop="parts.pHighPrice" label="三级价格" width="60%"  align="center"/>
      <el-table-column prop="parts.pBuyingPrice" label="进价" width="50%"  align="center"/>
      <el-table-column prop="parts.pHighLimit" label="上限" width="50%"  align="center"/>
      <el-table-column prop="parts.pLowLimit" label="下限" width="50%"  align="center"/>
      <!--     <el-table-column prop="pNote" label="备注" width="80"  align="center"/>-->
      <!--      <el-table-column prop="pPicture" label="图片" width="120"  align="center"/>-->
      <el-table-column prop="parts.pRealInventory" label="实际库存数" width="50%"  align="center"/>
      <!--      <el-table-column prop="pPartsSizeType" labenpml="零件大小" width="100"  align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <tabs  v-if="scope.row.pPartsSizeType===0">小</tabs>-->
      <!--          <tabs  v-if="scope.row.pPartsSizeType===1">中</tabs>-->
      <!--          <tabs  v-if="scope.row.pPartsSizeType===2">大</tabs>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
<!--      <el-table-column prop="wName" label="整件名称" width="360%" align="center" />-->
<!--      <el-table-column prop="wAlarmNumber" label="告警量（下限）" width="220%"  align="center"/>-->
<!--      <el-table-column prop="wNumber" label="整件数量" width="220%"  align="center"/>-->
      <el-table-column prop="partsNum" style="font-size: 16px" label="零件数目" width="60%" align="center" />
<!--      <el-table-column prop="partsId" label="零件名" width="140%" align="center" />-->
<!--      <el-table-column prop="partsWholeList.parts.pReturnCycle" label="退货周期（天）" width="60%"  align="center"/>-->

<!--      <el-table-column prop="partsWholeList.parts.pPartsStatus" label="状态" width="70%" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag-->
<!--            :type="scope.row.pPartsStatus === 1-->
<!--                    ? 'success'-->
<!--                    : scope.row.pPartsStatus === 0-->
<!--                    ? 'danger'-->
<!--                    : ''-->
<!--               "-->
<!--          >{{scope.row.pPartsStatus===1?'上架':'下架'}}</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
<!--          &lt;!&ndash;          <router-link :to="'/parts/editPart/'+scope.row.pid">&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-button type="primary" size="mini" icon="el-icon-edit" >修改</el-button>&ndash;&gt;-->
<!--          &lt;!&ndash;          </router-link>&ndash;&gt;-->
<!--          &lt;!&ndash;        <router-link :to="{name:'part',params:scope.row }"> &ndash;&gt;-->
<!--          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.$index)">查看详情</el-button>-->
<!--          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.$index)">查看详情</el-button>-->
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editNum(scope.row)">修改零件数量</el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deletePart(scope.row)"></el-button>

<!--          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleChangeNum(scope.row)">删除</el-button>-->
<!--          &lt;!&ndash;       </router-link>   &ndash;&gt;-->

<!--          <el-button  size="mini" icon="el-icon-edit"-->
<!--                      :type="scope.row.pPartsStatus === 1-->
<!--                                ? 'danger'-->
<!--                                : scope.row.pPartsStatus === 0-->
<!--                                ? 'success'-->
<!--                                : ''-->
<!--                          "-->
<!--                      @click="editCancel(scope.$index,scope.row)">{{ scope.row.pPartsStatus===1?'注销':'启用'}}-->
<!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
<!--    <el-pagination-->
<!--      layout="total, prev, pager, next, jumper"-->
<!--      :page-size="wholetQuery.pageSize"-->
<!--      :current-page="wholetQuery.pageNum"-->
<!--      :total="pageTotal"-->
<!--      style="padding: 30px 0; text-align: right;"-->
<!--      @current-change="handlePageChange"-->
<!--    />-->
  </div>
</template>
<script>
  import {PostData} from "../../api/index"
  import {GetData} from "../../api/index";
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
        list: [], //查询之后接口返回集合
        state:'',//模糊查询后返回的值
        total:0,//总记录数
        wholetQuery:{
          wholeId:null,
          pageSize: 10,
          pageNum: 1,
        },
        singlePart:{
          parts:{},
          pageNum: 0
        },
        deleteQuery:{
          id:0
        },
        dialogVisible:false,
        selectCondition: {},
        pageTotal: 0,
        rules:{}
      }
    },
    created() {//页面渲染之前执行，一般调用methods中定义的方法
      this.getList()
      // this.getPageTotal()
    },
    resetData(){
      this.getList()
      this.getPageTotal()
    },
    methods:{//创建具体的方法
      getList() {
        this.wholetQuery.wholeId = localStorage.getItem('wId')
        console.log(this.wholetQuery)
        PostData('partsWhole/selectWholeParts',this.wholetQuery)
          .then(res=>{
            this.list = res
            console.log(this.list);
          }).catch(err=>{
          this.$message.error(err.message);
        })
      },
  // 跳转详情页
  showDetails(index){
    localStorage.setItem('pId',this.list[index].partsId)
    this.$router.push('/parts/editPart')
  },
  editNum(item){
    this.singlePart=item
    this.dialogVisible=true
  },
      deletePart(item){
        console.log(item);
        this.deleteQuery.id=item.pwId
        console.log(this.deleteQuery);
        GetData('/partsWhole/delete',this.deleteQuery).then((ref)=>{
          this.$message({
            message:'删除成功',
            type:"success"
          })
          this.getList()
        })
      },
  handleClose(done) {
     this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
  },
  handleChangeNum(param) {
    this.flag = false

  },
      backPre(){
        this.$router.back()
      },
      updateInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.singlePart);
            PostData('partsWhole/updateAmount',this.singlePart)
              .then(res=>{
                console.log(res);
                this.$message({
                  type:'success',
                  message:'修改零件数量成功'
                })
              }).catch(()=>{})
            //   }else{
            //     this.$message.error('信息未完善')
            //   }
            this.dialogVisible=false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
   }
</script>
<style>
body{
  background: white;
}
</style>
