import { SYSTEM } from '../constants/global'

const INITIAL_STATE = {
  system: {
    statusBarHeight: 20
  }
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SYSTEM:
      return {
        ...state,
        system: {...state.system, ...action.data}
      }
    default:
      return state
  }
}
