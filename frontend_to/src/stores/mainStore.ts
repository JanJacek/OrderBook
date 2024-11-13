import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: (): {
    restaurantName: string | undefined;
    restaurantId: number | undefined;
    token: string | undefined;
  } => ({
    restaurantName: '',
    restaurantId: 0,
    token: '',
  }),
  actions: {
    setUserData() {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.restaurantName = payload.restaurant.toUpperCase();
        this.restaurantId = payload.id;
        this.token = token;
      }
    },
  },
  getters: {},
});
