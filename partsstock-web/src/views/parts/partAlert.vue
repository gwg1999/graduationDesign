<!--<meta http-equiv="X-UA-Compatible" content="IE=8">-->
<!--<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />-->
<template>
  <div class="app-container" style="background: white">
    <!--查询表单-->
<!--    <el-form :inline="true" class="demo-form-inline" style="position: relative">-->
<!--      <template slot-scope="scoped">-->
<!--        <el-form-item>-->
<!--          &lt;!&ndash;        <el-input v-model="partQuery.pName" clearable placeholder="零件名"  style="width: 150px"/>&ndash;&gt;-->
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

<!--        <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 10px" @click="toInsert()" >添加</el-button>-->

<!--      </template>-->

<!--    </el-form>-->

    <!-- 表格 -->
    <el-select v-model="partQuery.type" placeholder="请选择告警状态" style="margin-bottom: 5px">
      <el-option label="上限告警" :value="1"  @click.native="filAlert"></el-option>
      <el-option label="下限告警" :value="0"  @click.native="filAlert"></el-option>
    </el-select>
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
      <el-table-column prop="pCategoryId" label="零件类目" width="50%" align="center" />
      <el-table-column prop="pNumber" label="零件号" width="50%" align="center" />
      <el-table-column prop="pName" label="零件名" width="100%" align="center" />
      <el-table-column prop="place.plName" label="产地或品牌" width="70%"  align="center"/>
      <el-table-column prop="factory.fName" label="厂家" width="50%"  align="center"/>
      <el-table-column prop="unit.uName" label="单位" width="40%" align="center"/>
<!--      <el-table-column prop="supplier.sName" label="供应商" width="50%"  align="center"/>-->
      <el-table-column prop="pCarName" label="车属性" width="50%"  align="center"/>
      <el-table-column prop="pLowPrice" label="一级价格" width="50%"  align="center"/>
      <el-table-column prop="pMiddlePrice" label="二级价格" width="50%" align="center" />
      <el-table-column prop="pHighPrice" label="三级价格" width="50%"  align="center"/>
      <el-table-column prop="pBuyingPrice" label="进价" width="50%"  align="center"/>
      <el-table-column prop="pHighLimit" label="上限" width="40%"  align="center"/>
      <el-table-column prop="pLowLimit" label="下限" width="40%"  align="center"/>
      <!--     <el-table-column prop="pNote" label="备注" width="80"  align="center"/>-->
      <!--      <el-table-column prop="pPicture" label="图片" width="120"  align="center"/>-->
      <el-table-column prop="pRealInventory" label="实际库存数" width="50%"  align="center"/>
      <!--      <el-table-column prop="pPartsSizeType" labenpml="零件大小" width="100"  align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <tabs  v-if="scope.row.pPartsSizeType===0">小</tabs>-->
      <!--          <tabs  v-if="scope.row.pPartsSizeType===1">中</tabs>-->
      <!--          <tabs  v-if="scope.row.pPartsSizeType===2">大</tabs>-->
      <!--        </template>-->
      <!--      </el-table-column>-->


      <el-table-column prop="pReturnCycle" label="退货周期（天）" width="60%"  align="center"/>

      <el-table-column prop="pPartsStatus" label="状态" width="70%" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.pPartsStatus === 1
                    ? 'success'
                    : scope.row.pPartsStatus === 0
                    ? 'danger'
                    : ''
               "
          >{{scope.row.pPartsStatus===1?'上架':'下架'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="告警提示" width="110%" align="center" >
        <template slot-scope="scope">
          <el-tag
            type="danger" style="font-weight: bold;font-size: medium"
          >{{scope.row.pRealInventory>scope.row.pHighLimit?'上限告警':'下限告警'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!--          <router-link :to="'/parts/editPart/'+scope.row.pid">-->
          <!--            <el-button type="primary" size="mini" icon="el-icon-edit" >修改</el-button>-->
          <!--          </router-link>-->
          <!--        <router-link :to="{name:'part',params:scope.row }"> -->
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.$index)">查看详情</el-button>
          <!--       </router-link>   -->

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
  data(){//定义变量和初始值
    return{
      list: [], //查询之后接口返回集合
      filtedList:[],
      state:'',//模糊查询后返回的值
      total:0,//总记录数
      partQuery:{
        pId:null,
        pName:null,
        type:0,
        pageSize: 10,
        pageNum: 1,
      },
      selectCondition: {},
      pageTotal: 0,
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getAlertPartsList()
    // this.getPageTotal()
  },
  resetData(){
    this.getAlertPartsList()
    this.getPageTotal()
  },
  methods:{//创建具体的方法
    getAlertPartsList() {
      PostData('/parts/selectAlarm',qs.stringify(this.partQuery))
        .then(res=>{
          this.list = res.list
          this.pageTotal=res.total
          console.log(this.list);
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    filAlert(){
      this.partQuery.pageNum=1
      this.getAlertPartsList()
    },
    toInsert(){
      this.$router.push('/parts/addPart')
    },
    // getPartList(){
    //   this.partQuery.pName=this.state
    //   PostData('parts/selectAllByLike',this.partQuery)
    //     .then(res=>{
    //       this.list=res
    //       console.log(res);
    //     }).catch(err=>{
    //     this.$message.error(err.message);
    //     console.log(err);
    //   })
    // },

    getPageTotal(){
      this.selectCondition = JSON.parse(JSON.stringify(this.partQuery))
      this.selectCondition.pageNum = this.selectCondition.pageSize = 0
      PostData('/parts/selectAllByAlarm',this.selectCondition).then(res=>{
        this.pageTotal = res.length
      })
    },
    // 分页处理
    handlePageChange(val){
      this.partQuery.pageNum = val
      this.getAlertPartsList()
    },
    search(){
      this.partQuery.pageNum = 1
      this.getPageTotal()
      this.getPartList()
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
        cb(ref)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.pName
    }
  }
}
</script>
<style scoped>

</style>
