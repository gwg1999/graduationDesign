const dev = {
  baseUrl: "http://www.aishuhong.com:11531/api",
  // baseUrl: "http://ip地址:9001/api",
  // cdnUrl:"开发环境的cdn地址",
};

const uat = {
  baseUrl: "http://www.aishuhong.com:11531/api",
  // cdnUrl:"测试环境cdn地址"
};

const prod = {
  baseUrl: "http://www.aishuhong.com:11530",
  // cdnUrl:"生产环境cdn地址"
};

let type = {}
if(process.env.VUE_APP_FLAG === "development"){ // 必须与创建的配置文件第二行的名字相对应
  type =  dev
}else if(process.env.VUE_APP_FLAG === "test"){ // 必须与创建的配置文件第二行的名字相对应
  type =  uat
}else if(process.env.VUE_APP_FLAG === "production"){ // 必须与创建的配置文件第二行的名字相对应
  type =  prod
}
export default type
