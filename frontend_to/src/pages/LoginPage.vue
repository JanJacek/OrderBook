<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="q-pa-xl">
      <p class="text-h5">Login</p>
      <q-form @submit.prevent="login" class="q-gutter-md q-mt-md"
        style="width: 400px;"
      >
        <q-input 
          v-model="email" 
          type="email" 
          placeholder="Email" 
          required
          outlined
          dense
        />
        <q-input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          outlined
          dense
        />
        <q-btn label="Login" color="primary" type="submit" no-caps />
      </q-form>
      <p v-if="error">{{ error }}</p>
    </q-card>
  </q-page>
</template>
<script setup>
import { useMainStore } from 'src/stores/mainStore';
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref(null);
const socket = inject('socket');
const router = useRouter();
const m_store = useMainStore();

const login = async () => {
  socket.emit(
    'login',
    { email: email.value, password: password.value },
    (response) => {
      if (response.error) {
        error.value = response.error;
      } else {
        // in response you receive jwt we have to decode it to check what user was logedin
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));

        m_store.restaurantName = payload.restaurant;
        console.log(payload.restaurant, m_store.restaurantName);
        m_store.restaurantId = payload.id;

        localStorage.setItem('token', response.token);
        m_store.token = response.token;
        router.push('/'); // Przekierowanie na stronę główną lub inną stronę
      }
    }
  );
};
</script>

<style scoped>
/* Add your styles here */
</style>
