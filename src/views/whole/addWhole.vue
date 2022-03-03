<template>
  <div id="a1">

    <h3>添加整件</h3>
    <el-form label-width="120px" :rules="rules">
      <el-form-item label="整件名称" prop="pName">
        <el-input style="width: 400px"/>
      </el-form-item>
      <el-form-item label="告警量（下限）" prop="pNumber">
        <el-input style="width: 400px"/>
      </el-form-item>
<!--  <el-table-->
<!--    ref="multipleTable"-->
<!--    :data="list"-->
<!--    tooltip-effect="dark"-->
<!--    style="width: 100%"-->
<!--    @selection-change="handleSelectionChange">-->
<!--    <el-table-column-->
<!--      type="selection"-->
<!--      width="55">-->
<!--    </el-table-column>-->
<!--    <el-table-column-->
<!--      label="序号"-->
<!--      width="50%"-->
<!--      align="center">-->
<!--      <template slot-scope="scope">-->
<!--        {{ (partQuery.pageNum - 1) * partQuery.pageSize + scope.$index + 1 }}-->
<!--      </template>-->
<!--    </el-table-column>-->
<!--    <el-table-column prop="pNumber" label="零件号" width="50%" align="center" />-->
<!--    <el-table-column prop="pName" label="零件名" width="140%" align="center" />-->
<!--    <el-table-column prop="place.plName" label="产地或品牌" width="70%"  align="center"/>-->
<!--    <el-table-column prop="factory.fName" label="厂家" width="60%"  align="center"/>-->
<!--    <el-table-column prop="unit.uName" label="单位" width="40%" align="center"/>-->
<!--    <el-table-column prop="supplier.sName" label="供应商" width="60%"  align="center"/>-->
<!--    <el-table-column prop="car.cTypeName" label="车属性" width="60%"  align="center"/>-->
<!--    <el-table-column prop="pLowPrice" label="一级价格" width="50%"  align="center"/>-->
<!--    <el-table-column prop="pMiddlePrice" label="二级价格" width="50%" align="center" />-->
<!--    <el-table-column prop="pHighPrice" label="三级价格" width="50%"  align="center"/>-->
<!--    <el-table-column prop="pBuyingPrice" label="进价" width="50%"  align="center"/>-->
<!--    &lt;!&ndash;     <el-table-column prop="pNote" label="备注" width="80"  align="center"/>&ndash;&gt;-->
<!--    &lt;!&ndash;      <el-table-column prop="pPicture" label="图片" width="120"  align="center"/>&ndash;&gt;-->
<!--    <el-table-column prop="pRealInventory" label="实际库存数" width="60%"  align="center"/>-->
<!--    &lt;!&ndash;      <el-table-column prop="pPartsSizeType" labenpml="零件大小" width="100"  align="center">&ndash;&gt;-->
<!--    &lt;!&ndash;        <template slot-scope="scope">&ndash;&gt;-->
<!--    &lt;!&ndash;          <tabs  v-if="scope.row.pPartsSizeType===0">小</tabs>&ndash;&gt;-->
<!--    &lt;!&ndash;          <tabs  v-if="scope.row.pPartsSizeType===1">中</tabs>&ndash;&gt;-->
<!--    &lt;!&ndash;          <tabs  v-if="scope.row.pPartsSizeType===2">大</tabs>&ndash;&gt;-->
<!--    &lt;!&ndash;        </template>&ndash;&gt;-->
<!--    &lt;!&ndash;      </el-table-column>&ndash;&gt;-->


<!--    <el-table-column prop="pReturnCycle" label="退货周期（天）" width="60%"  align="center"/>-->


<!--&lt;!&ndash;    <td>&ndash;&gt;-->
<!--&lt;!&ndash;      <button @click="reduce(index)" :disable="item.count === 1">-</button>&ndash;&gt;-->
<!--&lt;!&ndash;      {{ item.count }}&ndash;&gt;-->
<!--&lt;!&ndash;      <button @click="add(index)">+</button>&ndash;&gt;-->
<!--&lt;!&ndash;    </td>&ndash;&gt;-->

<!--    <el-table-column label="数量" align="center">-->
<!--        <template slot-scope="scope">-->
<!--        <el-input-number v-model="scope.row.number" :min="1" :max="10" label="描述文字"></el-input-number>-->
<!--        </template>-->
<!--    </el-table-column>-->


<!--&lt;!&ndash;    <el-form-item label="数量" prop="parts_num">&ndash;&gt;-->
<!--&lt;!&ndash;      &ndash;&gt;-->
<!--&lt;!&ndash;    </el-form-item>&ndash;&gt;-->

<!--&lt;!&ndash;    <el-table-column prop="pPartsStatus" label="状态" width="70%" align="center">&ndash;&gt;-->
<!--&lt;!&ndash;      <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;        <el-tag&ndash;&gt;-->
<!--&lt;!&ndash;          :type="scope.row.pPartsStatus === 1&ndash;&gt;-->
<!--&lt;!&ndash;                    ? 'success'&ndash;&gt;-->
<!--&lt;!&ndash;                    : scope.row.pPartsStatus === 0&ndash;&gt;-->
<!--&lt;!&ndash;                    ? 'danger'&ndash;&gt;-->
<!--&lt;!&ndash;                    : ''&ndash;&gt;-->
<!--&lt;!&ndash;               "&ndash;&gt;-->
<!--&lt;!&ndash;        >{{scope.row.pPartsStatus===1?'上架':'下架'}}</el-tag>&ndash;&gt;-->
<!--&lt;!&ndash;      </template>&ndash;&gt;-->
<!--&lt;!&ndash;    </el-table-column>&ndash;&gt;-->

