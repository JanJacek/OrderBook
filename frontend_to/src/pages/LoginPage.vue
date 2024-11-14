<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="q-pa-xl">
      <p class="text-h5">Login</p>
      <q-form
        @submit.prevent="login"
        class="q-gutter-md q-mt-md"
        style="width: 400px"
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
<script setup lang="ts">
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';

const email = ref('');
const password = ref('');
const error = ref('');
const socket = inject<Socket>('socket');
const router = useRouter();

const login = async () => {
  if (!socket) {
    console.error('Socket is not defined');
    return;
  }
  socket.emit(
    'login',
    { email: email.value, password: password.value },
    (response: { error?: string; token?: string }) => {
      if (response.error) {
        error.value = response.error;
      } else {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
        } else {
          console.error('Token is undefined');
        }
        setTimeout(() => {
          router.push('/');
        }, 10);
      }
    }
  );
};
</script>

<style scoped>
/* Add your styles here */
</style>
