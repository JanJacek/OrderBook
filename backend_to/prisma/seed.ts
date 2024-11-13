import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Restaurant {
  name: string
  email: string
  password: string
  active: boolean
}
interface Restaurants {
  [key: string]: Restaurant
}

const restaurants: Restaurants = {
  warsaw: {
    name: 'Warszawa',
    email: 'warszawa@kawaii.com',
    password: 'p123',
    active: true,
  },
  krakow: {
    name: 'Kraków',
    email: 'krakow@kawaii.com',
    password: 'p123',
    active: true,
  },
  wroclaw: {
    name: 'Wrocław',
    email: 'wroclaw@kawaii.com',
    password: 'p123',
    active: true,
  },
  gdansk: {
    name: 'Gdańsk',
    email: 'gdansk@kawaii.com',
    password: 'p123',
    active: true,
  },
  poznan: {
    name: 'Poznań',
    email: 'poznan@kawaii.com',
    password: 'p123',
    active: true,
  },
  olsztyn: {
    name: 'Olsztyn',
    email: 'olsztyn@kawaii.com',
    password: 'p123',
    active: true,
  },
  lublin: {
    name: 'Lublin',
    email: 'lublin@kawaii.com',
    password: 'p123',
    active: true,
  },
}

const products = [
  {
    name: 'Bāgā',
    img: 'burger.svg',
    price: 12,
  },
  {
    name: 'Roni',
    img: 'pizza.svg',
    price: 10,
  },
  {
    name: 'Tanuki',
    img: 'pita.svg',
    price: 8,
  },
  {
    name: 'Tenshi',
    img: 'fries.svg',
    price: 5,
  }
]

async function addProducts() {
  const existingProducts = await prisma.products.findMany();
  if (existingProducts.length === 0) {
    for (const product of products) {
      await prisma.products.create({
        data: {
          name: product.name,
          img: product.img,
          price: product.price,
        },
      });
    }
    console.log('Products have been created:', products);
  } else {
    console.log('Products already exist.');
  }
}

// Add products
addProducts().catch((e) => {
  console.error(e);
  process.exit(1);
});



async function addRestaurants(restaurant: Restaurant) {
  const existingRestaurant = await prisma.restaurants.findUnique({
    where: { email: restaurant.email },
  });

  if (!existingRestaurant) {
    await prisma.restaurants.create({
      data: {
        name: restaurant.name,
        email: restaurant.email,
        password: restaurant.password,
        active: restaurant.active,
      },
    });

    console.log('Admin has been created:', restaurant);
  } else {
    console.log('Admin already exists.');
  }
}

async function main() {
  for (const restaurant of Object.values(restaurants)) {
    await addRestaurants(restaurant).catch((e) => {
      console.error(e);
      process.exit(1);
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });