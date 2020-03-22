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
