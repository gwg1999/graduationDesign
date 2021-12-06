<template style="background: white">
  <div style="border: 0px;margin: 0px">
<!--    <div style="width: 20%;height:10%;float: left;margin-left: 5%;margin-top: -10%">-->
<!--&lt;!&ndash;        <img src="@/assets/parts/luosi.jpeg" width="100%" alt="图片无法显示" style="margin-top: 150px">&ndash;&gt;-->
<!--      <el-carousel :interval="5000" arrow="always">-->
<!--        <el-carousel-item v-for="item in img" :key="item">-->
<!--&lt;!&ndash;          <h3>{{ item }}</h3>&ndash;&gt;-->
<!--          <el-image-->
<!--            style="width: 100%"-->
<!--            :src="require(item)"></el-image>-->
<!--        </el-carousel-item>-->
<!--      </el-carousel>-->
<!--    </div>-->
<!--    <div style="width:70%;background-color: aquamarine;float: left">零件详情</div>-->
    <div style="width: 25%;float: left">
      <span class="demonstration">内部图片</span>
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in inPic">
          <el-image
            style="width: 100%;height: 100%"
            :src="item.path"></el-image>
        </el-carousel-item>
      </el-carousel>
      <span class="demonstration">外部图片</span>
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in outPic">
          <el-image
            style="width: 100%;height: 100%"
            :src="item.path"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="app-container" style="width: 75%;float: right">
      <el-form ref="partsB" :model="parts" label-width="150px" :rules="rules">
        <div style="width: 50%;float: left;background: white">
        <el-form-item label="零件名称" prop="pName">
          <el-input v-model="parts.pName" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="零件号" prop="pNumber">
          <el-input v-model="parts.pNumber" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="一级售价" prop="pLowPrice">
          <el-input v-model="parts.pLowPrice" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="二级售价" prop="pMiddlePrice">
          <el-input v-model="parts.pMiddlePrice" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="三级售价" prop="pHighPrice">
          <el-input v-model="parts.pHighPrice" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="进价" prop="pBuyingPrice">
          <el-input v-model="parts.pBuyingPrice" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="上限" prop="pHighLimit">
          <el-input v-model="parts.pHighLimit" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="下限" prop="pLowLimit">
          <el-input v-model="parts.pLowLimit" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="实际库存数" prop="pRealInventory">
          <el-input v-model="parts.pRealInventory" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="货物位置" prop="positions">
          <el-cascader
            ref="cascader"
            :options="positionList"
            :props="{ multiple: true, checkStrictly: true, value:'name', label:'name'}"
            v-model="parts.positions"
            clearable>
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="submitForm('partsB')">保存</el-button>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="backPre">返回</el-button>
        </el-form-item>
      </div>

      <div style="width: 50% ;float: right ;background: white">
            <el-form-item label="产地或品牌" prop="place.plName">
              <el-select
                v-model="parts.place.plName"
                filterable
                remote
                reserve-keyword
                placeholder="请输入产地或品牌"
                :remote-method="remotePlace"
                :loading="loading">
                <el-option
                  v-for="item in placeList"
                  :key="item.plId"
                  :label="item.plName"
                  :value="item.plName"
                  @click.native="handlePlaceChange(item)"
                  >
                </el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="单位" prop="unit.uName">
                <el-select
                  v-model="parts.unit.uName"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入单位"
                  :remote-method="remoteUnit"
                  :loading="loading">
                  <el-option
                    v-for="item in unitList"
                    :key="item.uId"
                    :label="item.uName"
                    :value="item.uName"
                    @click.native="handleUnitChange(item)">
                  </el-option>
                </el-select>
              </el-form-item>
<!--            <el-form-item label="供应商名称">-->
<!--              <el-input disabled style="width: 100%" v-model="parts.supplier.sName"/>-->
<!--            </el-form-item>-->

           <el-form-item label="车型号" prop="pCarName">
             <el-cascader
               ref="carCascader"
               :options="options"
               :props="{value:'name', label:'name'}"
               :show-all-levels="false"
               v-model="parts.pCarName"
               clearable>
               <template slot-scope="{ node, data }">
                 <span>{{ data.name }}</span>
                 <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
               </template>
             </el-cascader>
           </el-form-item>
        <el-form-item label="零件类目" prop="pCategoryId">
          <el-cascader
            ref="pCatCascader"
            :options="categoryOption"
            :props="{value:'name', label:'name'}"
            :show-all-levels="false"
            v-model="parts.pCategoryId"
            clearable>
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>

        <el-form-item label="零件尺寸" style="width: 400px" prop="pPartsSizeType">
