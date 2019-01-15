// session管理
import Taro from '@tarojs/taro'
import service from './service'
import config from './config'

const Session = {
  storageKey: 'session',
  headerKey: 'sessionId',
  get () {
    return Taro.getStorageSync(this.storageKey)
  },
  async set () {
    const loginInfo = await Taro.login()
    const {appId} = config
    const {code} = loginInfo
    try {
      const data = await service.base.auth({
        code, appId
      })
      const {statusCode, result} = data
      if (statusCode === 200 && result.responseCode === '0000') {
        Taro.setStorageSync(this.storageKey, result.result)
        return result.result
      } else {
        console.log('auth fail!(get sessionId)', data)
      }
    } catch (err) {
      console.log('auth fail!(get sessionId)', err)
    }
  },
  remove () {
    Taro.removeStorageSync(this.storageKey)
  }
}

export default Session