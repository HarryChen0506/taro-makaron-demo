// 配置文件
export const ENV:string = 'dev'  // 'dev' 测试
// export const ENV = 'prod'  // 'prod' 生产
export const appId:string = 'wxcfe56965f4d986f0'
export const appConfig:object = {
  image_oss_postfix: '?x-oss-process=image/resize,h_748,w_560',
}
export default {
  ENV,
  appId: appId,
  appConfig: appConfig
}