<!--&lt;!&ndash;    <el-table-column label="操作" align="center" width="240%">&ndash;&gt;-->
<!--&lt;!&ndash;      <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;        &lt;!&ndash;          <router-link :to="'/parts/editPart/'+scope.row.pid">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        &lt;!&ndash;            <el-button type="primary" size="mini" icon="el-icon-edit" >修改</el-button>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        &lt;!&ndash;          </router-link>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        &lt;!&ndash;        <router-link :to="{name:'part',params:scope.row }"> &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.$index)">查看详情</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        &lt;!&ndash;       </router-link>   &ndash;&gt;&ndash;&gt;-->

<!--&lt;!&ndash;        <el-button  size="mini" icon="el-icon-edit"&ndash;&gt;-->
<!--&lt;!&ndash;                    :type="scope.row.pPartsStatus === 1&ndash;&gt;-->
<!--&lt;!&ndash;                                ? 'danger'&ndash;&gt;-->
<!--&lt;!&ndash;                                : scope.row.pPartsStatus === 0&ndash;&gt;-->
<!--&lt;!&ndash;                                ? 'success'&ndash;&gt;-->
<!--&lt;!&ndash;                                : ''&ndash;&gt;-->
<!--&lt;!&ndash;                          "&ndash;&gt;-->
<!--&lt;!&ndash;                    @click="editCancel(scope.$index,scope.row)">{{ scope.row.pPartsStatus===1?'注销':'启用'}}&ndash;&gt;-->
<!--&lt;!&ndash;        </el-button>&ndash;&gt;-->
<!--&lt;!&ndash;      </template>&ndash;&gt;-->
<!--&lt;!&ndash;    </el-table-column>&ndash;&gt;-->
<!--  </el-table>-->


<!--    <el-pagination-->
<!--      layout="total, prev, pager, next, jumper"-->
<!--      :page-size="partQuery.pageSize"-->
<!--      :current-page="partQuery.pageNum"-->
<!--      :total="pageTotal"-->
<!--      style="padding: 30px 0; text-align: right;"-->
<!--      @current-change="handlePageChange"-->
<!--    />-->


    <el-form-item>
<!--      <el-button :disabled="saveBtnDisabled" type="primary" @click="save" >保存</el-button>-->
      <el-button :disabled="saveBtnDisabled" type="primary" @click="save">保存</el-button>

    </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {PostData} from "../../api/index"

export default {
  data() {
    return {
      list: [], //查询之后接口返回集合
      total:0,//总记录数
      partQuery:{
        pId:null,
        pName:null,
        pageSize: 10,
        pageNum: 1,
      },
      wholeQuery:{
        wName:null,
        wAlarmNumber:null,
        pageSize: 10,
        pageNum: 1,
        partsMap:[]
      },
      selectCondition: {},
      pageTotal: 0,
      multipleSelection: []
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
    this.getPageTotal()
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);

        });
      } else {
        this.$refs.multipleTable.clearSelection();

      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // this.partsMap = new Map()
      // this.partsMap.set(this.multipleSelection.,)
      console.log(val)

    },
    getPageTotal() {
      this.selectCondition = JSON.parse(JSON.stringify(this.partQuery))
      this.selectCondition.pageNum = this.selectCondition.pageSize = 0
      PostData('parts/selectAll', this.selectCondition).then(res => {
        this.pageTotal = res.length
      })
    },
    getList() {
      PostData('parts/selectAllByLike', this.partQuery)
        .then(res => {
          this.list = res
          // console.log(res);
        }).catch(err => {
        this.$message.error(err.message);
        // console.log(err);
      })
    },
    save(){
      this.$prompt('请输入邮箱', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
      }).then(({ wholeQuery }) => {
        PostData('whole/insert',this.wholeQuery)
          .then(res=>{
            console.log(res);
            this.$router.push({path:'/whole'})
            this.$message({
              type:'success',
              message:'添加整件成功'
            })
          }).catch(()=>{})

        this.$message({
          type: 'success',
          message: '你的邮箱是: ' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    }

        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
      // console.log(this.wholeQuery)
      // for (let i = 0; i < this.multipleSelection.length; i++) {
      //   this.wholeQuery.partsMap.set(this.multipleSelection[i].pId,this.multipleSelection[i].number)
      // }
      // PostData('whole/insert',this.wholeQuery)
      //   .then(res=>{
      //     console.log(res);
      //     this.$message({
      //       type:'success',
      //       message:'添加整件成功'
      //     })
      //   }).catch(()=>{})
      // //   }else{
      //     this.$message.error('信息未完善')
      //   }

    },

  // open() {
  //
  //   alert(111)
  //   this.$alert('请输入邮箱', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
  //     inputErrorMessage: '邮箱格式不正确'
  //   }).then(({ value }) => {
  //     this.$message({
  //       type: 'success',
  //       message: '你的邮箱是: ' + value
  //     });
  //   }).catch(() => {
  //     this.$message({
  //       type: 'info',
  //       message: '取消输入'
  //     });
  //   });
  // }

}
</script>

<style>

body{
  /*position: absolute;;*/
  /*!*width: 5rem;*!*/
  /*!*top: 50%;*!*/
  /*left: 50%;*/

  background-color: white;
}

#a1{
  position: absolute;;
  /*width: 5rem;*/
  /*top: 50%;*/
  left: 35%;
}

</style>
