import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import globalData from '../../services/global_data'
import { getSystemInfo } from '../../model/actions/global'
import './index.less'
import bg from '../../assets/images/bg.png'
import mock_data from './mock.json'
import Title from '../../components/Title'
import CustomIcon from '../../components/Icon'
import CategoryItem from '../../components/CategoryItem'
import AuthModal from '../../components/AuthModal'


// console.log('mock_data', mock_data)
type PageStateProps = {
  counter: {
    num: number
  },
  global: {
    system: object
  }
}

type PageDispatchProps = {
  getSystemInfo: (data:object) => void
}

type PageOwnProps = {}

type PageState = {
  categoryList: Array<object>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Home {
  props: IProps;
}

@connect(({ counter, global }) => ({
  counter,
  global
}), (dispatch) => ({
  getSystemInfo (data) {
    dispatch(getSystemInfo(data))
  }
}))
class Home extends Component {
  config: Config = {
    navigationBarTitleText: '马卡龙玩图-taro'
  }

  state = {
    categoryList: [],
    showAuth: false
  }

  componentWillMount () {
    const {getSystemInfo} = this.props
    const systemInfo = Taro.getSystemInfoSync()
    getSystemInfo(systemInfo)

    const categoryList =  this.getCategotyList(mock_data.result)
    this.setState({
      categoryList
    })
  }
  componentDidMount () { }
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)  
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getCategotyList (data: Array<any>) {
    const list = []
    data.forEach(item => {
      (item.themeList || [] ).forEach(theme => {
        list.push(theme)
      })
    })
    return list
  }

  handleChooseTheme = (item: object) => {
    // console.log('handleChooseTheme', item)    
  }

  handleGetUserInfo = (data) => {
    // console.log('handleGetUserInfo', data)
    const {detail: {userInfo}} = data   
    if (userInfo) {
      globalData.userInfo = userInfo
      this.todo()
    } else {
      Taro.showToast({
        title: '请授权',
        icon: 'success',
        duration: 2000
      })
    }
  }

  todo = () => {
    this.showActionSheet((path)=>{
      console.log('choosedImage', path)    
      globalData.choosedImage = path
      Taro.redirectTo({
        url: '/pages/dynamic/index'
      })   
    })
  }

  showActionSheet = async (callback) => {
    const _this = this
    Taro.showActionSheet({
      itemList: [
        '拍摄人像照',
        '从相册选择带有人像的照片',
      ],
      success: function ({tapIndex}) {
        if (tapIndex === 0) {
          Taro.authorize({
            scope: "scope.camera",
          }).then(res => {
            Taro.chooseImage({
              count: 1,
              sourceType: ['camera'],
              sizeType: ['compressed '],
            }).then(({tempFilePaths: [path]}) => {
              typeof callback === 'function' && callback(path)
            })
          }, err => {
            console.log('authorize err', err)
            Taro.getSetting().then(authSetting => {
              if (authSetting['scope.camera']) {
              } else {
                Taro.showModal({
                  title: '拍摄图片需要授权',
                  content: '拍摄图片需要授权\n可以授权吗？',
                  confirmText: "允许",
                  cancelText: "拒绝",                      
                }).then(res => {     
                  if (res.confirm) {
                    _this.showAuthModal(true)
                  }
                })
              }                
            })
          })
        } else if (tapIndex === 1) { 
          Taro.chooseImage({
            count: 1,
            sourceType: ['album'],
          }).then(({tempFilePaths: [path]}) => {
            typeof callback === 'function' && callback(path)
          })
        }		
      }
    })
  }

  showAuthModal = (flag = false) => {
    this.setState({
      showAuth: flag
    })
  }

  closeAuthModal = () => {
    this.setState({
      showAuth: false
    })
  }

  render () {
    const { global } = this.props
    const { categoryList, showAuth } = this.state
    return (
      <View className='page-home'>
        <Title 
          top={global.system.statusBarHeight + 10}
          renderLeft={
            <CustomIcon type="menu" theme="light"/>
          }
        >马卡龙玩图</Title>
        <View className="main">
          <View className="main-bg">
            <image src={bg} mode="widthFix" style="width:100%;height:100%"/>
          </View>
          <View className="main-container">
            <View className="category-wrap">
             {
               categoryList.map(item => {
                 return <CategoryItem 
                    onGetUserInfo={this.handleGetUserInfo}
                    key={item.themeId} 
                    url={item.generalShowUrl || ''}
                    onClick={this.handleChooseTheme.bind(this, item)}
                  />
               })
             }
            </View>
          </View>
        </View> 
        {showAuth && <AuthModal onClick={this.closeAuthModal}/>}
      </View>
    )
  }
}

export default Home as ComponentClass<PageOwnProps, PageState>
