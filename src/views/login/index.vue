<template>
  <div class="login-container">
    <div class="background">
      <img src="../../assets/background/qipeibeijing.jpg" width="100%" height="100%" alt="图片无法显示" />
    </div>
    <el-form ref="loginForm" :model="loginForm"  class="login-form" autocomplete="on" label-position="left" >
      <div class="title-container">
        <h3 class="title">汽配进销存</h3>
      </div>
      <el-tabs
        v-model="activeName" @tab-click="handleClick" type="border-card" class="tabs"
        >
      <el-tab-pane label="密码登录" name="first" :key="'first'">
      <processed v-if="isFirst"/>
<!--      <el-tab-pane key="tab1" tab="账号密码登陆">-->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="aUsername"
          v-model="loginForm.aUsername"
          placeholder="请输入用户名"
          name="aUsername"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="aPassword"
            v-model="loginForm.aPassword"
            :type="passwordType"
            placeholder="请输入密码"
            name="aPassword"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      </el-tab-pane>
<!--      <el-tab-pane key="tab2" tab="手机号登陆">-->
        <el-tab-pane label="短信登录" name="second" :key="'second'">
          <un-processed v-if="isSecond"/>
          <el-form-item prop="mobile">
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
            <el-input ref="mobile" v-model="loginForm.mobile" placeholder="请输入手机号" name="mobile" type="text" tabindex="1" auto-complete="on"/>
          </el-form-item>
          <el-form-item prop="code">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
            <el-input ref="code" v-model="loginForm.code" type="text" placeholder="请输入验证码" name="code" abindex="2" maxlength="6" auto-complete="on" @keyup.enter.native="handleLogin" />
            <span class="show-pwd">
                  <el-button :loading="sending" :disabled="sendDisabled" size="small" @click="onSendSms">{{sendButtonText}}</el-button>
                </span>
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>


  </div>
</template>

<script>

// import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import Cookie from "js-cookie";
import {PostData} from "@/api";
import {mapGetters} from "vuex";
//import {PostData} from "../../api/index";
//import {PostData} from "../../api/index";

export default {
  name: 'Login',
  components: { SocialSign },
  data() {

    return {
      imgSrc:'@/assets/background/qipeibeijing.jpg',
      activeName: 'first',
      personQuery:{
        aUsername:null,
        pageNum: 0,
        pageSize: 0,
      },
      info:{},
      isFirst: true,
      isSecond: false ,
      loginForm: {
        aUsername: '',
        aPassword: '',
        mobile: "",// 手机号
        code: ""// 验证码
      },
     // loginRules: {
     //   username: [{ required: true, trigger: 'blur', validator: validateUsername }],
     //   password: [{ required: true, trigger: 'blur', validator: validatePassword }]
    //  },

      capsTooltip: false,
      showDialog: false,
      otherQuery: {},
      cur:true,//true代表密码, false代表短信
      sending: false,
      sendDisabled: false,
      loading: false,
      timer: 0,
      passwordType: 'password',

    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.aUsername === '') {
      this.$refs.aUsername.focus()
    } else if (this.loginForm.aPassword === '') {
      this.$refs.aPassword.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },

  computed: {
    sendButtonText() {
      if (this.timer === 0) {
        return "发送验证码";
      } else {
        return `${this.timer}秒后重发`;
      }
    },

  },

  methods: {
    // getPermission() {
    //   this.personQuery.aUsername=this.loginForm.aUsername
    //   PostData('/admin/selectAllByLike',this.personQuery)
    //     .then(res=>{
    //       Cookie.set('aPermission',res[0].aPermission)
    //     }).catch(err=>{
    //     this.$message.error(err.message);
    //     console.log(err);
    //   })
    // },

  onSendSms() {
      this.loginWay = false;
      this.$refs.loginForm.validateField("mobile", err => {
        if (!err) {
          this.sending = true;
          const { mobile } = this.loginForm;
          sendSms({ mobile })
            .then(() => {
              this.$message.success("短信发送成功，请注意查收");
              Cookie.set("last-send-time", new Date());
              this.timer = 60;
            })
            .catch(e => {
              this.$message.error("网络异常");
              console.log(e);
            })
            .finally(() => (this.sending = false));
        }
      });
    },

    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.aPassword.focus()
      })
    },
    handleLogin() {
      // this.getPermission()
      // alert()
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          Cookie.set('username',this.loginForm.aUsername)
          this.loading = true
          //PostData('/admin/login',this.param).then(res=>{
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handleClick(tab) {
      if (tab.name === 'first') {
        this.isFirst = true
        this.isSecond = false }
      else if (tab.name === 'second') {
        this.isFirst = false
        this.isSecond = true } } }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }

}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.background{
  width:100%;
  height:100%;  /**宽高100%是为了图片铺满屏幕 */
  position: absolute;
}
/* reset element-ui css */
.login-container {

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss">
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  background-color: white;
  //background: url("../../assets/partimage/background1.png") no-repeat;
  //background-size: cover;
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #1f2d3d;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  .active{
    color:#fff;
    padding-bottom: 10px;
    border-bottom: 3px solid #fff;
  }
  //.tabs{
  //  display: flex;
  //  background-color: #cee4ed;
  //}

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
