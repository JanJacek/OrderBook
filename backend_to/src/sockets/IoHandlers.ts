import type { Server } from 'socket.io'
import { authSocket } from '../utils/jwtVerify'
import { ioLogin } from './IoLogin'
import { ioAddOrder } from './IoOrders'
import { ioTest } from './IoTest'
import { ioGetProducts } from './IoProducts'

export function registerSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log(`Klient połączony: ${socket.id}`)

    ioLogin(socket)

    // middleware to check if the user is authenticated
    socket.use((packet, next) => {
      console.log(packet[0]);
      if (packet[0] === 'login') {
        return next()
      }
      authSocket(socket, next)
    })

    ioTest(socket)
    ioAddOrder(socket)
    ioGetProducts(socket)

    socket.on('disconnect', () => {
      console.log(`Klient rozłączony: ${socket.id}`)
    })
  })
}
