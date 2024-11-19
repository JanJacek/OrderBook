import type { Server } from 'socket.io'
import { authSocket } from '../utils/jwtVerify'
import { ioLogin } from './IoLogin'
import { ioAddOrder,ioRemoveOrder, ioGetOrderBook } from './IoOrders'
import { ioGetStocks } from './IoStocks'

export function registerSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log(`Client has join the session: ${socket.id}`)

    ioLogin(socket)

    // middleware to check if the user is authenticated
    socket.use((packet, next) => {
      console.log(packet[0]);
      if (packet[0] === 'login') {
        return next()
      }
      authSocket(socket, next)
    })

    ioGetOrderBook(socket)
    ioAddOrder(io, socket)
    ioRemoveOrder(io, socket)
    ioGetStocks(socket)


    socket.on('disconnect', () => {
      console.log(`Client has been disconnected: ${socket.id}`)
    })
  })
}
