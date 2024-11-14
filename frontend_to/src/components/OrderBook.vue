<template>
  <div class="flex no-wrap" style="width: 80%">
    <q-table
      :rows="orders"
      :columns="columns"
      row-key="id"
      style="width: 100%; height: 500px"
      :dark="true"
      flat
    />

    <div class="bg-dark q-ml-md q-pa-md" style="width: 400px">
      <q-form @submit="addOrder()" class="q-gutter-md">
        <q-input
          outlined
          v-model.number="newOrder.quantity"
          placeholder="Quantity"
          type="number"
          required
          :dark="true"
          hint="Type the quantity of stocks"
        />
        <q-input
          outlined
          v-model.number="newOrder.price"
          placeholder="Price"
          type="number"
          required
          :dark="true"
          hint="Type your price proposition"
        />

        <q-select
          outlined
          v-model="newOrder.order"
          :options="options"
          required
          :dark="true"
          hint="Select order type"
        />
        <div class="flex justify-end">
          <q-btn label="Submit" type="submit" color="grey-9" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Socket } from 'socket.io-client';
import { inject } from 'vue';
import { getTokenData } from 'src/utils/tokenHandler';

interface Order {
  id: number;
  stock_id: number;
  price: number;
  quantity: number;
  order: 'buy' | 'sell';
  trader_id: number;
  date: Date;
  stocks: {
    id: number;
    name: string;
  };
}

interface TransformedOrder {
  id: number;
  stockName: string;
  pricePerShare: number;
  quantity: number;
  type: 'buy' | 'sell';
  date: string;
}

const socket = inject<Socket>('socket');
const orders = ref<TransformedOrder[]>([]);
const options = [
  {
    label: 'Buy',
    value: 'buy',
  },
  {
    label: 'Sell',
    value: 'sell',
  },
];
const newOrder = ref({
  stock_id: 1,
  quantity: 0,
  price: 0,
  order: {
    label: 'Buy',
    value: 'buy',
  },
  trader_id: getTokenData(localStorage.getItem('token') || '').traderId,
  date: new Date().toISOString().split('T')[0], // Format date as YYYY-MM-DD
});

const columns = [
  {
    name: 'stockName',
    label: 'Stock Name',
    field: 'stockName',
    align: 'left' as const,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    field: 'quantity',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'price',
    label: 'Price',
    field: 'price',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'pricePerShare',
    label: 'Price per Share',
    field: 'pricePerShare',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'date',
    label: 'Date',
    field: 'date',
    align: 'left' as const,
    format: (val: string) => new Date(val).toLocaleString(),
    sortable: true,
  },
];

function transformOrders(orders: Order[]): TransformedOrder[] {
  return orders.map((order) => ({
    id: order.id,
    stockName: order.stocks.name,
    pricePerShare: order.quantity / order.price,
    price: order.price,
    quantity: order.quantity,
    type: order.order,
    date: new Date(order.date).toISOString().toLocaleString(),
  }));
}

onMounted(() => {
  if (socket) {
    socket.emit(
      'get order book',
      {},
      (response: Order[] | { error: string }) => {
        if ('error' in response) {
          console.error(response.error);
        } else {
          orders.value = transformOrders(response);
        }
      }
    );

    // Listen for 'orders list updated' event
    socket.on('orders list updated', (updatedOrders: Order[]) => {
      orders.value = transformOrders(updatedOrders);
    });
  } else {
    console.error('Socket is not defined');
  }
});

const addOrder = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('Token not found');
    return;
  }

  const order = {
    trader_id: getTokenData(token).traderId,
    order: {
      stock_id: newOrder.value.stock_id,
      type: newOrder.value.order.value,
      quantity: newOrder.value.quantity,
      price: newOrder.value.price,
    },
    date: newOrder.value.date,
  };

  if (socket) {
    socket.emit('add order', order, (success: boolean, message: string) => {
      if (success) {
        console.log('Order added successfully');
        // clear the form
        newOrder.value = {
          stock_id: 1,
          quantity: 0,
          price: 0,
          order: {
            label: 'Buy',
            value: 'buy',
          },
          trader_id: getTokenData(token).traderId,
          date: new Date().toISOString().split('T')[0],
        };
      } else {
        console.error('Error adding order:', message);
      }
    });
  } else {
    console.error('Socket is not defined');
  }
};
</script>

<style scoped></style>
