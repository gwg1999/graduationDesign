<template>
  <div class="dashboard-container">
    <el-divider content-position="center">零件告警信息</el-divider>
    <div style="float: left;width: 50%">
      <h3>需采购零件目录</h3>
      <span @click="openDialog">
        <h2 style="position: absolute;left: 42.3%;top:2.3%;z-index: 9;color: #c26a3e">{{needShopCount}}</h2>
        <img src="@/assets/shopcar/shopcar.jpeg" style="width: 60px;position: absolute;left: 42%;top:3%;z-index: 8">
      </span>
      <el-table use-virtual
                :data="lowList"
                border
                fit
                highlight-current-row
                style="width: 93%;left: 30px" v-show="!lowIsEmpty">
        <el-table-column
          label="序号"
          width="50%"
          align="center"
          type="index">
<!--          <template slot-scope="scope">-->
<!--            {{ (lowPartQuery.pageNum - 1) * lowPartQuery.pageSize + scope.$index + 1 }}-->
<!--          </template>-->
        </el-table-column>
        <el-table-column prop="category.cName" label="零件类目" width="50%" align="center" />
        <el-table-column prop="pName" label="零件名" width="100%" align="center" />
        <el-table-column prop="pRealInventory" label="实际库存数" width="50%"  align="center"/>
        <el-table-column label="告警提示" width="110%" align="center" >
          <template slot-scope="scope">
            <el-tag
              type="danger" style="font-weight: bold;font-size: medium"
            >{{scope.row.pRealInventory>scope.row.pHighLimit?'上限告警':'下限告警'}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addShopList(scope.row)">加入采购单</el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showLowDetails(scope.$index)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      <el-pagination-->
<!--        layout="total, prev, pager, next, jumper"-->
<!--        :page-size="LowPartQuery.pageSize"-->
<!--        :current-page="LowPartQuery.pageNum"-->
<!--        :total="lowPageTotal"-->
<!--        style="padding: 30px 0; text-align: right;"-->
<!--        @current-change="handleLowPageChange"-->
<!--      />-->
<!--      <el-pagination-->
<!--        :page-size="10"-->
<!--        :pager-count="11"-->
<!--        layout="prev, pager, next"-->
<!--        :total="11">-->
<!--      </el-pagination>-->
      <el-empty :image-size="200" v-show="lowIsEmpty"></el-empty>
    </div>
    <el-divider direction="vertical"></el-divider>
    <div style="float: right;width: 50%">
      <h3>滞销零件目录</h3>
      <el-empty :image-size="200" v-show="highIsEmpty"></el-empty>
      <el-table use-virtual
                :data="highList"
                border
                fit
                highlight-current-row
                style="width: 90%;left: 35px" v-show="!highIsEmpty">
        <el-table-column
          label="序号"
          width="50%"
          align="center"
          type="index">
          <!--          <template slot-scope="scope">-->
          <!--            {{ (lowPartQuery.pageNum - 1) * lowPartQuery.pageSize + scope.$index + 1 }}-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column prop="category.cName" label="零件类目" width="50%" align="center" />
        <el-table-column prop="pName" label="零件名" width="100%" align="center" />
        <el-table-column prop="pRealInventory" label="实际库存数" width="50%"  align="center"/>
        <el-table-column label="告警提示" width="110%" align="center" >
          <template slot-scope="scope">
            <el-tag
              type="danger" style="font-weight: bold;font-size: medium"
            >{{scope.row.pRealInventory>scope.row.pHighLimit?'上限告警':'下限告警'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showHighDetails(scope.$index)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">
      <el-form :model="submitInfo" ref="parts" label-width="100px" class="demo-dynamic">
        <el-form-item
          v-for="(item, index) in shopList"
          :label="'零件' + index"
          :prop="'part' + index"
        >
          <!--            <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>-->
          <el-input v-model="item.pName" :disabled="true" style="width: 15%"></el-input>
          <!--          零件大小:-->
          <!--          <el-select v-model="item.pPartsSizeType" style="width: 10%" placeholder="请选择零件大小" label="零件大小">-->
          <!--            <el-option label="小" :value="2"></el-option>-->
          <!--            <el-option label="中" :value="1"></el-option>-->
          <!--            <el-option label="大" :value="0"></el-option>-->
          <!--          </el-select>-->
          供货周期:
          <el-input placeholder="请输入数字" v-model="item.sdDeliveryCycle" style="width: 15%"></el-input>
          单价:
          <!--          <el-input placeholder="请输入数字" v-model="item.sdPrice" style="width: 15%"></el-input>-->
          <el-input placeholder="请输入数字" v-model="item.sdPrice" style="width: 20%">
            <el-select v-model="item.sdPrice" slot="append" placeholder="请选择" @focus="getPrice(item.pName)">
              <el-option :label="partPrice[0].pLowPrice" :value="partPrice[0].pLowPrice"></el-option>
              <el-option :label="partPrice[0].pMiddlePrice" :value="partPrice[0].pMiddlePrice"></el-option>
              <el-option :label="partPrice[0].pHighPrice" :value="partPrice[0].pHighPrice"></el-option>
            </el-select>
          </el-input>
          零件数量:
          <el-input-number v-model="item.sdNumber" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import qs from 'qs'
import {PostData} from "@/api";
import Cookie from "js-cookie";

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      dialogVisible: false,
      priceQuery:{},
      partPrice:[{
        pLowPrice:0,
        pMiddlePrice:0,
        pHighPrice:0
      }],
      lowTotal:0,//下限零件总数
      highTotal:0,//上限零件总数
      lowPageTotal: 0,//下限零件总页数
      highPageTotal: 0,//上限零件总页数
      activeName: 'first',
        test:{
          name:'李四',
          age:58
        },
        lowList: [],//下限告警数据
        highList:[],//上限告警数据
        shopList:[],
        list: [
        ],
        LowPartQuery:{
          pId:null,
          pName:null,
          pageSize: 0,
          pageNum: 0,
        },

        highPartQuery:{
          pId:null,
          pName:null,
          pageSize: 0,
          pageNum: 0,
        },
        submitInfo:{}
    }
  },
  created() {
    this.getAlertPartsList()
    this.getLowPageTotal()
    this.getHighPageTotal()
  },
  mounted() {
    if(this.lowList.length!==0&&this.highList.length!==0){
      const h = this.$createElement;
      this.$notify({
        title: '告警提示',
        message: h('i', { style: 'color: teal'}, '存在库存数量告警信息，请及时处理')
      });
    }
  },
  computed:{
    lowIsEmpty(){
      return this.lowList.length===0
    },
    highIsEmpty(){
      return this.highList.length===0
    },
    needShopCount(){
      return this.shopList.length
    }
    // ...mapGetters({
    //   info:'info'
    // })
  },
  methods:{
    getAlertPartsList() {
      PostData('/parts/selectAllByAlarm',qs.stringify(this.LowPartQuery))
        .then(res=>{
          // this.$store.state.info
          // console.log(role)
          // console.log(this.info)
          // console.log
          this.list=res.list
          this.lowList= res.list.filter(function (item) {
            return item.pRealInventory<item.pLowLimit && item.pLowLimit!==-1
            })
          console.log(this.lowList);
          this.highList= res.list.filter(function (item) {
            return item.pRealInventory>item.pHighLimit && item.pHighLimit!==-1
          })

        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    getLowPageTotal(){
        this.lowPageTotal = this.lowList.length
    },
    getHighPageTotal(){
      this.highPageTotal = this.highList.length
    },
    handleLowPageChange(val){
      this.LowPartQuery.pageNum = val
      this.getAlertPartsList()
    },
    handleHighPageChange(val){
      this.highPartQuery.pageNum = val
      this.getAlertPartsList()
    },
    showLowDetails(index){
      localStorage.setItem('pId',this.lowList[index].pId)
      this.$router.push('/parts/editPart')
    },
    showHighDetails(index){
      localStorage.setItem('pId',this.highList[index].pId)
      this.$router.push('/parts/editPart')
    },
    addShopList(partData){
      console.log(partData);
      this.shopList.push(partData)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getPrice(pName){
      this.priceQuery.pName=pName
      PostData('/parts/selectAllByLike',qs.stringify(this.priceQuery)).then((ref)=>{
        console.log(ref.list);
        this.partPrice=ref.list
      })
    },
    openDialog(){

    }
  }
}
</script>
<style scoped>
.el-divider--vertical{
  display: inline-block;
  width:3px;
  height:100%;
  margin: 0 8px;
  position: absolute;
  left: 50%;
}
h3{
  text-align: center;
}
</style>
