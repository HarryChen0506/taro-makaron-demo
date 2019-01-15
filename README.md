
## 手把手教你用Taro框架写一个图像处理类微信小程序
### 前言

年中的时候，笔者所在的公司让我们开发一款微信小程序（马卡龙玩图）。主要的玩法就是让用户上传一张人像照片，图片经过后端的AI算法处理后识别出人物，将人物和周围环境进行分割（即抠图）；前端将返回的抠像进行样式处理，包括设置大小位置旋转等；通过预设（或自定义上传）的一些主题场景以及点缀的贴纸或滤镜，用户对这些元素进行移动或缩放，可以衍生出很多好玩的修图玩法，比如更换动态背景，合成带有音频的动态视频等（可以扫一下文末的微信二维码进行体验）。

![演示](https://user-gold-cdn.xitu.io/2019/1/15/16850f0e2e212c2b?w=541&h=996&f=gif&s=3480524)

开发初期，当时可选的成熟的微信小程序框架只有wepy，经过开发实践发现，wepy在多层嵌套列表渲染，组件化支持等方面体验不是很友好。后面美团的技术团队开源了一款基于vue的小程序框架，经过体验后感觉，虽然在组件化上体验和vue别无差距，但是在性能上并不占优势。

直到某天有位朋友拉我进了一个Taro的开发群，原来京东的前端团队也在开发一款基于React规范的小程序框架，由于当时笔者担心Taro尚处早期，功能上也许不足抑或bug，迟迟没有入手。直到最近更新到1.2.4的版本，群里有道友不吝溢美之词进行了一波安利，所以笔者决定对项目的部分模块进行了重构，发现Taro确实在开发体验和性能上都得到了非常好的提高，在此向taro的贡献者致以崇高的敬意。本着开源的精神，笔者也将此次重构的demo源码以及心得体会和大家一起分享。欢迎去我的github项目下点个赞哈。

### 需求分析
![需求分析](https://user-gold-cdn.xitu.io/2019/1/15/1685057df9113e43)
用户上传的人像经过抠图处理后，将展示在作图区，同时展示的元素还有背景图片，可动或固定的贴纸。为了获取更好的用户视觉体验，每个场景下，通过预设人像和贴纸的大小和位置（参数为作图区域的百分比等）。人像和贴纸需支持单指和双指手势操作来改变大小和位置等样式，因此可以将人像和贴纸都封装为Sticker的组件，子组件Sticker向页面父组件传递手势操作变更后的样式参数，触发父组件setState来刷新,最终通过传递props到子组件来控制样式。

关于Sticker组件的一些细节还包括：贴纸组件具有激活状态（点击当前组件显示控制器，而其他组件则隐藏）；切换场景后，要缓存之前用户的操作，当切回到原先的场景时，则恢复到该场景下用户最后的操作状态。

用户点击保存后，将作图区的所有元素按照层级大小进行排序，然后通过canvas进行绘制，最终返回所见即所得的美照。

### 准备工作
根据Taro的文档，安装CLI工具以及创建项目模板，建议选择Typescript开发方式。


### 项目目录
简要分析下项目结构
```
Taro-makaron-demo
├── dist                   编译结果目录
├── config                 配置目录
|   ├── dev.js             开发时配置
|   ├── index.js           默认配置
|   └── prod.js            打包时配置
├── src                    源码目录
|   ├── assets             静态资源
|   |   ├── images         图片
|   ├── components         组件
|   |   ├── Sticker        贴纸组件
|   |   ├── ...            其他组件
|   ├── model              Redux数据流
|   |   ├── actions        
|   |   ├── constants        
|   |   ├── reducers        
|   |   ├── store        
|   ├── pages              页面文件目录
|   |   ├── home           首页
|   |   |   ├── index.js   index 页面逻辑
|   |   |   └── index.css  index 页面样式
|   |   ├── dynamic        作图页
|   |   |   ├── index.js   index 页面逻辑
|   |   |   └── index.css  index 页面样式
|   ├── services           服务
|   |   ├── config.ts      全局配置
|   |   ├── api.config.ts  api接口配置
|   |   ├── http.ts        封装的http服务
|   |   ├── global_data.ts 全局对象
|   |   ├── cache.ts       缓存服务
|   |   ├── session.ts     会话服务
|   |   ├── service.ts     基础服务或业务服务
|   ├── utils              公共方法
|   |   ├── tool.ts        工具函数
|   ├── app.css            项目总通用样式
|   └── app.js             项目入口文件
└── package.json
```
### 核心代码分析

- sticker贴纸组件

贴纸组件相较其他展示型组件，涉及手势操作，大小位置计算等，所以稍显复杂。
``` 
// 使用
class Page extends Component {
    state = {
        foreground: { // 人像state
          id: 'foreground', // id
          remoteUrl: '', // url
          zIndex:2, // 层级
          width:0, // 宽
          height:0, // 高
          x: 0, // x轴偏移量
          y:0, // y轴偏移量
          rotate: 0, // 旋转角度
          originWidth: 0, // 原始宽度
          originHeight: 0, // 原始高度
          autoWidth: 0, // 自适应后的宽度
          autoHeight: 0, // 自适应后的高度
          autoScale: 0, // 相对画框缩放比例
          fixed: false, // 是否固定
          isActive: true, // 是否激活
          visible: true, // 是否显示
        }
    }
    render () {
        reuturn <Sticker 
                    ref="foreground"
                    url={foreground.remoteUrl}
                    stylePrams={foreground}                
                    framePrams={frame}
                    onChangeStyle={this.handleChangeStyle}
                    onImageLoaded={this.handleForegroundLoaded}
                    onTouchstart={this.handleForegroundTouchstart}
                    onTouchend={this.handleForegroundTouchend}
              />
    }
}

// 组件定义
class Sticker extends Component {
...
    render() {
        const { url, stylePrams } = this.props
        const { framePrams } = this.state
        const styleObj = this.formatStyle(this.props.stylePrams)
        return (
          <View 
            className={`sticker-wrap ${stylePrams.fixed ? 'event-through' : ''} ${(stylePrams.visible && stylePrams.width > 0) ? '' : 'hidden' }`}
            style={styleObj}
          > 
            <Image 
              src={url} 
              mode="widthFix" 
              style="width:100%;height:100%"
              onLoad={this.handleImageLoaded} // 图片加载后将原始尺寸信息通知给父组件
              onTouchstart={this.stickerOntouchstart} 
              onTouchmove={this.throttledStickerOntouchmove} // touchmove比较频繁，需要节留
              onTouchend={this.stickerOntouchend}/>
            <View className={`border ${stylePrams.isActive ? 'active' : ''}`}></View>
            <View className={`control ${stylePrams.isActive ? 'active' : ''}`}
              onTouchstart={this.arrowOntouchstart} 
              onTouchmove={this.throttledArrowOntouchmove}
              onTouchend={this.arrowOntouchend}
            >
              <Image src={scale} mode="widthFix" style="width:50%;height:50%"/>
            </View>
          </View>
        )
    }
}

```
- 缓存服务
缓存服务对提高性能非常有帮助，比如canvas绘图需要图片是本地图片，可以通过数据字典的方式将图片的远程地址和下载到本地的地址进行一一对应，节省了大量的网络资源和时间
```
// services/cache.ts 缓存服务
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
      this[v] = null
    })
  }
}

export const createCache = (name:string) => {
  return new Cache(name)
}
// 使用
import {createCache} from '../../services/cache'
class Page extends Component {
  cache = {
    source: createCache('source'),
  }
  // 下载照片并存储到本地
  downloadRemoteImage = async (remoteUrl = '') => {
    const cacheKey = `${remoteUrl}_localPath`
    const cache_source = this.cache['source']
    let localImagePath = ''
    if (cache_source.get(cacheKey)) {
      // 有缓存
      return cache_source.get(cacheKey)
    } else {
      try {
        const result = await service.base.downloadFile(remoteUrl)
        localImagePath = result.tempFilePath
      } catch (err) {
        console.log('下载图片失败', err)
      }
    }
    return cache_source.set(cacheKey, localImagePath)
  }
}

```
### 性能优化
1. 避免频繁setState

由于微信小程序逻辑层和视图层各自独立，两边的数据传输是靠转换后的字符串。因此当setData频率过快，内容庞大时，会导致阻塞。由于本项目又涉及很多的手势操作，touchmove事件的频率很快，所以项目早期时候，在安卓系统下卡顿十分明显。

优化方式有：通过做函数节流，降低setData频次；将页面无关的数据不要绑定到data上，而是绑定到组件实例上（牺牲运算效率换取空间效率）。

使用微信的自定义组件，也是一个很大的提升因素，个人认猜测可能是自定义组件内部data的改变不会导致其他组件或页面的data更新。项目早期采用的是wepy框架，由于历史局限性（当时微信还未公布自定义组件方案），所以效率问题一直很是头疼。好在Taro框架通过编译的方式完美的支持了这个方案。

2. 归并setState

例如，当图片加载，获取到原始尺寸后，需要计算出该图片在当前场景下的预设尺寸和位置。必须先计算出自适应后的宽高，然后才能计算出预设的偏移量。因此可以将尺寸和位置参数都计算完毕后，再调用setState更新视图，这样不仅降低了频次，同时也解决了图片闪烁的bug.

3. 利用缓存

前面有提到过利用缓存模块来存储组件状态或资源信息，在此不再赘述。

### 心得
Taro框架采取的是一种编译的方式，将源代码分别编译出可以在不同端（微信/百度/支付宝/字节跳动小程序、H5、React-Native 等），因此可以在性能上与各个平台保持一致。

而mpvue的方案则是修改vue的runtime，将vue 实例与小程序 Page 实例建立关联以及生命周期的绑定。个人感觉上，这种通过映射的方式可能会导致通信效率上的降低，并且vue和微信又各自独立迭代，后期的协调也越来越费劲，所以还是Taro的方案略胜一筹，个人浅见，还请亲喷。

### 写在最后
- Github

   欢迎大家来这个demo项目下进行交流，[项目地址](https://github.com/HarryChen0506/taro-makaron-demo)，你的点赞将是我莫大的动力😊
- 线上项目

本demo项目的线上小程序可通过微信扫描下面的二维码前往体验👏 ![马卡龙玩图](https://user-gold-cdn.xitu.io/2019/1/15/16850cb1b039bba0?w=135&h=135&f=png&s=22173)
