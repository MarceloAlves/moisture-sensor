const DEFAULT_TOAST_OPTIONS = { position: 'bottom-right', duration: 2000, isClosable: true }

const CONNECTION_STATUS = {
  IDLE: 'idle',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
}

const MOISTURE_LEVEL = {
  DRY: 0,
  WET: 1,
}

export { DEFAULT_TOAST_OPTIONS, CONNECTION_STATUS, MOISTURE_LEVEL }
