import {
  SYSTEM,
} from '../constants/global'

export const getSystemInfo = (data) => {
  return {
    type: SYSTEM,
    data
  }
}

