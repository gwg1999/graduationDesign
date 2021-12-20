<template>
  <div class="app-container">
    <h6 style="float:right;margin-top:0;color: red">F5查看该零件本客户的历史记录,F8查看该零件的订单记录,F6查看进货历史记录,
      在添加整件时F7查看该整件的零件关系</h6>
    <el-form :inline="true" class="demo-form-inline" style="position: relative;margin-top: 40px ">
      <el-form-item>
        <el-select   v-model="levelIV.odType"   clearable placeholder="选择商品类型" style="width: 130px"  @change="changeTotal($event)" >
          <el-option :value="1" label="零件"/>
          <el-option :value="0" label="整件"/>
        </el-select>
      </el-form-item>
      <el-form-item   v-if="levelIV.odType===1" style="width: 200px" >
        <el-input   v-model="levelIV.pNumber" placeholder="请输入零件号" ></el-input>
      </el-form-item>
      <el-form-item   v-if="levelIV.odType===1" style="width: 210px">
        <el-input v-model="levelIV.pName" placeholder="请输入零件名" ></el-input>
      </el-form-item>
      <el-form-item   v-if="levelIV.odType===1" style="width: 200px" >
        <el-cascader
          placeholder="请选择零件类目"
          v-model="levelIV.pCategoryId"
          :props="{value:'name',label:'name'}"
          :show-all-levels="false"
          clearable
          @change="queryGoods"
          :options="levelIVDirectoryList"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data["name"] }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item   v-if="levelIV.odType===0" style="width: 210px">
        <el-input v-model="levelIV.wName" placeholder="请输入整件名" ></el-input>
      </el-form-item>
      <el-button :disabled="!(levelIV.odType===0||levelIV.odType===1)" type="primary" style="position: absolute" icon="el-icon-search" @click="queryGoods">查询</el-button>
      <el-button type="primary" icon="el-icon-view" style="position: absolute;right: 10px" @click="showSelected">查看已选零件</el-button>
    </el-form>
    <!-- 零件添加表格 -->
    <el-table :data="list"
              border
              fit
              v-show="levelIV.odType===1"
              highlight-current-row
              style="width: 100%;font-size: 2px;line-height:20px;padding: 0">
      <el-table-column
        label="序号"
        width="50%"
        align="center">
        <template slot-scope="scope">
          {{ (levelIV.pageNum - 1) * levelIV.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column type="expand" label="详情" width="50px">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" label-width="80px" :label-position="right">
            <el-form-item label="零件类目:">
              <span>{{ props.row.pCategoryId }}</span>
            </el-form-item>
            <el-form-item label="厂家:">
              <span>{{ props.row.factory.fName }}</span>
            </el-form-item>
            <el-form-item label="货物位置:">
              <span>{{ props.row.pCategoryId }}</span>
            </el-form-item>
            <el-form-item label="图片:">
            </el-form-item>
            <el-form-item label="备注:" style="height: 163px;width: 50%">
              <span>{{ props.row.pNote }}</span>
            </el-form-item>
            <el-form-item>
              <div class="demo-image__placeholder">
                <div class="block">
                  <el-image :src="props.row.pictures[0].path" style="height: 150px;width: 100%;padding-top: 10px;padding-left: 180px">
                    <div slot="placeholder" class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </el-image>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="pNumber" label="零件号" width="80px" align="center" />
      <el-table-column prop="pName" label="零件名" width="100px" align="center" />
      <el-table-column prop="place.plName" label="产地或品牌" width="100px"  align="center"/>
      <el-table-column prop="unit.uName" label="单位" width="60px" align="center"/>
      <el-table-column prop="pLowPrice" label="一级价格" width="70px"  align="center"/>
      <el-table-column prop="pMiddlePrice" label="二级价格" width="70px" align="center" />
      <el-table-column prop="pHighPrice" label="三级价格" width="70px"  align="center"/>
      <el-table-column prop="pBuyingPrice" label="进价" width="70px"  align="center"/>
      <el-table-column prop="pRealInventory" label="库存数" width="70px"  align="center"/>
      <el-table-column prop="pId" label="零件数目和价格" align="center">
        <template slot-scope="scope">
          <el-form>
            <div style="display: flex;justify-content: space-evenly;font-size: 4px;height: 40px">
              <el-form-item>
                数量:<el-input-number @keyup.119.native="searchNoCustomerList(scope.row.pId)" @keyup.117.native="searchHistoryList(scope.row.pId)" @keyup.116.native="searchList(scope.row.pId)"  v-model = "scope.row.odNumber"  size="small"></el-input-number>
              </el-form-item>
              <el-form-item>
                价格:<el-input  @keyup.native="scope.row.odRetailPrice = oninput(scope.row.odRetailPrice)" v-model = "scope.row.odRetailPrice" style="width: 100px;" size="small" ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addPart(scope.row)">添加</el-button>
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <!--    整件添加表格-->
    <el-table use-virtual
              :data="wholeList"
              border
              v-show="levelIV.odType===0"
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column
        label="序号"
        width="50%"
        align="center">
        <template slot-scope="scope">
          {{ (levelIV.pageNum - 1) * levelIV.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="wName" label="整件名" width="140px" align="center" />
      <el-table-column prop="wNumber" label="整件数量"  width="140px" align="center" />
      <el-table-column prop="wAlarmNumber" label="告警量"  width="140px" align="center" />
      <el-table-column prop="wId" label="零件数目和价格" align="center">
        <template slot-scope="scope">
          <el-form>
            <div style="display: flex;justify-content: space-evenly;font-size: 4px;height: 40px">
              <el-form-item>
                数量:<el-input-number @keyup.119.native="searchNoCustomerList(scope.row.wId)" @keyup.118.native="searchWhole(scope.row.wId)" @keyup.117.native="searchHistoryList(scope.row.wId)" @keyup.116.native="searchList(scope.row.wId)"  v-model = "scope.row.odNumber"  size="small"></el-input-number>
              </el-form-item>
              <el-form-item>
                价格:<el-input @keyup.native="scope.row.odRetailPrice = oninput(scope.row.odRetailPrice)" v-model = "scope.row.odRetailPrice" style="width: 100px;" size="small" ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addPart(scope.row)">添加</el-button>
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="levelIV.pageSize"
      :current-page="levelIV.pageNum"
      :total="total"
      style="padding: 30px 0; text-align: right;"
      @current-change="queryGoods"
    />
    <!-- 历史价格 -->
    <el-dialog :visible.sync="dialogHistoryPrice"  title="客户该商品历史信息" width="70%">
      <el-table
        :data="historyPriceList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (historyPage.pageNum - 1) * historyPage.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="odOrderId" label="订单ID"  align="center" />
        <el-table-column prop="odCustomerId" label="客户ID"  align="center" />
        <el-table-column prop="odPartsId" label="零件或整件ID"  align="center"/>
        <el-table-column prop="odType" label="类型"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odType===0?'整件':'零件'}}
          </template>
        </el-table-column>
        <el-table-column prop="odNumber" label="数量" align="center" />
        <el-table-column prop="odRetailPrice" label="价格"  align="center" />
        <el-table-column prop="odSizeType" label="零件大小"  align="center" >
          <template slot-scope="scope">
            {{ scope.row.odSizeType===0?'大':'小'}}
          </template>
        </el-table-column>
        <el-table-column prop="odCreateTime" label="创建时间"  align="center" />
        <el-table-column prop="odStatus" label="零件状态"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odStatus===0?'正常':scope.row.odStatus===1?'退货':'结束'}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--    历史进货记录-->
    <el-dialog :visible.sync="dialogGoodPrice"  title="该商品进货历史信息" width="70%">
      <el-table
        :data="historyPurchasePriceList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (historyPurchasePriceQuery.pageNum - 1) * historyPurchasePriceQuery.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="sdPartsName" label="零件名"  align="center" />
        <el-table-column prop="sdPrice" label="价格"  align="center" />
        <el-table-column prop="sdType" label="类型"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odType===0?'整件':'零件'}}
          </template>
        </el-table-column>
        <el-table-column prop="sdNumber" label="数量" align="center" />
        <el-table-column prop="sdDeliveryCycle" label="供货周期"  align="center" />
        <el-table-column prop="sdCreateTime" label="创建时间"  align="center" />
      </el-table>
    </el-dialog>
    <!--    整件零件关系表-->
    <el-dialog :visible.sync="dialogWholePartVisible"  title="整件零件关系表" width="70%">
      <el-table
        :data="wholePartsList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (queryWholeParts.pageNum - 1) * queryWholeParts.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="parts.pName" label="零件名称"  align="center" />
        <el-table-column prop="parts.pNumber" label="零件号"  align="center" />
        <el-table-column prop="parts.pRealInventory" label="库存数"  align="center"/>
        <el-table-column prop="parts.pPartsStatus" label="状态"  align="center">
          <template slot-scope="scope">
            {{ scope.row.parts.pPartsStatus===0?'上架':'下架'}}
          </template>
        </el-table-column>
        <el-table-column prop="parts.pBuyingPrice" label="进价" align="center" />
        <el-table-column prop="parts.pLowPrice" label="一级价格"  align="center" />
        <el-table-column prop="parts.pMiddlePrice" label="二级价格"  align="center" />
        <el-table-column prop="parts.pHighPrice" label="三级价格"  align="center" />
        <el-table-column prop="partsNum" label="一个整件所需零件数"  align="center" />
      </el-table>
    </el-dialog>
    <!--    购物车-->
    <el-dialog
      :visible.sync="dialogVisible"
      width="80%"
      class="my-info-dialog"
      style="padding-top: 0;padding-bottom: 0"
    >
      <el-container class="my-info-container" style="padding-top: 0">
        <el-main style="padding-top: 0;padding-bottom: 0">
          <el-form :model="priceSlip" status-icon ref="priceSlip" label-width="100px" class="demo-ruleForm" style="padding-top: 0;padding-bottom: 0">
            <h4>零件信息</h4>
            <div style="float: top;padding:0" >
              <el-table
                style="padding-top: 0"
                :data="priceSlip.orderDetailList"
                border
                fit
                highlight-current-row>
                <el-table-column prop="pNumber" label="零件号" width="200px" align="center"/>
                <el-table-column prop="pName" label="零件名" width="200px" align="center"/>
                <el-table-column prop="place.plName" label="产地" width="150px" align="center"/>
                <el-table-column prop="unit.uName" label="单位" width="80px" align="center"/>
                <el-table-column prop="odNumber" label="数量" width="80px" align="center"/>
                <el-table-column prop="odRetailPrice" label="单价" width="80px" align="center"/>
                <el-table-column prop="totalPrice" label="总价" width="110px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.odNumber*scope.row.odRetailPrice}}
                  </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit"  @click="openPartRecordDialog(scope.row)">修改</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deletePartRecord(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <h4>整件信息</h4>
            <div style="float: bottom">
              <el-table
                style="padding: 0"
                :data="priceSlip.wholeDetailsList"
                border
                fit
                highlight-current-row>
                <el-table-column prop="wName" label="整件名" width="200px" align="center"/>
                <el-table-column prop="odNumber" label="数量" width="200px" align="center"/>
                <el-table-column prop="odRetailPrice" label="单价" width="150px" align="center"/>
                <el-table-column prop="totalPrice" label="总价" width="110px" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.odNumber*scope.row.odRetailPrice}}
                  </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit"  @click="openWholeRecordDialog(scope.row)">修改</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-delete"  @click="deleteWholeRecord(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </el-main>
        <el-footer style="padding-top: 10px">
          <el-button style="margin-left:70% " @click="dialogVisible = false">取 消</el-button>
          <el-button style="margin-right:5% " type="primary" @click="submitForm">确 定</el-button>
        </el-footer>
      </el-container>
    </el-dialog>
    <!--    修改购物车零件-->
    <el-dialog :visible.sync="dialogPartsVisible" title="修改购物车零件">
      <el-form :model="partsModify" label-width="120px" ref="partsModify" :rules="rules">
        <el-form-item label="零件数量" prop="odNumber">
          <el-input   v-model="partsModify.odNumber"/>
        </el-form-item>
        <el-form-item label="零件价格" prop="odRetailPrice">
          <el-input  @keyup.native="partsModify.odRetailPrice = oninput(partsModify.odRetailPrice)" v-model="partsModify.odRetailPrice"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPartsVisible = false">取 消</el-button>
        <el-button  type="primary"
                    @click="UpdateParts()">确 定</el-button>
      </div>
    </el-dialog>
    <!--    修改购物车整件-->
    <el-dialog :visible.sync="dialogWholeVisible" title="修改购物车整件">
      <el-form :model="wholesModify" label-width="120px" ref="wholesModify" :rules="rules">
        <el-form-item label="整件数量" prop="odNumber" >
          <el-input  v-model="wholesModify.odNumber"/>
        </el-form-item>
        <el-form-item label="整件价格" prop="odRetailPrice" >
          <el-input @keyup.native="wholesModify.odRetailPrice = oninput(wholesModify.odRetailPrice)" v-model="wholesModify.odRetailPrice"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWholeVisible = false">取 消</el-button>
        <el-button  type="primary"
                    @click="UpdateWhole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 所有客户历史价格 -->
    <el-dialog :visible.sync="dialogNoCustomerHistoryPrice"  title="该商品历史信息" width="70%">
      <el-table
        :data="historyNoCustomerPriceList"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (historyNoCustomerQuery.pageNum - 1) * historyNoCustomerQuery.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="odOrderId" label="订单ID"  align="center" />
        <el-table-column prop="odCustomerId" label="客户ID"  align="center" />
        <el-table-column prop="odPartsId" label="零件或整件ID"  align="center"/>
        <el-table-column prop="odType" label="类型"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odType===0?'整件':'零件'}}
          </template>
        </el-table-column>
        <el-table-column prop="odNumber" label="数量" align="center" />
        <el-table-column prop="odRetailPrice" label="价格"  align="center" />
        <el-table-column prop="odSizeType" label="零件大小"  align="center" >
          <template slot-scope="scope">
            {{ scope.row.odSizeType===0?'大':'小'}}
          </template>
        </el-table-column>
        <el-table-column prop="odCreateTime" label="创建时间"  align="center" />
        <el-table-column prop="odStatus" label="零件状态"  align="center">
          <template slot-scope="scope">
            {{ scope.row.odStatus===0?'正常':scope.row.odStatus===1?'退货':'结束'}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--缺货备注提醒-->
    <el-dialog :visible.sync="dialogNote"  title="缺货备注提醒" width="70%">
      <el-form :model="priceNote" label-width="120px" ref="priceNote" :rules="rules">
        <el-form-item label="备注" prop="note">
          <el-input v-model="priceNote.note" style="width: 90%" rows="5" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNote = false">取 消</el-button>
        <el-button  type="primary"
                    @click="UpdateNote()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import {levelIVDirectory, PurchasePrice, queryHistoryPrice} from "@/views/Slips/myApi";
import {getTime,stopF5F6} from "@/views/Slips/myUtils"
import {PostData} from "@/api";
import Cookie from "js-cookie";
import {validatePassCheck} from "@/views/Slips/ruleNumber";
export default {
  data() {
    return {
      //零件负数添加备注
      dialogNote:false,
      priceNote:{},
      //该零件历史记录
      dialogNoCustomerHistoryPrice:false,
      historyNoCustomerPriceList:[],
      historyNoCustomerQuery:{
        pageNum:1,
        pageSize:10
      },
      //购物车整件修改
      wholesModify:{},
      dialogWholeVisible:false,
      //购物车零件修改
      partsModify:{},
      dialogPartsVisible:false,
      //整件列表
      wholePartsList:[],
      dialogWholePartVisible:false,
      queryWholeParts:{
        pageNum:1,
        pageSize:10,
      },
      dialogGoodPrice:false,
      historyPurchasePriceList:[],
      historyPurchasePriceQuery:{
        pageNum:1,
        pageSize:10
      },
      //历史价格弹框
      dialogHistoryPrice:false,
      historyPage:{
        pageNum:1,
        pageSize:10
      },
      historyPriceList:[],
      whole:{},
      dialogVisible:false,
      customerPrince:null,
      wholeList:[],
      list:[],
      total:0,
      levelIV:{
        pageNum:1,
        pageSize:10
      },
      levelIVDirectoryList:[],
      priceSlip:{
        orderDetailList:[],
        wholeDetailsList:[]
      },
      rules:{
        odNumber: [
          {required: true, message: '请输入数量', trigger: 'change'},
          {  validator:validatePassCheck, trigger: 'change' }
        ],
        odRetailPrice:[
          {required: true, message: '请输入价格', trigger: 'change'}
        ],
        note:[
          {required: true, message: '请输入备注', trigger: 'change'}
        ]
      }
    }
  },
  created() {
    this.priceSlip.oCustomerId=this.$route.query.oCustomerId
    this.getList()
    this.getPrice()
    stopF5F6()
  },
  methods: {
    //购物车零件操作
    openPartRecordDialog(record){
      this.dialogPartsVisible=true
      this.partsModify=JSON.parse(JSON.stringify(record))
    },
    deletePartRecord(record){
      this.$confirm('是否将此条零件信息从购物车删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        for(let i=0;i<this.priceSlip.orderDetailList.length;i++){
          if(this.priceSlip.orderDetailList[i].pId===record.pId){
            this.priceSlip.orderDetailList.splice(i, 1)
          }
        }
      })
    },
    UpdateParts(){
      this.$refs['partsModify'].validate((valid)=>{
        if(valid){
          for(let i=0;i<this.priceSlip.orderDetailList.length;i++){
            if(this.priceSlip.orderDetailList[i].pId===this.partsModify.pId){
              this.priceSlip.orderDetailList[i].odNumber=this.partsModify.odNumber
              this.priceSlip.orderDetailList[i].odRetailPrice=this.partsModify.odRetailPrice
            }
          }
          this.dialogPartsVisible=false
        }
      })
    },
    //购物车整件操作
    deleteWholeRecord(record){
      this.$confirm('是否将此条整件信息从购物车删除'+'?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        for(let i=0;i<this.priceSlip.wholeDetailsList.length;i++){
          if(this.priceSlip.wholeDetailsList[i].wId===record.wId){
            this.priceSlip.wholeDetailsList.splice(i, 1)
          }
        }
      })
    },
    openWholeRecordDialog(record){
      this.dialogWholeVisible=true
      this.wholesModify=JSON.parse(JSON.stringify(record))
    },
    UpdateWhole(){
      this.$refs['wholesModify'].validate((valid)=>{
        if(valid){
          console.log(valid)
          for(let i=0;i<this.priceSlip.wholeDetailsList.length;i++){
            if(this.priceSlip.wholeDetailsList[i].wId===this.wholesModify.wId){
              this.priceSlip.wholeDetailsList[i].odNumber=this.wholesModify.odNumber
              this.priceSlip.wholeDetailsList[i].odRetailPrice=this.wholesModify.odRetailPrice
            }
          }
          this.dialogWholeVisible=false
        }
      })
    },
    //零件整件切换页数变化
    changeTotal(event){
      if(event>=0){
        this.total=0
      }
    },
    //整件零件关系
    searchWhole(wId){
      this.queryWholeParts.wId=wId
      PostData("/whole/selectWholeParts",this.queryWholeParts).then(res=>{
        console.log(res)
        this.wholePartsList=res[0].partsWholeList
      })
      this.dialogWholePartVisible=true
    },
    //进货历史记录
    searchHistoryList(pId){
      PurchasePrice(undefined,pId,this.levelIV.odType).then(res=>{
        for (let i=0;i<res.length;i++){
          res[i].sdCreateTime = getTime(res[i].sdCreateTime)
        }
        console.log(res)
        this.historyPurchasePriceList=res
        if(this.historyPurchasePriceList&&this.historyPurchasePriceList.length>0){
          this.dialogGoodPrice=true
        }else{
          this.$message({
            type:'info',
            message:"还没有该商品进货的记录"
          })
        }
      })
    },
    //零件售卖记录该客户
    searchList(pId){
      let customerId=this.$route.query.oCustomerId
      let type=this.levelIV.odType
      queryHistoryPrice(customerId,pId,type).then(res=>
      {
        for (let i=0;i<res.length;i++){
          res[i].odCreateTime = getTime(res[i].odCreateTime)
        }
        this.historyPriceList=res
        if(this.historyPriceList&&this.historyPriceList.length>0){
          this.dialogHistoryPrice=true
        }else {
          this.$message({
            type:'info',
            message:"该客户还没有该订单的历史信息"
          })
        }
      })
    },
    //零件售卖记录所有客户
    searchNoCustomerList(pId){
      let type=this.levelIV.odType
      console.log(pId)
      queryHistoryPrice(undefined,pId,type).then(res=>
      {
        for (let i=0;i<res.length;i++){
          res[i].odCreateTime = getTime(res[i].odCreateTime)
        }
        this.historyNoCustomerPriceList=res
        if(this.historyNoCustomerPriceList&&this.historyNoCustomerPriceList.length>0){
          this.dialogNoCustomerHistoryPrice=true
        }else {
          this.$message({
            type:'info',
            message:"还没有该商品的历史订单"
          })
        }
      })
    },
    //购物车
    showSelected(){
      this.dialogVisible=true
    },
    //提交销售单
    submitForm(){
      try {
        this.priceNote={}
        this.$refs['priceSlip'].validate((valid) => {
          if (valid) {
            this.priceSlip.oCustomerId=this.$route.query.oCustomerId
            this.priceSlip.oId=this.$route.query.oId
            this.priceSlip.oStatus=1
            this.priceSlip.oCreatePeopleId = parseInt(Cookie.get('aId'))
            this.priceSlip.oType=3
            this.priceSlip.oIsPackage=1
            this.priceSlip.oOrderClosingStatus=2
            if(this.priceSlip.wholeDetailsList&&this.priceSlip.wholeDetailsList.length>0){
              this.priceSlip.wholeDetailsList.forEach((value)=>{
                value.pName=value.wName
                value.odPartsId=value.wId
              })
            }
            this.priceSlip.orderDetailList=[...this.priceSlip.orderDetailList,...this.priceSlip.wholeDetailsList]
            let oSupposeIncome = 0
            for (let i = 0; i < this.priceSlip.orderDetailList.length; i++) {
              this.priceSlip.orderDetailList[i].odOrderId=this.$route.query.oId
              this.priceSlip.orderDetailList[i].odCustomerId = this.$route.query.oCustomerId
              this.priceSlip.orderDetailList[i].odStatus=0
              this.priceSlip.orderDetailList[i].odSizeType= this.priceSlip.orderDetailList[i].pPartsSizeType
              let partPrince = this.priceSlip.orderDetailList[i].odRetailPrice
              oSupposeIncome += partPrince * this.priceSlip.orderDetailList[i].odNumber
            }
            this.priceSlip.oSupposeIncome = oSupposeIncome
            PostData('/OrderDetail/addOrderDetail',this.priceSlip)
              .then(res=>{
                if (res.result === 'fails') {
                  let note=''
                  res.lackPartList.forEach((value) => {
                    let number = null
                    number = +value.lackNumber - (2 * value.lackNumber)
                    alert('由于' + value.pName + '数量不足,添加销售单失败,目前' + value.pName + '的数量为'
                      + value.pRealInventory + '还缺少' + number)
                    note += `${value.pName}缺${number}个.`
                  })
                  let Note = {}
                  Note.status = 0
                  Note.operateId = parseInt(Cookie.get('aId'))
                  Note.type = 0
                  Note.note = note
                  this.priceNote=Note
                  this.dialogNote=true
                  this.UpdateNote()
                }else{
                  this.dialogVisible=false
                  this.$message({
                    type: 'success',
                    message: '增加销售单成功'
                  })
                  this.$router.back()
                }
              }).catch(()=>{})
          } else {
            return false;
          }
        });
      }catch (e) {
      }finally {

      }
    },
    //负数零件备注增加
    UpdateNote(){
      this.$refs.priceNote.validate((valid)=>{
        if(valid){
          PostData('/note/insert', this.priceNote).then(res => {
            this.dialogNote=false
            this.dialogVisible=false
            this.$message({
              type: 'success',
              message: '增加销售单成功'
            })
            this.$router.back()
          })
        }
      })
    },
    //添加零件
    addPart(item){
      let temp=Object.assign({},item)
      temp.odType=this.levelIV.odType
      if(temp.odType===1){
        let flag=false
        if(temp.odNumber&&temp.odRetailPrice){
          for(let part of this.priceSlip.orderDetailList){
            if(item.pId===part.pId) {
              part.odNumber += item.odNumber
              part.odRetailPrice=item.odRetailPrice
              flag = true
              this.$message({
                message: '已修改零件数量',
                type: "success"
              })
            }
          }
          if(!flag){
            temp.odPartsId=temp.pId
            this.priceSlip.orderDetailList.push(temp)
            this.$message({
              message:'已添加至已选零件库',
              type:"success"
            })
          }
        }
        else {
          this.$message({
            message:'请输入零件数量或价格',
            type:"warning"
          })
        }}
      else {
        let flag=false
        if(temp.odNumber&&temp.odRetailPrice){
          for (let part of this.priceSlip.wholeDetailsList) {
            if (item.wId === part.wId) {
              part.odNumber += item.odNumber
              part.odRetailPrice=item.odRetailPrice
              flag = true
              this.$message({
                message: '已修改整件数量',
                type: "success"
              })
            }
          }
          if(!flag){
            temp.odPartsId=temp.wId
            this.priceSlip.wholeDetailsList.push(temp)
            this.$message({
              message:'已添加至已选整件库',
              type:"success"
            })
          }
        }
        else {
          this.$message({
            message:'请输入整件数量或价格',
            type:"warning"
          })
        }
      }
    },
    //查询
    queryGoods(pageNum=1){
      if(this.levelIV.odType===1){
        let levelIVCopy={}
        if(typeof pageNum==="number"){
          this.levelIV.pageNum=pageNum
          levelIVCopy.pageNum=pageNum
          levelIVCopy=JSON.parse(JSON.stringify(this.levelIV))
          let categoryList=""
          if(levelIVCopy.pCategoryId &&levelIVCopy.pCategoryId.length>0&&typeof levelIVCopy.pCategoryId!="string") {
            levelIVCopy.pCategoryId.forEach((item, index, array) => {
              if (array[index + 1]) {
                categoryList += item + "/"
              } else {
                categoryList += item
              }
            })
          }
          levelIVCopy.pCategoryId=categoryList
        }else{
          let categoryList=""
          levelIVCopy=JSON.parse(JSON.stringify(this.levelIV))
          if(levelIVCopy.pCategoryId &&levelIVCopy.pCategoryId.length>0&&typeof levelIVCopy.pCategoryId!="string") {
            levelIVCopy.pCategoryId.forEach((item, index, array) => {
              if (array[index + 1]) {
                categoryList += item + "/"
              } else {
                categoryList += item
              }
            })
          }
          levelIVCopy.pCategoryId=categoryList
        }
        PostData('parts/selectAllByEnabled',levelIVCopy)
          .then(res=>{
            let middleList=res.list
            this.total=res.total
            if(middleList&&middleList.length>0){
              middleList.forEach(value => {
                value.odRetailPrice=this.customerPrince===0?value.pLowPrice:this.customerPrince===1?value.pMiddlePrice:value.pHighPrice
              })
            }
            this.list=middleList
            this.wholeList=[]
          })
      }
      else {
        PostData('/whole/selectAllByLike', this.levelIV).then(res => {
          this.wholeList=res.list
          this.total=res.total
          this.list=[]
        })
      }
    },
    //初始数据
    getList(){
      levelIVDirectory().then(res=>{
        this.levelIVDirectoryList=res
      })
    },
    //该客户推荐价格
    getPrice(){
      let query={
        cuId:this.$route.query.oCustomerId
      }
      PostData('/customer/selectAllByLike',query).then(res=>{
        switch (res.list[0].cuDiscount){
          case "一级价格":
            this.customerPrince=0
            break;
          case "二级价格":
            this.customerPrince=1
            break;
          case "三级价格":
            this.customerPrince=2
            break;
        }
      })
    },
    //价格输入限制
    oninput(value) {
      let str = value;
      let len1 = str.substr(0, 1);
      let len2 = str.substr(1, 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
      }
      //第一位不能是.
      if (len1 == ".") {
        str = "";
      }
      if (len1 == "+") {
        str = "";
      }
      if (len1 == "-") {
        str = "";
      }

      //限制只能输入一个小数点
      if (str.indexOf(".") != -1) {
        let str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      //正则替换
      str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
      str = str.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, "$1"); // 小数点后只能输 2 位
      return str;
    }
  }
}
</script>
<style scoped>
.dialog-footer{
  padding: 0px;
  margin-bottom: 20px;
}
.demo-table-expand {
  border-top: 1px solid #000000;
  border-left:1px solid #000000;
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.el-image__inner{
  width: 200px;
  height: 200px;
}
.demo-table-expand .el-form-item {
  border-bottom: 1px solid #000000;
  border-right:1px solid #000000;
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