<!--          <el-input v-model="parts.pPartsSizeType" style="width: 400px"></el-input>-->
          <el-select v-model="parts.pPartsSizeType" placeholder="请选择零件尺寸">
            <el-option label="小" :value="1"></el-option>
            <el-option label="大" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="厂家名称" prop="factory.fName">
          <el-select
            v-model="parts.factory.fName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入厂家"
            :remote-method="remoteFactory"
            :loading="loading">
            <el-option
              v-for="item in factoryList"
              :key="item.fId"
              :label="item.fName"
              :value="item.fName"
              @click.native="handleFactoryChange(item)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售后周期" prop="pReturnCycle">
          <el-select v-model="parts.pReturnCycle" placeholder="请选择产品售后周期">
            <el-option label="原厂无三包" :value="0"></el-option>
            <el-option :label="item.rcAmount+'天'" :value="item.rcAmount" v-for="item in cycleList"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="零件状态" prop="pPartsStatus">
          <el-select v-model="parts.pPartsStatus" placeholder="请选择零件状态">
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="parts.pNote" :rows="5" type="textarea"/>
        </el-form-item>

      </div>


      </el-form>
    </div>
  </div>
</template>

<script>


import ImageCropper from '@/components/ImageCropper'
import qs from 'qs'
import PanThumb from '@/components/PanThumb'
import {PostData} from "../../api/index"

