// ioProduct.ts
import type { Socket } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function ioGetProducts(socket: Socket) {
  socket.on('get products', async (callback) => {
    try {
      console.log('get products odpytany');
      // const { userId } = socket.handshake.auth
      // console.log(`user of id ${userId} is calling for product list`);
      // find all product avalaible ind the database user id is not nessesary
      const products = await prisma.products.findMany()
      callback(products)
    }
    catch (error) {
      console.error('Error fetching tags:', error)
      callback(false)
    }
  })
}
