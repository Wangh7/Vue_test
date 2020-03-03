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
