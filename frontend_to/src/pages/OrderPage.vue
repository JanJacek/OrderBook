<template>
  <q-page class="row items-center justify-evenly">
    <order-book />
  </q-page>
</template>

<script setup lang="ts">
import OrderBook from 'components/OrderBook.vue';
import { onMounted } from 'vue';
import { useMainStore } from 'src/stores/mainStore';

const m_store = useMainStore();

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    m_store.token = payload.token;
    m_store.traderName = payload.traderName;
  }
});
</script>
