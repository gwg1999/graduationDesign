<template>
  <div>
    <el-dialog title="挂账交易结清信息" :visible.sync="dialogVisible" @close="chargeClose">
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
          :data="chargeSettleData"
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
          <el-table-column label="已收" align="center" prop="alreadyIncome"></el-table-column>
          <el-table-column label="应收" align="center" prop="supposeIncome"></el-table-column>
          <el-table-column label="时间" align="center" prop="createTime"></el-table-column>
          <el-table-column label="应付" align="center" prop="supposeOutcome"></el-table-column>
          <el-table-column label="实付" align="center" prop="realOutcome"></el-table-column>
          <el-table-column label="实收" align="center" prop="realIncome"></el-table-column>
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
  name: "ChargeSettleDialog",
  data(){
    return {
      dialogVisible: false,
      chargeQuery: {
        pageSize: 5,
        pageNum: 1,
        customId: null,
        startTime: null,
        endTime: null,
      },
      chargeSettleData: [],
      tempDate: null,
      pageTotal: 0,
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    visible: {
      handler: function (){
        this.dialogVisible = this.visible
      }
    }
  },
  methods: {
    chargeClose(){
      this.$emit('chargeClose')
    },

    chargeSearch(){
      PostData('/bill/getChargeSettleList', this.chargeQuery).then(res=>{
        this.total = res.total
        this.chargeSettleData = res.list
        for(let data of this.chargeSettleData){
          data.createTime = parseTime(data.createTime, '{y}-{m}-{d} {h}-{i}-{s}')
        }
        console.log('res:');
        console.log(res)
      }).catch(err=>{
        console.log(err);
      })
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
      console.log(item);
      this.chargeQuery.customId = item.id
    }
  },

}
</script>

<style scoped>

</style>
