<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          KawaiiFood: {{ m_store.restaurantName }}</q-toolbar-title
        >
        <q-btn
          v-if="!isLoginPage"
          flat
          round
          dense
          icon="logout"
          aria-label="Menu"
          @click="logout()"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMainStore } from 'src/stores/mainStore';

const router = useRouter();
const route = useRoute();
const m_store = useMainStore();
const isLoginPage = computed(() => route.path === '/login');

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>
