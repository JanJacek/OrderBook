import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { registerSocketHandlers } from './sockets/IoHandlers'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Możesz ustawić to na konkretną domenę w produkcji
  },
  maxHttpBufferSize: 1e8, // 100 MB
})

registerSocketHandlers(io)

httpServer.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
