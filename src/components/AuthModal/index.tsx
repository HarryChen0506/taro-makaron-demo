import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import './index.less'

type ComponentStateProps = {}

type ComponentOwnProps = {
  onClick: () => void
}

type ComponentState = {}

type IProps = ComponentStateProps & ComponentOwnProps

interface AuthModal {
  props: IProps;
}

class AuthModal extends Component {
  handleClick = () => {
   this.props.onClick && this.props.onClick()
  }
  render() {
    return (
      <View className='auth-wrap'>
        <View className="modal"></View>
        <View className="content">
          <Button openType="openSetting" size='default' type='warn' onClick={this.handleClick}>前往授权</Button>
        </View>        
      </View>
    )
  }
}

export default AuthModal as ComponentClass<ComponentOwnProps, ComponentState>