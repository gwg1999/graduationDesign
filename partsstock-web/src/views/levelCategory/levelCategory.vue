<template>
  <div class="block">
    <div class="demonstration">四级目录查询器</div>
    <el-cascader
      v-model="value"
      :options="options"
      :show-all-levels="false"
      @change="handleChange"></el-cascader>
  </div>
</template>

<script>
import {PostData} from "../../api/index"
export default {
  name: "levelCategory",
  data() {
    return {
      value: [],
      options: [],
      levCategoryQuery:{
    }

  };
  },
  created() {
    this.getLevelCat();
  },
  methods: {
    getLevelCat(){
      PostData('oneLevelCategory/selectAll',this.levCategoryQuery)
        .then(res=>{
          let item1,item2,item3,item4;
          for(item1=0;item1<res.length;item1++){
            this.options.push({
              value:res[item1].oneName,
              label:res[item1].oneName,
              children:[],
            })
            for(item2=0;item2<res[item1].twoLevelCategoryListList.length;item2++){
              this.options[item1].children.push({
                value:res[item1].twoLevelCategoryListList[item2].twoName,
                label:res[item1].twoLevelCategoryListList[item2].twoName,
                children:[],
              })
              for(item3=0;item3<res[item1].twoLevelCategoryListList[item2].threeLevelCategoryList.length;item3++) {
                this.options[item1].children[item2].children.push({
                  value:res[item1].twoLevelCategoryListList[item2].threeLevelCategoryList[item3].threeName,
                  label:res[item1].twoLevelCategoryListList[item2].threeLevelCategoryList[item3].threeName,
                  children: [],
                })
                for(item4=0;item4<res[item1].twoLevelCategoryListList[item2].threeLevelCategoryList[item3].fourLevelCategoryList.length;item4++) {
                  this.options[item1].children[item2].children[item3].children.push({
                    value: res[item1].twoLevelCategoryListList[item2].threeLevelCategoryList[item3].fourLevelCategoryList[item4].fourName,
                    label: res[item1].twoLevelCategoryListList[item2].threeLevelCategoryList[item3].fourLevelCategoryList[item4].fourName,
                  })
                }
              }
            }
          }
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },//获取四级联动所有数据
    handleChange(value) {
      console.log(value);
    }
  }
}
</script>

<style scoped>
.block{
  text-align: center;
}
.demonstration{
  line-height: 50px;
  font-size: x-large;
  font-weight: bold;
}
</style>
