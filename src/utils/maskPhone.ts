// 脱敏手机号/固话/短号
export const maskPhone = (phone?: string) => {
  if (!phone) return ''

  // 去掉可能的空格
  phone = phone.trim()

  // 如果是 11 位手机号（如 13812345678）
  if (/^\d{11}$/.test(phone)) {
    return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
  }

  // 如果是固话（如 029-12345678 或 02912345678）
  if (/^\d{3,4}-?\d{6,8}$/.test(phone)) {
    return phone.replace(/^(\d{3,4}-?)\d{2,4}/, '$1****')
  }

  // 如果是 5~8 位短号
  if (/^\d{5,8}$/.test(phone)) {
    return phone.replace(/^(\d{2})\d+/, '$1****')
  }

  // 其他不识别的格式直接返回原值
  return phone
}
