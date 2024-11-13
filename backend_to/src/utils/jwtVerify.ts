import type { Socket } from 'socket.io'
import jwt from 'jsonwebtoken'

export function authSocket(socket: Socket, next: (err?: Error) => void) {
  console.log('authSocket', socket.handshake.auth.token);
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error('Authentication error'))
  }

  jwt.verify(token, 'your_jwt_secret', (err: any, decoded: any) => {
    if (err) {
      return next(new Error('Authentication error'))
    }
    socket.data.user = decoded
    next()
  })
}
