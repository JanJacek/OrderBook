import { boot } from 'quasar/wrappers';
import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

const socket = io('http://localhost:3000', {
  auth: {
    token: token,
  },
});

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket;
  app.provide('socket', socket);
});

export { socket };
