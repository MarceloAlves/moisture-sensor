import { CONNECTION_STATUS } from './constants'

export const connectionStatusColor = (status) => {
  switch (status) {
    case CONNECTION_STATUS.CONNECTED:
      return 'green.500'
    case CONNECTION_STATUS.DISCONNECTED:
      return 'red.500'
    case CONNECTION_STATUS.RECONNECTING:
      return 'yellow.500'
    default:
      return 'black'
  }
}
