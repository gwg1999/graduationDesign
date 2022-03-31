<template>
  <div>
    <div class="topBox">
      <div>
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="请输入客户"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="请输入厂家"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="line"></div>

    <div>
      <div style="display: flex">
        <div>
          <div style="display: flex;justify-content: space-around">
            <part-sell-top :bar-type="'sellPart'"></part-sell-top>
          </div>

          <div style="display: flex;justify-content: center">
            <part-sell-top :bar-type="'stockPart'"></part-sell-top>
          </div>
        </div>
        <div style="flex: 1;padding: 10px">
          <el-table
            :data="buyCustomer"
            border
            fit
            highlight-current-row
            style="width: 100%">
            <el-table-column
              label="排名"
              width="50%"
              align="center">
              <template slot-scope="scope">
                {{scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="客户" align="center"></el-table-column>
            <el-table-column label="购买数量" align="center"></el-table-column>
          </el-table>
        </div>
        <div style="flex: 1;padding: 10px">
          <el-table
            :data="buyCustomer"
            border
            fit
            highlight-current-row
            style="width: 100%">
            <el-table-column
              label="排名"
              width="50%"
              align="center">
              <template slot-scope="scope">
                {{scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="进货商" align="center"></el-table-column>
            <el-table-column label="进货数量" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import partSellTop from "@/views/Statistics/component/partSellTop";

export default {
  name: "customPrefer",
  components: {
    partSellTop,
  },
  data(){
    return {
      buyCustomer: [],
      stockCustomer: [],
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.topBox{
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
.line{
  height: 1px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-top: 1px solid #000000;
  text-align: center;
}
</style>
