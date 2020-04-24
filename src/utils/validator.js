// 验证金额
export function isPriceVlidator (rule, value, callback) {
  const pattern = /^\d+\.?\d{0,2}$/
  if (value > 10000 || value < 50) {
    return callback(new Error('金额超出范围（50-10000）'))
  } else if (!pattern.test(value)) {
    return callback(new Error('小数点后最多只能输入两位'))
  } else {
    return callback()
  }
}

// 验证用户名
export function isUsername (rule, value, callback) {
  const pattern = /^[_a-zA-Z0-9]{1,10}$/
  if (!pattern.test(value)) {
    return callback(new Error('用户名不符合要求(不超过10位由字母、数字和下划线组成)'))
  } else {
    return callback()
  }
}

// 验证密码
export function isPassword (rule, value, callback) {
  const pattern = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,18}$/
  if (!pattern.test(value)) {
    return callback(new Error('密码不符合要求(6-18位由字母、数字和符号其中至少两种组成'))
  } else {
    return callback()
  }
}

// 验证手机
export function isPhone (rule, value, callback) {
  const pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  if (!pattern.test(value)) {
    return callback(new Error('电话号码格式不正确'))
  } else {
    return callback()
  }
}

// 验证日期
export function isDate (rule, value, callback) {
  let date = new Date()
  date.setDate(date.getDate() + 6)
  if (value < date) {
    return callback(new Error('剩余到期时间太短(应至少剩余7日)'))
  } else {
    return callback()
  }
}

// 验证卡号
export function isCardNum (rule, value, callback) {
  const pattern = /^([0-9a-zA-Z]){8,32}$/
  if (!pattern.test(value)) {
    return callback(new Error('卡号应由8-32位数字或字母组成'))
  } else {
    return callback()
  }
}
