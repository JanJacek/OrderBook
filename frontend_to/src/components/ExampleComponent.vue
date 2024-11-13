<template>
  <div class="flex justify-center items-stretch q-mt-xl q-pt-md">
    <div class="flex justify-center" style="width: 500px">
      <q-card
        v-for="[key, item] in Object.entries(menu)"
        :key="key"
        style="width: 218px"
        class="q-ma-md"
        @click="order[key] = order[key] ? order[key] + 1 : 1"
      >
        <q-card-section class="flex justify-center">
          <q-img
            :src="`../../public/kawaii/${item.img}`"
            alt="burger img"
            style="height: 100px; max-width: 100px"
          />
        </q-card-section>

        <p class="text-h5 text-bold text-center q-mt-md">
          {{ item.name }}<br />
          <span class="text-caption">Price: {{ item.price }}$</span>
        </p>

        <q-btn
          label="Add"
          size="lg"
          no-caps
          flat
          color="primary"
          style="width: 100%"
        />
      </q-card>
    </div>

    <div class="flex justify-center q-pa-md" style="width: 500px">
      <q-card style="width: 100%">
        <q-card-section>
          <q-list
            style="width: 100%; height: 270px"
            class="bg-grey-2"
            separator
          >
            <!-- product img -->
            <q-item-label header class="text-h6">Order summary</q-item-label>
            <q-item
              v-for="[key] in Object.entries(order)"
              :key="key"
              dense
              class="q-pa-none"
            >
              <q-avatar>
                <q-img
                  :src="`../../public/kawaii/${menu[key].img}`"
                  alt="burger img"
                  width="20px"
                />
              </q-avatar>
              <q-item-section>
                <q-item-label>{{ menu[key].name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>{{ order[key] }}</q-item-label>
              </q-item-section>
              <q-item-section side style="width: 30px">
                <q-item-label>{{ order[key] * menu[key].price }}$</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat icon="delete" @click="delete order[key]" />
              </q-item-section>
            </q-item>
          </q-list>
          <div
            class="flex column justify-between q-pt-xl"
            style="height: 290px"
          >
            <div
              class="flex justify-end q-mt-xl items-end"
              style="height: 130px"
            >
              <p class="text-h4 text-bold text-right" style="width: 340px">
                ドージでやりなさい ヾ(ﾟ∀ﾟゞ)
              </p>
            </div>

            <q-btn
              :label="
                totalOrderPrice() > 0
                  ? totalOrderPrice() + '$ Order'
                  : '0$ Order'
              "
              color="primary"
              :disable="totalOrderPrice() <= 0"
              no-caps
              style="width: 100%"
              size="lg"
              @click="placeOrder()"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useMainStore } from 'src/stores/mainStore';
import { onMounted, ref, inject } from 'vue';
import { Socket } from 'socket.io-client';
import { useMainStore } from 'src/stores/mainStore';

type MenuItem = {
  name: string;
  img: string;
  price: number;
};

type MenuItemWithId = MenuItem & { id: number };

const order = ref<Record<string, number>>({});
const menu = ref<Record<string, MenuItem>>({});
const mainStore = useMainStore();

const totalOrderPrice = () => {
  return Object.entries(order.value).reduce(
    (acc, [key, quantity]) => acc + quantity * menu.value[key].price,
    0
  );
};
const socket = inject<Socket>('socket');
const fetchProducts = () => {
  const token = localStorage.getItem('token');
  if (socket && token) {
    socket.auth = { token: token }; // Przekaż token w auth handshake
    socket.emit('get products', (products: MenuItemWithId[]) => {
      if (products) {
        const menuItems: Record<string, MenuItem> = {};
        console.log(products);
        products.forEach((product) => {
          menuItems[product.id] = product;
        });
        menu.value = menuItems;
      } else {
        console.error('Failed to fetch products');
      }
    });
  } else {
    console.error('Socket is not defined or token is missing');
  }
};

function placeOrder() {
  const token = localStorage.getItem('token');
  console.log(mainStore.restaurantId);
  console.log(order.value);
  if (socket && token) {
    const orderData = {
      id_restaurant: mainStore.restaurantId,
      products: Object.entries(order.value).map(([key, quantity]) => ({
        id: parseInt(key),
        quantity: quantity,
      })),
      date: new Date().toISOString(),
    };
    console.log(orderData);

    socket.emit('add order', orderData, (response: boolean) => {
      if (response) {
        console.log('Order placed successfully', response);
        order.value = {};
      } else {
        console.error('Failed to place order');
      }
    });
  } else {
    console.error('Socket is not defined or token is missing');
  }
}

onMounted(() => {
  fetchProducts();
});
</script>
