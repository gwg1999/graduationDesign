export const validatePassCheck = (rule, value, callback) => {
  console.log(value)
  if (/\D/.test(value)) {
    callback(new Error('请输入数字类型'));
  } else {
    callback();
  }
}
export const twoPoint = (rule, value, callback) =>{
  var reg = /^-?\d{1,5}(?:\.\d{1,3})?$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入大于零小于十万不超过三位小数的数字'))
  }
}
