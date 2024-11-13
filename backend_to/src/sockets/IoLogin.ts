import type { Socket } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export function ioLogin(socket: Socket) {
  socket.on('login', async ({ email, password }, callback) => {
    try {
      const trader = await prisma.traders.findUnique({
        where: { email },
      })

      if (!trader || trader.password !== password) {
        return callback({ error: 'Invalid email or password' })
      }

      const token = jwt.sign({ traderId: trader.id, traderName: trader.name }, 'your_jwt_secret')
      callback({ token })
    }
    catch (error) {
      console.error(error)
      callback({ error: 'An error occurred during login' })
    }
  })
}