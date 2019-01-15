import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'

import './index.less'
import SceneItem from './SceneItem'
type ComponentStateProps = {}

type ComponentOwnProps = {
  onClick?: (item:object) => void,
  list: Array<object>,
  currentScene: object,
  styleObj: object
}

type ComponentState = {}

type IProps = ComponentStateProps & ComponentOwnProps

interface SceneList {
  props: IProps;
}

class SceneList extends Component {

  static defaultProps = {
    list: [],
    currentScene: {}
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }

  handleClick = (item) => {
    const { onClick } = this.props
    typeof onClick === 'function' && onClick(item)
  }

  render() {
    const { onClick, list, currentScene, styleObj } = this.props
    return (
      <View className="scene-list" style={styleObj}>
        <ScrollView 
          className="scroll"
          scrollX
        >
          {list.map((item, index) => {
            return <SceneItem 
                active={currentScene.sceneId === item.sceneId}
                key={index} 
                thumbnailUrl={item.thumbnailUrl}
                bgUrl={item.bgUrl}
                sceneName={item.sceneName}
                onClick={this.handleClick.bind(this, item)}
              />
          })}
        </ScrollView>
      </View>
    )
  }
}

export default SceneList as ComponentClass<ComponentOwnProps, ComponentState>