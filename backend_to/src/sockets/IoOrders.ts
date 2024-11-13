import type { Socket } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ORDER SECTION
export function ioAddOrder(socket: Socket) {
  socket.on('add order', async (data, callback) => {
    try {

      const { id_restaurant, products, date } = data as { id_restaurant: number, products: { id: number, quantity: number }[], date: string };
      const id_set = Math.floor(Math.random() * 1000000);

      // Sprawdź istnienie id_restaurant
      const restaurantExists = await prisma.restaurants.findUnique({
        where: { id: id_restaurant }
      });

      if (!restaurantExists) {
        callback(false, 'Restaurant does not exist');
        return;
      }


      // sprawdź czy produkty istnieją jeżleli nie to zwróć błąd
      const productIds = products.map(product => product.id);

      const productsExists = await prisma.products.findMany({
        where: { id: { in: productIds } }
      });

      if (productsExists.length !== products.length) {
        callback(false, 'One or more products do not exist');
        return;
      }

// Tworzenie zamówień
await Promise.all(products.map(async (product) => {
  await prisma.orders.create({
    data: {
      id_set,
      id_restaurant,
      id_product: product.id,
      quantity: product.quantity,
      date: new Date(date) // Upewnij się, że date jest typu DateTime
    }
  });
}));
// Wyślij nowe zamówienie do klienta
callback(true);
    }
    catch (error) {
      console.error('Error adding order:', error)
      callback(false)
    }
  })
}

// export function ioGetTags(socket: Socket) {
//   // get tags that are belong to the user
//   socket.on('get tags', async (data, callback) => {
//     try {
//       const { userId } = data

//       const tags = await prisma.tag.findMany({
//         where: { userId },
//       })

//       callback(tags)
//     }
//     catch (error) {
//       console.error('Error fetching tags:', error)
//       callback(false)
//     }
//   })
// }

