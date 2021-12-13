<el-table-column label="税率" :show-overflow-tooltip="true" prop="taxRateVal" min-width="100">
<template slot-scope="scope">
  <el-autocomplete
    v-model="scope.row.taxRateVal"
    :fetch-suggestions="(keyword,cb)=>{querySearchAsync(keyword, cb, scope.$index, scope.row)}"
    placeholder=""
    size="medium"
    clearable
    @select="handleSelect"
  ></el-autocomplete>
</template>
</el-table-column>


<script>
import {PostData} from "@/api";
import {commonList} from "@/views/Slips/myApi";

export default {
  created() {
    this.getUserWhiteList()
    setTimeout(()=>{
        this.queryBtn=false
      },
      2000)
  },
  data () {
    return {
      shuilvList: [] // 税率数组
    }

  },
  methods:{
    querySearchAsync (qstring, cb, val, row) {
      let _this = this;
      let shuilvList = []
      commonList('admin/selectAllByLike').then(response=>{
        if (response) {
          _this.shuilvList = response.list
          for (let item of response.list) {
            if (row.taxRateVal) {
              if (item.baseName.indexOf(row.taxRateVal) > -1) {
                shuilvList.push({value: item.baseName})
              }
            } else {
              shuilvList.push({value: item.baseName})
            }
          }
          if (row.taxRateVal !== '' && shuilvList.length === 0) {
            let r = []
            r.push({value: row.taxRateVal});
            cb(r)
          } else {
            cb(shuilvList)
          }
        }
      }).catch(function () {
        cb(shuilvList)
      });
      })
}
    },
    handleSelect (item) {
// 下拉框选择方法，选择之后做什么操作
      console.log(item);
    }

  }
}
</script>
