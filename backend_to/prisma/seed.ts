import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Trader {
  name: string
  email: string
  password: string
  active: boolean
}
interface Traders {
  [key: string]: Trader
}

const traders: Traders = {
  ala: {
    name: 'Ala',
    email: 'ala@ma.com',
    password: 'p123',
    active: true,
  },
  kot: {
    name: 'Kot',
    email: 'kot@ma.com',
    password: 'p123',
    active: true,
  },
}

const stocks = [
  {
    name: 'tesla',
  },
]

async function addStocks() {
  const existingStocks = await prisma.stocks.findMany();
  if (existingStocks.length === 0) {
    for (const stock of stocks) {
      await prisma.stocks.create({
        data: {
          name: stock.name,
        },
      });
    }
    console.log('Stock has been created:', stocks);
  } else {
    console.log('Stock already exist.');
  }
}

// Add Stocks
addStocks().catch((e) => {
  console.error(e);
  process.exit(1);
});



async function addTraders(trader: Trader) {
  const existingTraders = await prisma.traders.findUnique({
    where: { email: trader.email },
  });

  if (!existingTraders) {
    await prisma.traders.create({
      data: {
        name: trader.name,
        email: trader.email,
        password: trader.password,
        active: trader.active,
      },
    });

    console.log('Trader has been created:', trader);
  } else {
    console.log('Trader already exists.');
  }
}

async function main() {
  for (const trader of Object.values(traders)) {
    await addTraders(trader).catch((e) => {
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