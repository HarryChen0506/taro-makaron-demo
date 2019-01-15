import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.less'

type ComponentStateProps = {}

type ComponentOwnProps = {
  top: number,
  renderLeft: any,
  children: any, 
  color?: string 
}

type ComponentState = {}

type IProps = ComponentStateProps & ComponentOwnProps

interface Title {
  props: IProps;
}

class Title extends Component {
  static defaultProps = {
    color: '#fff'
  }
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }
  render() {
    const { top, color } = this.props
    return (
      <View className='title-wrap' style={{top: top + 'px'}}>
        <View className="left">
          {this.props.renderLeft}
        </View>
        <Text style={{color}}>{this.props.children}</Text>  
      </View>
    )
  }
}

export default Title as ComponentClass<ComponentOwnProps, ComponentState>