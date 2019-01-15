import { combineReducers } from 'redux'
import counter from './counter'
import global from './global'

export default combineReducers({
  counter,
  global
})
