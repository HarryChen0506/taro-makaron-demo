import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './index.less'
import loading from '../../../assets/images/pic_loading.png'
import icon_music_gif from '../../../assets/images/icon_music_gif.png'
import icon_only_gif from '../../../assets/images/icon_only_gif.png'

type ComponentStateProps = {}

type ComponentOwnProps = {
  onClick?: () => void,
  bgUrl: string,
  thumbnailUrl: string,
  sceneName: string,
  active: boolean
}

type ComponentState = {}

type IProps = ComponentStateProps & ComponentOwnProps

interface SceneItem {
  props: IProps;
}

class SceneItem extends Component {
  static defaultProps = {
    bgUrl: loading,
    thumbnailUrl: loading,
    sceneName: '',
    active: false
  }
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }
  render() {
    const { onClick, active, thumbnailUrl, bgUrl, sceneName } = this.props
    return (
      <View className="scene-item" onClick={onClick}>
        <Image
          className="music-icon"
          src={icon_music_gif}
          mode="widthFix"
        /> 
        <View className="bg">
          <Image
            src={bgUrl}
            style="position:absolute;width:100%;height:100%;opacity:0"
          />              
          <Image className="thumbnai"
            src={thumbnailUrl}
            style="width:100%;height:100%"
          />                
        </View>                              
        <View className="tag">
          {active && <Text className="icon"></Text>}
          <Text className="tag-title">{sceneName}</Text>
        </View>
      </View>   
    )
  }
}

export default SceneItem as ComponentClass<ComponentOwnProps, ComponentState>