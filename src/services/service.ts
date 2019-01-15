// http服务
import Taro from '@tarojs/taro'
import {commonRequest, request} from './http'
import { api } from './api.config'
import tool from '../utils/tool'

interface segmentData {
  clientType: string;
  timestamp: string;
  imageUrl: string;
  segmentType?: string;
}

export const base = {
  uploadToken: function () {    
    return request({
      url: api.base.uploadToken,
      method: 'GET',
      dataType: 'json',
      data: {
        clientType: 'mini-program',
        fileType: 'image',
        filename: 'image.jpeg'
      }
    })
  },
  async getUploadToken () {
    let token = Taro.getStorageSync('token')
    if (token && token.expire > Date.now()) {
      return token
    }
    try {
      const data = await base.uploadToken()
      token = data && data.result && data.result.result
      Taro.setStorageSync('token', token)
      return token
    } catch (err) {
      console.log('get uploadToken fail', err)
    }
  },
  async upload (localFilePath, type?:string) {
    // 上传图片
    let imageType = type || 'png'
    const token = await base.getUploadToken()
    const imgName = tool.createImgName(16)
    const prefix = token.prefix // 'upload/prod/image/'
    token.params.key = `${prefix}${imgName}.${imageType}`
    let {data} = await Taro.uploadFile({
      filePath: localFilePath,
      name: 'file',
      url: token.host,
      formData: token.params
    })
    if (typeof data === 'string') {
      try {
        let result = JSON.parse(data)
        result.host = 'https://static01.versa-ai.com/'
        result.url = result.host + result.picurl
        return result
      } catch (err) {
        console.log('upload image string parse to json fail !!!')
      }
    }
    return {
      host: '',
      picurl: '',
      url: ''
    }
  },
  auth (data) {
    return commonRequest({
      url: api.base.auth,
      method: 'POST',
      data: data
    })
  },
  downloadFile (url) {
    return Taro.downloadFile({url: url})
  }
}
export const core = {
  segment: function (remoteImgUrl, segmentType) {
    let postData:segmentData = {
      clientType: 'mini-program',
      timestamp: Date.now().toString(),
      imageUrl: remoteImgUrl,
    }
    if (segmentType !== undefined) {
      postData.segmentType = segmentType
    }
    return request({
      url: api.core.segment,
      method: 'POST',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: postData,
    })
  },
  column (data?:object) {
    return request({
      url: api.core.column,
      method: 'GET',
      data: data,
    })
  },
  segmentDemo: function (rawImgUrl, resImgUrl, time = 100) {
    console.log('分割图片：', rawImgUrl)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          result: resImgUrl
        })
      }, time)
    })
  }
}

export default {
  base,
  core
}
