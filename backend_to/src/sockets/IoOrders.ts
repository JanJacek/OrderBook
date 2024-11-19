import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

interface Order {
  trader_id: number,
  order: { stock_id: number, quantity: number, price:number, type: 'buy' | 'sell' },
  date: string
}

// ORDER SECTION
export function ioGetOrderBook(socket: Socket) {
  socket.on('get order book', async (data, callback) => {
    try {
      console.log('Received data:', data); // Log received data for debugging
      const orders = await prisma.orders.findMany({
        include: {
          stocks: true
        }
      });

      callback(orders);
    } catch (error) {
      console.error('Error fetching order book:', error);
      callback({ error: 'Error fetching order book' });
    }
  });
}

export function ioAddOrder(io: Server, socket: Socket) {
  socket.on('add order', async (data, callback) => {
    try {
      console.log('data:', data);
      const { trader_id, order } = data as Order;

      // check if trader exists

      const traderExists = await prisma.traders.findUnique({
        where: { id: trader_id }
      });

      if (!traderExists) {
        console.log('Trader does not exist');
        callback(false, 'Trader does not exist');
        return;
      }

      // check if stock exists
      console.log('Checking if stock exists...');
      const stockExists = await prisma.stocks.findUnique({
        where: { id: order.stock_id }
      });

      if (!stockExists) {
        console.log('Stock does not exist');
        callback(false, 'Stock does not exist');
        return;
      }

      // Create new order
      console.log('Creating new order...');
      await prisma.orders.create({
        data: {
          stock_id: order.stock_id,
          price: order.price,
          quantity: order.quantity,
          order: order.type,
          trader_id: trader_id,
          date: new Date()
        }
      });

      // send updates to traders
      console.log('order added');
      try {
        console.log('Fetching updated orders list...');
        const orders = await prisma.orders.findMany({
          include: {
            stocks: true
          }
        });

        // Notify all connected clients about the updated orders list
        console.log('wysyłam update orders list');
        io.emit('orders list updated', orders);
      } catch (error) {
        console.error('Error fetching updated orders list:', error);
      }
      callback(true);
    } catch (error) {
      console.error('Error adding order:', error);
      callback(false);
    }
  });
}

export function ioRemoveOrder(io: Server, socket: Socket) {
  socket.on('rem order', async (data, callback) => {
    try{
      const { orderId } = data;
      // Extract token from headers
      const token = socket.handshake.auth.token
     console.log(token);
      if (!token) {
        callback(false, 'Token not provided');
        return;
      }
      const decoded = jwt.verify(token, 'your_jwt_secret') as { traderId: number };
      const traderIdFromToken = decoded.traderId;

      const order = await prisma.orders.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        console.log('no order');
        callback(false);
        return;
      }

      if (order.trader_id !== traderIdFromToken) {
        console.log('wrong trader');
        callback(false);
        return;
      }

      await prisma.orders.delete({
        where: { id: orderId }
      });

      try {
        console.log('Fetching updated orders list...');
        const orders = await prisma.orders.findMany({
          include: {
            stocks: true
          }
        });

        // Notify all connected clients about the updated orders list
        console.log('wysyłam update orders list');
        io.emit('orders list updated', orders);
      } catch (error) {
        console.error('Error fetching updated orders list:', error);
      }
      callback(true);
    }catch (error){
      callback(false);
    }
  });
}
