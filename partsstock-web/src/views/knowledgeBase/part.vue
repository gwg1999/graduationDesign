<template>
  <div class="app-container" style="background: white;">
    <!--查询表单-->
<!--    <el-form :inline="true" class="demo-form-inline" style="position: relative">-->
<!--      <template slot-scope="scoped">-->
<!--        <el-form-item>-->
          <!--          <el-input v-model="factoryQuery.fName" clearable placeholder="厂家名"  style="width: 150px"/>-->
    <div style="padding-bottom: 18px">
      <el-input v-model="knowQuery.KNumber" placeholder="请输入零件号" style="width: 15%" class="search" clearable></el-input>
      <el-autocomplete
        v-model="knowQuery.kName"
        :fetch-suggestions="querySearch"
        placeholder="请输入零件名"
        :trigger-on-focus="false"
        @select="handleSelect"
        class="search"
        clearable
        style="width: 260px"
      >
        <!--      <i-->
        <!--        class="el-icon-edit el-input__icon"-->
        <!--        slot="suffix"-->
        <!--        @click="handleIconClick">-->
        <!--      </i>-->
        <template slot-scope="{ item }">
          <div>{{ item.kName }}</div>
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
        v-model="kCategoryList"
        class="search"
        clearable>
        <template slot-scope="{ node, data }">
          <span>{{ data.name }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader>
      <!--        </el-form-item>-->
      <el-button type="primary" icon="el-icon-search" @click="search">查 询</el-button>


      <el-button type="primary" icon="el-icon-circle-plus"  style="position: absolute;right: 30px" @click="openAdd">添加</el-button>
    </div>

<!--      </template>-->
<!--    </el-form>-->
    <el-dialog
      :title=title
      :visible.sync="partDialogVisible"
      width="90%"
      :before-close="handleClose">
      <div>
        <el-form  ref="knowledge" :model="knowledge" label-width="120px" :rules="rules">
          <div style="display: flex;justify-content: space-around">
            <div>
              <el-form-item label="零件类目名" prop="kCategoryName">
                <el-cascader
                  ref="pCatCascader"
                  :options="categoryOption"
                  :props="{value:'name', label:'name'}"
                  @change="handlePcateChange(knowledge.kCategoryName)"
                  :show-all-levels="false"
                  v-model="knowledge.kCategoryName"
                  clearable>
                  <template slot-scope="{ node, data }">
                    <span>{{ data.name }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                  </template>
                </el-cascader>
              </el-form-item>
              <el-form-item label="零件名" prop="kName">
                <el-input v-model="knowledge.kName" style="width: 260px"/>
              </el-form-item>
              <el-form-item label="零件号" prop="kNumber">
                <el-input v-model="knowledge.kNumber" style="width: 200px"/>
              </el-form-item>
              <el-form-item label="上传图片" prop="picture">
                <el-upload
                  ref="inDownload"
                  :action="baseURL+'/upload/uploadKnowledgeImage?'+inPicturePar"
                  class="upload-demo"
                  accept="image/png,image/gif,image/jpg,image/jpeg"
                  list-type="picture"
                  :auto-upload="false"
                  :limit=limitNum
                  :before-upload="handleBeforeUpload"
                  :on-preview="handlePictureCardPreview"
                  >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只支持格式为png,gif,jpg,jpeg的图片,且小于2MB</div>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </el-upload>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="产地名" prop="kPlaceId">
                <el-select
                  v-model="knowledge.kPlaceId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入产地或品牌"
                  :remote-method="remotePlace"
                   @focus.once="getIntroList">
                  <el-option
                    v-for="item in placeList"
                    :key="item.plId"
                    :label="item.plName"
                    :value="item.plId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单位" prop="kUnitId">
                <el-select
                  v-model="knowledge.kUnitId"
                  placeholder="请输入单位">
                  <el-option
                    v-for="item in unitList"
                    :key="item.uId"
                    :label="item.uName"
                    :value="item.uId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注信息" prop="kNote">
                <el-input v-model="knowledge.kNote" style="width: 200px" type="textarea"/>
              </el-form-item>
              <el-form-item label="其他信息" prop="kOtherModel">
                <el-input v-model="knowledge.kOtherModel" style="width: 200px" type="textarea"/>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="partDialogVisible = false">取 消</el-button>
    <el-button type="primary" :disabled='isEnable' @click="submitForm('knowledge')">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table
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
          {{ (knowQuery.pageNum - 1) * knowQuery.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!--      <el-table-column prop="cBrandId" label="车品牌ID" width="100%"  align="center"/>-->
      <el-table-column prop="kName" label="零件名" width="200"  align="center"/>
      <!--      <el-table-column prop="cFactoryId" label="车工场ID" width="100%"  align="center"/>-->
      <!--      <el-table-column prop="cFactoryName" label="车工厂名" width="120%" align="center" />-->
      <!--      <el-table-column prop="cModelId" label="车模型ID" width="120%" align="center"/>-->
      <el-table-column prop="kNumber" label="零件号" width="200"  align="center"/>
      <!--      <el-table-column prop="cPrice" label="车价格" width="80%"  align="center"/>-->
      <!--      <el-table-column prop="cStatus" label="车状态" width="110%" align="center"/>-->
      <!--      <el-table-column prop="cTypeId" label="车类型ID" width="130%" align="center"/>-->
      <el-table-column prop="kCategoryName" label="零件类目名" width="260"  align="center"/>
      <el-table-column prop="place.plName" label="产地名" width="100%"  align="center"/>
      <el-table-column prop="unit.uName" label="单位" width="60%"  align="center"/>
      <el-table-column prop="kPicture" label="图片" width="200" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            alt="无"
            :src="scope.row.kPicture" :preview-src-list="srcList(scope.row.kPicture)"
          >
          </el-image>
        </template>
      </el-table-column>
<!--      <el-table-column prop="kOtherModel" label="对应其他型号" width="200"  align="center"/>-->
      <!--      <el-table-column prop="cuDiscount" label="默认折扣" width="50%" align="center" />-->
      <!--      <el-table-column prop="cuDefaultPayment" label="默认支付方式" width="80%"  align="center"/>-->
      <!--      <el-table-column prop="cuName" label="联系人姓名" width="100%" align="center" />-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetails(scope.row)">查看详情</el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deletePart(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total, prev, pager, next, jumper"
      :page-size="knowQuery.pageSize"
      :current-page="knowQuery.pageNum"
      :total="pageTotal"
      style="padding: 30px 0; text-align: right;"
      @current-change="handlePageChange"
    />
  </div>
</template>
<script>
import {GetData, PostData} from "../../api/index"
import qs from 'qs'
import {baseURL} from '@/api/http'
export default {
  name: "list",
  data() {//定义变量和初始值
    return {
      knowledge: {
        kName:'',
        kNumber:''
      },
      title: '',
      pCateQuery: {
        status: 1,
        type: 2
      },
      baseURL:baseURL,
      unitQuery: {
        pageSize: 0,
        pageNum: 0,
        uName: ''
      },
      placeList:[],
      placeQuery:{
        pageSize: 10,
        pageNum: 1,
        plName:''
      },
      pGoodsNum:'',
      dialogImageUrl:'',
      categoryOption: [],
      pCategoryList: [],
      kCategoryList:[],
      unitList: [],
      isEnable: false,
      limitNum:1,
      imageUrl: '',
      list: [], //查询之后接口返回集合
      state: '',//模糊查询后返回的值
      total: 0,//总记录数
      knowQuery: {
        pageSize: 10,
        pageNum: 1,
      },
      inPicPar: {
        kId: -1
      },
      introQuery:{},
      deleteQuery:{},
      dialogVisible: false,
      partDialogVisible:false,
      selectCondition: {},
      pageTotal: 0,
      rules: {
        kName: [
          {required: true, message: "请输入零件名", trigger: "blur"}
        ],
        kNumber: [
          {required: true, message: "请输入零件号", trigger: "blur"}
        ],
        kCategoryName: [
          {required: true, message: "请选择零件类目", trigger: "blur"}
        ],
        // kPlaceId:[
        //   {required: true, message: "产地名不能为空", trigger: "blur"}
        // ],
        kUnitId:[
          {required: true, message: "单位不能为空", trigger: "blur"}
        ]
      }
    }
  },
  created() {//页面渲染之前执行，一般调用methods中定义的方法
    this.getList()
    this.getPCate()
    this.getUnitList()
    // this.getPageTotal()
  },
  resetData() {
    this.getList()
    this.getPageTotal()
  },
  computed: {
    inPicturePar() {
      return qs.stringify(this.inPicPar)
    },
    srcList(){
      return (value)=>{
        return [value]
      }
    }
  },
  methods: {//创建具体的方法
    getList() {
      PostData('/knowledge/selectAllByLike', qs.stringify(this.knowQuery))
        .then(res => {
          console.log(res.list);
          this.list = res.list
          this.pageTotal = res.total
        }).catch(err => {
        this.$message.error(err.message);
        console.log(err);
      })
    },
    handleChange(value) {
      this.parts.pCarName=value.join("/")
      console.log(this.parts.pCarName);
    },
    deletePart(data){
      console.log(data);
      this.deleteQuery.kId=data.kId
      console.log(this.deleteQuery);
      PostData('/knowledge/delete',this.deleteQuery).then(ref=>{
        this.$message({
          type:"success",
          message:'删除成功'
        })
        this.search()
      })
    },
    remotePlace(query){
      if (query!=='') {
        this.loading = true;
        this.getPlaceList(query)
      } else {
        this.placeList=[]
      }
    },
    getPlaceList(queryString){
      this.placeQuery.plName = queryString;
      PostData('place/selectAllByLike',qs.stringify(this.placeQuery))
        .then(res =>{
          this.placeList=res.list
          this.loading=false
        })
    },
    getUnitList() {
      PostData('unit/selectAll', qs.stringify(this.unitQuery))
        .then(res => {
          this.unitList = res.list
          console.log(this.unitList);
        })
    },
    getIntroList(){
      PostData('/parts/selectHighFive',this.introQuery).then(ref=>{
        console.log('9999999999');
        console.log(ref);
        this.placeList=ref.places
      })
    },
    handlePcateChange(value) {
      console.log(value);
      this.knowledge.kName = value[value.length - 1]
    },
    getPCate() {
      PostData('/position/selectCatalogue', qs.stringify(this.pCateQuery)).then((ref) => {
        this.categoryOption = this.getTreeData(ref)
        console.log(this.categoryOption);
      })
    },
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
    openAdd() {
      this.knowledge = Object.assign({},{
        kName:'',
        kNumber:''
      })
      this.title='添加零件'
      this.partDialogVisible = true
      // this.$refs['factory'].resetFields()

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toInsert() {
      this.$router.push('/maintain/factory/addFactory')
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },

    //分页处理
    handlePageChange(val) {
      this.knowQuery.pageNum = val
      this.getList()
    },
    search() {
      // this.factoryQuery.pageNum = 1
      this.knowQuery.KCategoryName=this.kCategoryList.join("/")
      this.knowQuery.pageNum=1
      console.log(this.knowQuery);
      this.getList()
      // this.getPageTotal()
      // alert(111)
    },
    //跳转详情页
    showDetails(data) {
      console.log(data);
      this.inPicPar.kId=data.kId
      console.log(888);
      console.log(data);
      this.knowledge = Object.assign({}, data)
      this.knowledge.kCategoryName=this.knowledge.kCategoryName.split("/")
      this.title = '修改零件信息'
      this.partDialogVisible = true
      // localStorage.setItem('fId',this.list[index].fId)
      // this.$router.push('/maintain/factory/editFactory')
    },
    querySearch(queryString, cb) {
      this.knowQuery.kName = queryString;
      this.knowQuery.pageNum = 1
      PostData('/knowledge/selectAllByLike', qs.stringify(this.knowQuery)).then(ref => {
        console.log(ref.list);
        cb(ref.list)
      })
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(item) {
      this.knowQuery.kName = item.kName
    },
    enable() {
      setTimeout(() => {
        this.isEnable = false
      }, 500)
    },
    handleBeforeUpload(file){
      console.log('before')
      if(!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片'
        })
      }
      let size = file.size / 1024 / 1024 / 2
      if(size > 2) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于2M'
        })
      }
      return size<=2
    },
    // 文件超出个数限制时的钩子
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs.knowledge.validate((valid) => {
        if (valid) {
          console.log(this.knowledge);
          this.isEnable = true
          if (this.knowledge.kId) {
            this.knowledge.kCategoryName=this.knowledge.kCategoryName.join("/")
            this.knowledge.kCreateTime = undefined
            this.$refs.inDownload.submit()
            PostData('/knowledge/update', this.knowledge)
              .then(res => {
                console.log(res);
                if (res.code === 500) {
                  this.$message({
                    type: 'warning',
                    message: res.cause
                  })
                  this.enable()
                } else {
                  this.partDialogVisible = false
                  this.enable()
                  setTimeout(()=>{
                    this.getList()
                    this.$message({
                      type: 'success',
                      message: '修改成功'
                    })
                  },500)

                }
              }).catch(() => {
            })
          } else {
            this.isEnable = true
            console.log(this.knowledge);
            this.knowledge.kCategoryName=this.knowledge.kCategoryName.join("/")
            PostData('/knowledge/insert', this.knowledge)
              .then(res => {
                console.log(res);
                if (res.code === 500) {
                  this.$message({
                    type: 'warning',
                    message: res.cause
                  })
                  this.enable()
                } else {
                  this.inPicPar.kId=res.data
                  this.partDialogVisible = false
                  this.enable()
                  setTimeout(()=>{
                    this.$refs.inDownload.submit()
                    this.getList()
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    })
                  },500)
                }
              }).catch(() => {
            })
          }
        } else {
          alert('请输入正确的信息');
          return false;
        }
      });
    },
  }
}
</script>
<style scoped>
.demo-table-expand {
  border-top: 1px solid #000000;
  border-left:1px solid #000000;
  border-right:1px solid #000000;
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  border-bottom: 1px solid #000000;
  border-right:1px solid #000000;
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.search{
  margin-right: 3px
}
</style>
