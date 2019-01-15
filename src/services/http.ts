// import qs from 'qs'
import tool from '../utils/tool'
import pathToRegexp from 'path-to-regexp'
import Taro from '@tarojs/taro'
import Session from '../services/session'

const fetch = (options) => {
  let {
    method = 'get',
    header = {},
    data,
    url,
    params, // params用来填充url, 如pathToRegexp.compile('/user/:id')({id: 123})
  } = options
  const cloneData = tool.deepClone(data)
  try {
    let domain = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domain] = url.match(/[a-zA-z]+:\/\/[^/]*/)
      url = url.slice(domain.length)
    }
    url = pathToRegexp.compile(url)(params)    
    url = domain + url
  } catch (e) {
    console.log('pathToRegexp error', e)
  }
  
  return Taro.request({
    url: url,
    data:cloneData,
    header: {
      'content-type': 'application/json',
      ...header
    },
    method: method.toUpperCase(),
  })
}

// 普通请求
export const commonRequest = (options) => {  
  return fetch(options)
  .then((response:any) => {  
    // console.log('request fetch', response)
    const { statusCode, data, errMsg } = response
    if (statusCode !== 200) {
      return Promise.reject({
        status: 'error',
        statusCode: statusCode,
        result: data,
        message: data.responseMsg || errMsg,
      })
    } else {
      if ( data.responseCode === '40001') {
        return Promise.reject({
          status: 'error',
          statusCode: statusCode,
          result: data,
          message: data.responseMsg || errMsg,
        })        
      } else {
        return Promise.resolve({
          status: 'success',
          statusCode: statusCode,
          result: data,
          message: data.responseMsg || '成功',
        })
      }  
    }     
  }).catch((error) => {
    // console.log('request catch', error)
    const {message, result} = error
    let msg
    let statusCode
    if (result && result instanceof Object) {
      statusCode = result.status || error.statusCode
      msg = result.message || message
    } else {
      statusCode = 600
      msg = message || 'Network Error'
    }
    /* eslint-disable */
    return Promise.reject({ status: 'error', statusCode, message: msg })
  })
}

// 定制请求
export const request = (options) => {  
  options = Object.assign({}, options)
  if (!options.data) {
    options.data = {}
  }
  const session = Session.get()
  options.data[Session.headerKey] = session
  options.data['deviceId'] = tool.getDeviceId()

  return fetch(options)
  .then(async (response:any) => {  
    const { statusCode, data, errMsg } = response
    if (statusCode !== 200) {
      return Promise.reject({
        status: 'error',
        statusCode: statusCode,
        result: data,
        message: data.responseMsg || errMsg,
      })
    } else {
      if ( data.responseCode === '40001') {
        return continueSessionRequest(options)
      } else {
        return Promise.resolve({
          status: 'success',
          statusCode: statusCode,
          result: data,
          message: data.responseMsg || '成功',
        })
      }  
    }     
  }).catch((error) => {
    const {message, result} = error
    let msg
    let statusCode
    if (result && result instanceof Object) {
      statusCode = result.status || error.statusCode
      msg = result.message || message
    } else {
      statusCode = 600
      msg = message || 'Network Error'
    }
    return Promise.reject({ status: 'error', statusCode, message: msg })
  })
}

// 续session请求
async function continueSessionRequest (options:object = {}) {  
  // 最多执行2次
  let rejectData = {}
  for (let i = 0; i < 2; i++) {
    Session.remove()
    const session = await Session.set()
    console.log('续session次数：' + i, session)
    options.data[Session.headerKey] = session
    let result = await fetch(options)
    const {data, statusCode} = result
    if (statusCode === 200 && data.responseCode !== '40001') {
      return Promise.resolve({
        status: 'success',
        statusCode: statusCode,
        result: data,
        message: data.responseMsg || '成功',
      })      
    }
    rejectData = {
      status: 'error',
      statusCode: statusCode,
      result: data,
      message: data.responseMsg,
    }
  }
  console.log('续session仍然失败！！！')
  return Promise.reject(rejectData)
}

export default {
  commonRequest,
  request
}