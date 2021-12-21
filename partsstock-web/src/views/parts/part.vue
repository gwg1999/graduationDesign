<!--<meta http-equiv="X-UA-Compatible" content="IE=8">-->
<!--<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />-->
<template>
  <div class="app-container" style="background: white">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" style="position: relative">
      <template slot-scope="scoped">
      <el-form-item>
<!--        <el-input v-model="partQuery.pName" clearable placeholder="零件名"  style="width: 150px"/>-->
        <el-input v-model="pGoodsNum" placeholder="请输入零件号" style="width: 30%" class="search" clearable></el-input>
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearch"
          placeholder="请输入零件名"
          :trigger-on-focus="false"
          @select="handleSelect"
          class="search"
          clearable>
          <!--      <i-->
          <!--        class="el-icon-edit el-input__icon"-->
          <!--        slot="suffix"-->
          <!--        @click="handleIconClick">-->
          <!--      </i>-->
          <template slot-scope="{ item }">
            <div>{{ item.pName }}</div>
            <!--        <span class="addr">{{ item.address }}</span>-->
          </template>
        </el-autocomplete>
        <el-cascader
          ref="pCatCascader"
          :options="categoryOption"
          placeholder="请选择零件类目"
          :props="{value:'name', label:'name'}"
          @change="handleChange(pCategoryList)"
          :show-all-levels="false"
          v-model="pCategoryList"
          class="search"
          clearable>
          <template slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>
      <el-select v-model="searchQuery.pPartsStatus" placeholder="零件状态" @change="handleStatusChange" style="margin-left: 18px" clearable>
        <el-option :value="1" label="上架"></el-option>
        <el-option :value="0" label="下架"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 10px" @click="toInsert()" >添加</el-button>

      </template>

    </el-form>

    <!-- 表格 -->
    <el-table use-virtual
      :data="list"
      border
      fit
      highlight-current-row
    style="width: 100%">
      <el-table-column
        label="序号"
        width="50%"
        align="center">
        <template slot-scope="scope">
          {{ (searchQuery.pageNum - 1) * searchQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="pId" label="序列号" width="100" align="center" />
      <el-table-column prop="pNumber" label="零件号" width="170" align="center" />
      <el-table-column prop="pName" label="零件名" width="250" align="center" />
      <el-table-column prop="place.plName" label="产地或品牌" width="100"  align="center"/>
      <el-table-column prop="factory.fName" label="厂家" width="80"  align="center"/>
      <el-table-column prop="unit.uName" label="单位" width="40%" align="center"/>
<!--      <el-table-column prop="supplier.sName" label="供应商" width="50%"  align="center"/>-->
<!--      <el-table-column prop="pCarName" label="车属性" width="50%"  align="center"/>-->
<!--      <el-table-column prop="pLowPrice" label="一级价格" width="50%"  align="center"/>-->
<!--      <el-table-column prop="pMiddlePrice" label="二级价格" width="50%" align="center" />-->
<!--      <el-table-column prop="pHighPrice" label="三级价格" width="50%"  align="center"/>-->
      <el-table-column prop="pBuyingPrice" label="进价" width="100"  align="center"/>
      <el-table-column prop="pHighLimit" label="上限" width="80"  align="center"/>
      <el-table-column prop="pLowLimit" label="下限" width="80"  align="center"/>
      <!--     <el-table-column prop="pNote" label="备注" width="80"  align="center"/>-->
     <!--      <el-table-column prop="pPicture" label="图片" width="120"  align="center"/>-->
      <el-table-column prop="pRealInventory" label="实际库存数" width="100"  align="center"/>
<!--      <el-table-column prop="pPartsSizeType" labenpml="零件大小" width="100"  align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <tabs  v-if="scope.row.pPartsSizeType===0">小</tabs>-->
<!--          <tabs  v-if="scope.row.pPartsSizeType===1">中</tabs>-->
<!--          <tabs  v-if="scope.row.pPartsSizeType===2">大</tabs>-->
<!--        </template>-->
<!--      </el-table-column>-->


<!--      <el-table-column prop="pReturnCycle" label="产品售后周期（三保）" width="60%"  align="center"/>-->

      <el-table-column prop="pPartsStatus" label="状态" width="70%" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.pPartsStatus === 1
                    ? 'success'
                    : scope.row.pPartsStatus === 0
                    ? 'danger'
                    : ''
               "
          >{{scope.row.pPartsStatus===1?'上架':'下架'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
<!--          <router-link :to="'/parts/editPart/'+scope.row.pid">-->
<!--            <el-button type="primary" size="mini" icon="el-icon-edit" >修改</el-button>-->
<!--          </router-link>-->
          <!--        <router-link :to="{name:'part',params:scope.row }"> -->
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.$index)">查看详情</el-button>
           <!--       </router-link>   -->

                    <el-button  size="mini" icon="el-icon-edit"
                                :type="scope.row.pPartsStatus === 1
                                ? 'danger'
                                : scope.row.pPartsStatus === 0
                                ? 'success'
                                : ''
                          "
                                @click="editCancel(scope.$index,scope.row)">{{ scope.row.pPartsStatus===1?'注销':'启用'}}
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="deletePart(scope.row)" v-if="scope.row.pPartsStatus===0"></el-button>
          </template>
      </el-table-column>


            </el-table>


            <el-pagination
              layout="total, prev, pager, next, jumper"
              :page-size="partQuery.pageSize"
              :current-page="partQuery.pageNum"
              :total="pageTotal"
              style="padding: 30px 0; text-align: right;"
              @current-change="handlePageChange"
            />
          </div>
        </template>
        <script>
        import {GetData,PostData} from "../../api/index"
        import qs from 'qs'
        import request from "@/utils/request";
        // export const PostData = (url, body) =>{
        //   return request({
        //     url: `http://192.168.31.135:8080/` + url,
        //     method: 'post',
        //     data: body,
        //   })
        // };

        export default {
          name: "list",
          data(){//定义变量和初始值
            return{
              list: [], //查询之后接口返回集合
              categoryOption:[],
              pCategoryList:[],
              state:'',//模糊查询后返回的值
              pGoodsNum:'',
              total:0,//总记录数
              partQuery:{
                pId:null,
                pName:null,
                pPartsStatus:1,
                pageSize: 10,
                pageNum: 1,
              },
              pCateQuery:{
                status:1,
                type:2
              },
              deleteQuery:{},
              searchQuery:{
                pName:'',
                pNumber:'',
                pCategoryId:'',
                pPartsStatus:1,
                pageSize: 10,
                pageNum: 1,
              },
              selectCondition: {},
              pageTotal: 0,
            }
          },
          created() {//页面渲染之前执行，一般调用methods中定义的方法
             this.getList()
             this.getPCate()
            // this.getPageTotal()
          },
          resetData(){
            this.getList()
            this.getPageTotal()
          },
          methods:{//创建具体的方法
            getList() {
              PostData('parts/selectAllByLike',qs.stringify(this.partQuery))
                .then(res=>{
                  this.list = res.list
                  console.log(this.list);
                  this.pageTotal=res.total
                }).catch(err=>{
                this.$message.error(err.message);
                console.log(err);
              })
            },
            handleStatusChange(){
              this.search()
            },
            getPCate(){
              PostData('/position/selectCatalogue',qs.stringify(this.pCateQuery)).then((ref)=>{
                this.categoryOption=this.getTreeData(ref)
                console.log(this.categoryOption);
              })
            },
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
            toInsert(){
              this.$router.push('/parts/addPart')
            },
            getPartList(){
              this.partQuery.pName=this.state
              this.partQuery.pageNum=1
              PostData('parts/selectAllByLike',qs.stringify(this.partQuery))
                .then(res=>{
                  this.list=res.list
                  this.pageTotal=res.total
                }).catch(err=>{
                this.$message.error(err.message);
                console.log(err);
              })
            },

            getPageTotal(){
              this.selectCondition = JSON.parse(JSON.stringify(this.partQuery))
              this.selectCondition.pageNum = this.selectCondition.pageSize = 0
              PostData('parts/selectAllByLike',this.selectCondition).then(res=>{
                this.pageTotal = res.length
              })
            },
            // 分页处理
            handlePageChange(val){
              this.searchQuery.pageNum = val
              this.searchList()
            },
            search(){
              this.searchQuery.pageNum=1
              this.searchQuery.pName=this.state
              this.searchQuery.pNumber=this.pGoodsNum
              this.searchQuery.pCategoryId=this.pCategoryList.join("/")
              console.log(this.searchQuery);
              this.searchList()
              // this.getPageTotal()
            },
            searchList(){
              PostData('parts/selectAllByLike',qs.stringify(this.searchQuery))
                .then(res=>{
                  this.list=res.list
                  this.pageTotal=res.total
                }).catch(err=>{
                this.$message.error(err.message);
                console.log(err);
              })
            },

            // 跳转详情页
            showDetails(index){
              localStorage.setItem('pId',this.list[index].pId)
              this.$router.push('/parts/editPart')
            },
            editCancel(index,param){
              this.$confirm('是否将此零件'+(param.pPartsStatus===0?'上架':'下架')+'?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.list[index].pPartsStatus = 1 - this.list[index].pPartsStatus
                PostData('/parts/deleteByLogic',this.list[index])
                  .then(res=>{
                  this.getList()
                  if(this.list[index].pPartsStatus===0){
                    this.$message({
                      type: 'success',
                      message: '注销成功!'
                    })
                  }
                  else {
                    this.$message({
                      type: 'success',
                      message: '启用成功!'
                    })
                  }
                })
              })
            },
            querySearch(queryString, cb) {
              this.partQuery.pName=queryString;
              this.partQuery.pageNum=1
              PostData('parts/selectAllByLike',qs.stringify(this.partQuery)).then(ref=>{
                cb(ref.list)
              })
              // 调用 callback 返回建议列表的数据
            },
            handleChange(value) {
              this.parts.pCarName=value.join("/")
              console.log(this.parts.pCarName);
            },
            handleSelect(item) {
              this.state=item.pName
            },
            deletePart(data){
              console.log(data);
              this.deleteQuery.partsId=data.pId
              console.log(this.deleteQuery);
              GetData('/parts/deleteByPartsId',this.deleteQuery).then(ref=>{
                this.$message({
                  type:"success",
                  message:'删除成功'
                })
                this.search()
              })
            }
          }
          }
        </script>
        <style scoped>
        .search{
          margin-right: 3px;
        }
        </style>
