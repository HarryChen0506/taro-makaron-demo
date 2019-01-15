// host域名管理
import {ENV} from './config'
const host = {  
  miniapi: {
    dev: 'https://abc.xxx.com',
    prod: 'https://abc.xxx.com'
  },
  upload: {
    dev: 'https://abc.xxx.com',
    prod: 'https://abc.xxx.com'
  },
  download: {
    dev: 'https://abc.xxx.com',
    prod: 'https://abc.xxx.com'
  }
}

// 获取域名
function getHost (type = 'miniapi', ENV = 'dev') {
  return host[type][ENV]
}
export const api = {
  base: {
    uploadToken: `${getHost('miniapi', ENV)}/xxx`,
    upload: `${getHost('miniapi', ENV)}/xxx`,
    auth: `${getHost('miniapi', ENV)}/xxx`,
  },
  core: {
    segment: `${getHost('miniapi', ENV)}/xxx`,
    column: `${getHost('miniapi', ENV)}/xxx`
  }
}
export default {
  name: 'api-config',
  api,
}