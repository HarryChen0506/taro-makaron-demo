import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'

import './index.less'

type ComponentStateProps = {}

type ComponentOwnProps = {
  onClick: () => void,
  url: string,
}

type ComponentState = {}

type IProps = ComponentStateProps & ComponentOwnProps

interface ResultModal {
  props: IProps;
}

class ResultModal extends Component {
  handleClick = () => {
   this.props.onClick && this.props.onClick()
  }
  render() {
    return (
      <View className='result-wrap'>
        <View className="modal-mask"></View>
        <View className="modal-content">
          <View class="pic-wrap">
            <Image class="pic" src={this.props.url} mode="aspectFill" />
          </View>
          <View className="btn-wrap">
            <Button className="custom-button dark" hoverClass="btn-hover"  onClick={this.handleClick}>再玩一次</Button>            
          </View>
        </View>        
      </View>
    )
  }
}

export default ResultModal as ComponentClass<ComponentOwnProps, ComponentState>