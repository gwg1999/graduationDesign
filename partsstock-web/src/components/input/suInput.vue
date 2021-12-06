<template>
<div class="suInput">
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
      <div>{{ item.this.proname }}</div>
      <!--        <span class="addr">{{ item.address }}</span>-->
    </template>
  </el-autocomplete>
</div>
</template>

<script>
import {PostData} from "@/api";

export default {
  name: "suInput",
  props:{
    proname:'String',
    urlname:'String',
    wholeproname:'String',
    arrname:'Object',
    state:'String'
  },
  methods:{
    // getListByLike(){
    //   this.wholeProName=this.state
    //   PostData(this.urlName,this.arrName)
    //     .then(res=>{
    //       this.list=res
    //       console.log(res);
    //     }).catch(err=>{
    //     this.$message.error(err.message);
    //     console.log(err);
    //   })
    // },
    querySearch(queryString, cb) {
      this.wholeproname=queryString;
      PostData(this.urlname,this.arrname).then(ref=>{
        cb(ref)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.state=item.this.proname
    }
  }
}
</script>

<style scoped>

</style>
