import Taro from '@tarojs/taro'

/**
 * @description 深拷贝
 * @param {*} obj 目标对象
 * @return {*} 返回的深拷贝对象
 */
function deepClone (obj) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let objArray = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 如果obj的属性是对象，递归操作
        if (obj[key] && typeof obj[key] === 'object') {
          objArray[key] = deepClone(obj[key])
        } else {
          objArray[key] = obj[key]
        }
      }
    }
  }
  return objArray
}
// 角度计算
const getLen = function(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
const dot = function (v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}
const getAngle = function (v1, v2) {
  let mr = getLen(v1) * getLen(v2);
  if (mr === 0) return 0;
  let r = dot(v1, v2) / mr;
  if (r > 1) r = 1;
  return Math.acos(r);
}
const cross = function (v1, v2) {
  return v1.x * v2.y - v2.x * v1.y;
}
const getRotateAngle = function (v1, v2) {
  let angle = getAngle(v1, v2);
  if (cross(v1, v2) > 0) {
    angle *= -1;
  }
  return angle * 180 / Math.PI;
}
// 计算中心点坐标
const calcCenterPosition = (offsetX, offsetY, width, height) => {
  return {
    x: offsetX + 0.5 * width,
    y: offsetY + 0.5 * height
  }
}

const tool = {  
  uuid: function () { // 生产uuid
    const s:Array<any> = []
    const hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    const uuid = s.join('')
    return uuid
  },
  getDeviceId: function () {
    if (!Taro.getStorageSync('deviceId')) {
      Taro.setStorageSync('deviceId', this.uuid())
    }
    return Taro.getStorageSync('deviceId')
  },  
  createImgName: function (length = 32) {
    var s:Array<any> = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < length; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    return s.join('')
  },
  isEmpty: function (obj) {
    // 判断字符是否为空的方法
    if (typeof obj === 'undefined' || obj === null || obj === '') {
      return true
    }
    return false
  },
  isRepeat: function (arr) {
    var hash = {}
    for (var i in arr) {
      if (hash[arr[i]]) {
        return true
      }
      hash[arr[i]] = true
    }
    return false
  }, 
  deepClone: deepClone,
  getRotateAngle,
  calcCenterPosition,  
}

export default tool