export default {
  components:{
    ImageCropper,
    PanThumb
  },
  data() {
    let validatepName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写正确零件名'));
      }
      else {
        callback()
      }
    }
    let validatepUnit = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写正确单位'));
      }
      else {
        callback()
      }
    };

    return {
      img:['@/assets/parts/luosi.jpeg','@/assets/parts/fengjing.jpeg','@/assets/parts/fengjing1.jpeg'],
      carList:[],
      activeNames: ['1'],
      inPic:[],
      outPic:[],
      factoryList:[],
      placeList:[],
      supplierList:[],
      tempObj:{},
      unitList:[],
      cycleList:[],
      parts: {},
      positionList:[],
      categoryOption:[],
      options: [],
      editId:'',
      loading: false,
      saveBtnDisabled: false,
      imagecropperShow:false,
      imagecropperKey:0,//唯一标识 上传组件
      levCategoryQuery:{
        status:1,
        type:1
      },
      categoryQuery:{
        cName:'',
        pageSize: 10,
        pageNum: 1,
      },
      cycleQuery:{
        pageSize: 0,
        pageNum: 0,
      },
      partQuery: {
        pId: 0,
        pageNum: 0,
        pageSize: 0,
      },
      placeQuery:{
        pageSize: 10,
        pageNum: 1,
        plName:'',
        plId:'',
      },
      unitQuery:{
        pageSize: 10,
        pageNum: 1,
        uName:'',
        uId:''
      },
      factoryQuery:{
        pageSize: 10,
        pageNum: 1,
        fName:'',
        fId:''
      },
      supplierQuery:{
        pageSize: 10,
        pageNum: 1,
        sName:'',
        sId:''
      },
      pCateQuery:{
        status:1,
        type:2
      },
      carQuery:{
        pageSize: 10,
        pageNum: 1,
        cName:'',
        cId:''
      },
      positionQuery:{
        status:1,
        type:0
      },
      rules: {
        pName: [
          {required: true, message: "请输入零件名", trigger: "blur"},
          {validator: validatepName, trigger: 'blur'}
        ],
        uName:[
          {required: true, message: "请输入零件名", trigger: "blur"}
        ],
        pNumber: [
          {required: true, message: "请输入零件号", trigger: "blur"},
          // {required: true, pattern: /^[0-9]+$/, message: '零件号为数字',trigger: 'blur'}///
        ],
        pUnit: [
          {required: true, message: "请输入单位", trigger: "blur"},
          {validator: validatepUnit, trigger: 'blur'},
        ],
        'place.plName':[
          {required: true, message: "请输入产地或品牌", trigger: "change"}
        ],
        'unit.uName':[
          {required: true, message: "请输入单位", trigger: "change"}
        ],
        'factory.fName':[
          {required: true, message: "请输入厂家名称", trigger: "change"}
        ],
        pBuyingPrice:[
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '进价只能为数字',trigger: "blur"},
        ],
        pLowPrice: [
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '一级价只能为数字',trigger: "blur"},

        ],
        pUnitId:[
          {required: true, message: "请选择单位", trigger: "blur"}
        ],
        pPartsSizeType:[
          {required: true, message: "请选择零件尺寸", trigger: "blur"}
        ],
        pFactorytId:[
          {required: true, message: "请选择厂家", trigger: "blur"}
        ],
        pPartsStatus:[
          {required: true, message: "请选择零件状态", trigger: "blur"}
        ],
        pCategoryId:[
          {required: true, message: "请输入零件类目", trigger: "blur"}
        ],
        pMiddlePrice: [
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '二级价只能为数字',trigger: "blur"},

        ],
        pHighPrice: [
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '三级价只能为数字',trigger: "blur"},

        ],
        // pHighLimit: [
        //   {required: true, message: "请输入零件上限数目", trigger: "blur"},
        //   {required: true, pattern: /^[0-9]+$/,message: '上限数目为数字',trigger: "blur"},
        //
        // ],
        // pLowLimit: [
        //   {required: true, message: "请输入零件下限数目", trigger: "blur"},
        //   {required: true, pattern: /^[0-9]+$/,message: '下限数目为数字',trigger: "blur"},
        //
        // ],// /^[0-9]+\.[0-9]{2}$/
        pWholesalePrice:[
          {required: true, message: "请输入批发价", trigger: "blur"},
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '批发价只能为数字',trigger: "blur"},
        ],
        pRetailPrice:[
          {required: true, message: "请输入零售价", trigger: "blur"},
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '零售价只能为数字',trigger: "blur"},
        ],
        pFloorPrice:[
          {required: true, message: "请输入底价", trigger: "blur"},
          {required: true, pattern: /^[0-9]+(\.[0-9]?[0-9]?)?$/,message: '底价只能为数字',trigger: "blur"},
        ],
        pRealInventory:[
          {required: true, message: "请输入实际库存数", trigger: "blur"},
          {required: true, pattern: /^[0-9]+$/,message: '实际库存数为小数',trigger: "blur"},
        ],
        positions: [
          {required: true, message: "请输入货物编码", trigger: "blur"}
        ],
        pReturnCycle:[
          {required: true, message: "请输入周期数", trigger: "blur"},
          {required: true, pattern: /^[0-9]+$/,message: '输入为数字',trigger: "blur"},
        ]
      },

    }
  },
  //路由监听  路由切换问题
  created() {
    this.partQuery.pId = localStorage.getItem('pId')
    this.getList()
    this.getPositionCat()
    this.getLevelCat()
    this.getPCate()
    this.getRycle()
  },
  methods: {
    remoteUnit(query){
      if (query!=='') {
        this.loading = true;
        this.getUnitList(query)
      } else {
        this.unitList=[]
      }
    },
    handlePlaceChange(item){
      console.log(item);
      if(item){
        this.parts.pPlaceId=item.plId
        this.parts.place.plId=item.plId
      }
    },
    handleUnitChange(item){
      console.log(item);
      if(item){
        this.parts.pUnitId=item.uId
        this.parts.unit.uId=item.uId
      }
    },
    handleFactoryChange(item){
      console.log(item);
      if(item){
        this.parts.pFactoryId=item.fId
        this.parts.factory.fId=item.fId
      }
    },
    remotePlace(query){
      if (query!=='') {
        this.loading = true;
        this.getPlaceList(query)
      } else {
        this.placeList=[]
      }
    },
    remoteFactory(query) {
      console.log(query);
      if (query!=='') {
        this.loading = true;
        this.getFactoryList(query)
      } else {
        this.factoryList=[]
      }
    },
    getFactoryList(queryString){
      this.factoryQuery.fName = queryString;
      PostData('factory/selectAllByLike',qs.stringify(this.factoryQuery))
        .then(res =>{
          this.factoryList=res.list
          console.log(this.factoryList);
          this.loading=false
        })
    },
    getPlaceList(queryString){
      this.placeQuery.plName = queryString;
      PostData('place/selectAllByLike',qs.stringify(this.placeQuery))
        .then(res =>{
          this.placeList=res.list
          this.loading=false
        })
    },
    getUnitList(queryString){
      this.unitQuery.uName=queryString
      PostData('unit/selectAll',qs.stringify(this.unitQuery))
        .then(res =>{
          this.unitList=res.list
          console.log(this.unitList);
          this.loading=false
        })
    },
    backPre(){
      this.$router.back()
    },//返回上一页
    filterPic(){
      this.inPic=this.parts.pictureList.filter((picItem)=>{
        return picItem.type===0
      })
      this.outPic=this.parts.pictureList.filter((picItem)=>{
        return picItem.type===1
      })
    },
    getNode(){
      this.parts.positions=[]
      console.log(this.showDetail);
      for(let i=0;i<this.showDetail.length;i++){
        console.log(this.showDetail[i].join("/"));
        this.position.position=this.showDetail[i].join("/")
        this.parts.positions.push(this.position)
      }
      console.log(this.parts.positions);
    },
    getPositionCat(){
      PostData('/position/selectCatalogue',qs.stringify(this.positionQuery)).then((ref)=>{
        this.positionList=this.getTreeData(ref)
        console.log(this.positionList);
      })
    },
    getPCate(){
      PostData('/position/selectCatalogue',qs.stringify(this.pCateQuery)).then((ref)=>{
        this.categoryOption=this.getTreeData(ref)
        console.log(this.categoryOption);
      })
    },
    getLevelCat(){
      PostData('/position/selectCatalogue',qs.stringify(this.levCategoryQuery)).then(ref=>{
        this.options=this.getTreeData(ref)
      }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },//获取四级联动所有数据
    getTreeData(data){
      for(let i=0;i<data.length;i++){
        if(data[i].children.length<1){
          // children若为空数组，则将children设为undefined
          data[i].children=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },

    getList() {
      PostData('parts/selectOne',qs.stringify(this.partQuery))
        .then(res=>{
          console.log(res);
          this.handleList(res)
          this.parts = res
          if(this.parts.pHighLimit===-1){
            this.parts.pHighLimit=null
          }
          if(this.parts.pLowLimit===-1){
            this.parts.pLowLimit=null
          }
          console.log(this.parts);
          this.filterPic()
          // console.log(res.pictureList[0]);
        })
    },
    handleList(res){
      if(res.pCarName){
        res.pCarName=res.pCarName.split("/")
      }
      if(res.pCategoryId){
        res.pCategoryId=res.pCategoryId.split("/")
      }
      if(res.positions){
        this.parts.positions=[]
        res.positions.forEach(item=>{
          this.parts.positions.push(item.position.split("/"))
        })
        res.positions=this.parts.positions
      }
    },
    getRycle(){
      PostData('/returnCycle/selectAll',qs.stringify(this.cycleQuery))
        .then(res=>{
          this.cycleList = res.list
        }).catch(err=>{
        this.$message.error(err.message);
        console.log(err);
      })
    },
    handleSubmitInfo(value){
      let tempArray=[]
      if(value.positions){
        value.positions.forEach(item=>{
          console.log(item.join("/"));
          this.tempObj={}
          this.tempObj.position=item.join("/")
          tempArray.push(this.tempObj)
        })
        this.parts.positions=tempArray
      }
      if(this.parts.pCarName){
        this.parts.pCarName=this.parts.pCarName.join("/")
      }
      if(this.parts.pCategoryId){
        this.parts.pCategoryId=this.parts.pCategoryId.join("/")
      }
    },
    saveOrUpdate(){
      PostData('parts/update',this.parts)
        .then(res=>{
          this.$message({
            type:'success',
            message:'保存信息成功'
          })
        })
      this.$router.push({path:'/parts/part'})
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleSubmitInfo(this.parts)
          console.log(this.parts);
          PostData('parts/update', this.parts)
            .then(res => {
              console.log(res);
              if(res.code===500){
                this.$message({
                  type:"warning",
                  message:res.cause
                })
              }
              else {
                console.log(res);
                this.$message({
                  type: 'success',
                  message: '保存信息成功'
                })
                this.$router.push({path: '/parts/part'})
              }
            }).catch(() => {
          })
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
    }
  }
}
</script>

<style>
body{
  background: white;
}
.content{
  width: 20%;
  height: 20%;
  vertical-align: center;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

/*.el-carousel__item:nth-child(2n) {*/
/*  background-color: #99a9bf;*/
/*}*/

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
