// 缓存服务
function Cache (name) {
  this.name = name
}
Cache.prototype = {
  set: function (key, value) {
    this[key] = value
    return this[key]
  },
  get: function (key) {
    return this[key]
  },
  clear: function () {
    // 清空
    Object.keys(this).forEach(v => {
      this[v] = undefined
    })
  }
}

export const createCache = (name:string) => {
  return new Cache(name)
}

export const cacheCover = new Cache('cover')
export default {
  createCache,
  cacheCover
}