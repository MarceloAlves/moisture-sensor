#!/usr/bin/env node
const { interpret } = require('xstate')
const { soilMachine } = require('./machine')

const path = require('path')
const http = require('http')
const express = require('express')
const app = express()

const server = http.createServer(app)

app.use(express.static(__dirname + '../client/dist'))

app.get('/client*.js', function (request, response) {
  response.sendFile(path.resolve(__dirname, `../client/dist${request.originalUrl}`))
})

app.get('/', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../client/dist/index.html'))
})

server.listen(5000, () => {
  console.log('Listening on port: 5000')
})

const io = require('socket.io')(server)

const service = interpret(soilMachine)
  .onChange((data) => {
    console.log('Transition', data)
    io.emit('moistureLevel', data)
  })
  .start()

service.send('SETUP')

io.on('connection', function (socket) {
  console.log(`New connection: ${socket.id}`)
  socket.on('disconnect', () => console.log(`Connection left (${socket.id})`))
  socket.emit('currentState', service.state.context)
})
