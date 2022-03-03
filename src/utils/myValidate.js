export function chinaIdentityValid(rule, value, callback) {
  if (!value) {
    return callback(new Error('员工身份证号不能为空'))
  }
  let city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  }
  if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
    callback(new Error('身份证号格式错误'))
  } else if (!city[value.substr(0, 2)]) {
    callback(new Error('身份证号格式错误'))
  } else {
    // 18位身份证需要验证最后一位校验位
    if (value.length === 18) {
      const code = value.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      let sum = 0
      let ai = 0
      let wi = 0
      for (let i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      if (parity[sum % 11].toString() !== code[17]) {
        callback(new Error())
      }
    }
  }
  callback()
}

export function bankAccountValid  (rule, value, callback) {
  const strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
  if (!value) {
    return callback(new Error('收款账户不能为空'))
  } else if (!Number.isInteger(+value)) {
    callback(new Error('银行卡号必须全为数字'))
  } else if (value.trim().length < 12 || value.trim().length > 19) {
    callback(new Error('银行卡号长度必须在12到19之间'))
  } else if (strBin.indexOf(value.substring(0, 2)) === -1) {
    callback(new Error('银行卡号开头6位不符合规范'))
  } else {
    callback()
  }
}

export function  checkPhone (rule, value, callback) {
  if (!value) {
    return callback(new Error('手机号不能为空'));
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    console.log(reg.test(value));
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号'));
    }
  }
}

export function renderTime(date) {
  var dates = new Date(date).toJSON();
  return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}


