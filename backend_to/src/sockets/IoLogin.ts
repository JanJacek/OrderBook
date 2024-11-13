import type { Socket } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export function ioLogin(socket: Socket) {
  socket.on('login', async ({ email, password }, callback) => {
    try {
      const restaurant = await prisma.restaurants.findUnique({
        where: { email },
      })

      if (!restaurant || restaurant.password !== password) {
        return callback({ error: 'Invalid email or password' })
      }

      const token = jwt.sign({ id: restaurant.id, restaurant: restaurant.name }, 'your_jwt_secret', { expiresIn: '4h' })
      callback({ token })
    }
    catch (error) {
      console.error(error)
      callback({ error: 'An error occurred during login' })
    }
  })
}