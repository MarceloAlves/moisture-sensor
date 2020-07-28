import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { useToast, Icon, Box, Grid, Text, Flex } from '@chakra-ui/core'
import Plug from './assets/plug.svg'
import { CONNECTION_STATUS, DEFAULT_TOAST_OPTIONS, MOISTURE_LEVEL } from './constants'
import { connectionStatusColor } from './helpers'

const App = () => {
  const toast = useToast()
  const [socket, setSocket] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.IDLE)
  const [currentMoistureLevel, setCurrentMoistureLevel] = useState(MOISTURE_LEVEL.DRY)

  useEffect(() => {
    setSocket(io(`http://${process.env.HOSTNAME}:5000`))
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('connect', () => {
      setConnectionStatus(CONNECTION_STATUS.CONNECTED)
      toast({
        description: 'Connected',
        status: 'success',
        ...DEFAULT_TOAST_OPTIONS,
      })
    })

    socket.on('disconnect', () => {
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED)
      toast({
        description: 'Disconnected',
        status: 'error',
        ...DEFAULT_TOAST_OPTIONS,
      })
    })

    socket.on('reconnecting', () => setConnectionStatus(CONNECTION_STATUS.RECONNECTING))
    socket.on('currentState', (data) => setCurrentMoistureLevel(data.currentReading))
    socket.on('moistureLevel', (data) => setCurrentMoistureLevel(data.currentReading))
  })

  return (
    <Grid height='100vh' style={{ placeItems: 'center' }}>
      <Box position='absolute' top='0' right='0' padding='5px'>
        <Icon name='plug' height='25px' width='25px' color={connectionStatusColor(connectionStatus)} />
      </Box>
      <Flex flexDirection={{ _: 'column', sm: 'row' }} alignItems={{ _: 'center', sm: 'flex-end' }}>
        <Text fontSize='xl'>Current Moisture Level:</Text>
        <Icon
          name='seedling'
          size='50px'
          marginLeft='10px'
          color={currentMoistureLevel === MOISTURE_LEVEL.DRY ? 'yellow.800' : 'green.500'}
        />
      </Flex>
    </Grid>
  )
}

export default App
