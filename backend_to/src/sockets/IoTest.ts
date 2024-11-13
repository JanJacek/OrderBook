import type { Socket } from 'socket.io'
import { exportToGoogleSheets } from '../googleApi/apiHandler'

export function ioTest(socket: Socket) {
  socket.on('test', () => {
    exportToGoogleSheets()
    console.log('Received test event')
    socket.emit('test', 'Hello from server!')
  })
}
