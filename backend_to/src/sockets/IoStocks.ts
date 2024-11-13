// ioProduct.ts
import type { Socket } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function ioGetStocks(socket: Socket) {
  socket.on('get stocks', async (callback) => {
    try {
      console.log('get stocks has been called');
      // const { userId } = socket.handshake.auth
      // console.log(`user of id ${userId} is calling for product list`);
      const stocks = await prisma.stocks.findMany()
      callback(stocks)
    }
    catch (error) {
      console.error('Error fetching stocks:', error)
      callback(false)
    }
  })
}
