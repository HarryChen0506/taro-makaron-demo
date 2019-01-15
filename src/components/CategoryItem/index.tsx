import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'

import './index.less'
import loading from '../../assets/images/pic_loading.png'

type ComponentStateProps = {}

type ComponentOwnProps = {
  onGetUserInfo: (data:any) => void,
  onClick?: () => void,
  url: string
}

type ComponentState = {}

type IProps = ComponentStateProps & ComponentOwnProps

interface CategotyItem {
  props: IProps;
}

class CategotyItem extends Component {
  static defaultProps = {
    url: loading
  }
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }
  handleGgetUserInfo = (data) => {
    const { onGetUserInfo } = this.props
    onGetUserInfo(data)
  }
  render() {
    const { onClick, url } = this.props
    return (
      <View className="category-box" onClick={onClick}>                             
        <Button 
          className="category-box-button"
          hoverClass="btn-hover" 
          openType="getUserInfo" 
          onGetUserInfo={this.handleGgetUserInfo}
          formType="submit">
          <Image 
            className="category-box-image"
            src={url}
            mode="scaleToFill"/>
        </Button>
      </View>
    )
  }
}

export default CategotyItem as ComponentClass<ComponentOwnProps, ComponentState>