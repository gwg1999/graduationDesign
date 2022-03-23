<template>
  <div>
    <div class="card-box">
      <el-row :gutter="12">
        <el-col :span="(24/cardData.length)" v-for="item in cardData" :key="item.number">
          <el-card shadow="hover" class="data-card">
            <div slot="header" style="text-align: center">
              {{ item.label }}
            </div>
            <div style="text-align: center">
              {{ item.number }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderSum",
  props: {
    title: {
      type: Array,
      default: []
    },
    cardData: Array,
  },
  data(){
    return {
    }
  },
  methods:{

  }
}
</script>

<style scoped>
.card-box{
  display: flex;
  justify-content: space-around;
}
.data-card{
  width: 300px;
  flex-grow: 0;
  flex-shrink: 1;
}
</style>
