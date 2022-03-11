<template>
  <div>
    <el-dialog title="挂账交易记录信息" :visible.sync="dialogVisible" @close="chargeClose">
      <div class="form-box">
        <el-form :inline="true" style="border-bottom: solid gainsboro 1px">
          <el-form-item label="客户姓名">
<!--            <el-input v-model="chargeQuery.name" clearable></el-input>-->
            <el-autocomplete
              class="inline-input"
              v-model="chargeQuery.customerName"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="交易时间">
            <el-date-picker
              v-model="tempDate"
              type="daterange"
              start-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="chargeSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="chargeData"
          border
          fit
          highlight-current-row
          style="width: 100%">
          <el-table-column
            label="序号"
            width="50%"
            align="center">
            <template slot-scope="scope">
              {{ (chargeQuery.pageNum - 1) * chargeQuery.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="时间" align="center" prop="createTime"></el-table-column>
          <el-table-column label="未收" align="center" prop="supposeIncome"></el-table-column>
          <el-table-column label="未付" align="center" prop="supposeOutcome"></el-table-column>
          <el-table-column label="实付" align="center" prop="realOutcome"></el-table-column>
          <el-table-column label="实收" align="center" prop="realIncome"></el-table-column>
          <el-table-column label="已收" align="center" prop="alreadyIncome"></el-table-column>
          <el-table-column label="已付" align="center" prop="alreadyOutcome"></el-table-column>
        </el-table>
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :page-size="chargeQuery.pageSize"
          :current-page="chargeQuery.pageNum"
          :total="pageTotal"
          style="padding: 30px 0; text-align: right;"
          @current-change="chargeSearch"
        />
      </div>
      <div style="text-align: right;margin-top: 10px">
<!--        <el-button type="primary" @click="creditPartCancel">取消</el-button>-->
        <el-button type="primary" @click="chargeClose">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {PostData} from "@/api";
import {parseTime} from "@/utils";

export default {
  name: "ChargeDialog",
  data(){
    return {
      tempDate: null,
      chargeData: [],
      chargeQuery: {
        pageSize: 5,
        pageNum: 1,
        customId: null,
        startTime: null,
        endTime: null,
      },
      customerQuery: {
        cuUnitName:null,
        cuPhoneNumber:null,
        cuAddress:null,
        pageSize: 10,
        pageNum: 1,
      },
      pageTotal: 0,
      dialogVisible: false,
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    test(){
      console.log('测试')
    },
    // 搜索挂账交易记录信息
    chargeSearch(){
      if(this.tempDate){
        this.chargeQuery.startTime = parseTime(this.tempDate[0], '{y}-{m}-{d}')
        this.chargeQuery.endTime = parseTime(this.tempDate[1], '{y}-{m}-{d}')
      }
      if(!this.chargeQuery.customId){
        this.$message.warning('请选择客户后再次搜索')
      }else{
        PostData('/bill/getChargeList', this.chargeQuery).then((res)=>{
          console.log("chargeList:")
          console.log(res);
          this.chargeData = res.list
          for(let record of this.chargeData){
            record.createTime = parseTime(record.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
          this.pageTotal = res.total
        })
      }
    },

    // 挂账交易记录信息弹窗关闭
    chargeClose(){
      this.$emit('chargeClose')
    },

    querySearch(queryString,cb){
      PostData('customer/selectAllByLike', {cuUnitName: queryString, pageSize: 10000,pageNum: 1}).then(res=>{
        console.log(res.list)
        let customers = res.list
        for(let i in customers){
          customers[i].value = customers[i].cuUnitName
        }
        cb(customers)
      }).catch(err=>{
        console.log(err)
      })
    },

    handleSelect(item){
      this.chargeQuery.customId = item.cuId
      console.log('selectItem:')
      console.log(item);
    },

    creditPartConfirm(){
      this.$emit('chargeClose')
    },
  },
  computed: {

  },
  watch: {
    visible: {
      handler: function (){
        this.dialogVisible = this.visible
      }
    }
  }
}
</script>

<style scoped>

</style>
