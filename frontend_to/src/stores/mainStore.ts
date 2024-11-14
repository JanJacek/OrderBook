import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: (): {
    traderName: string;
    token: string;
  } => ({
    traderName: '',
    token: '',
  }),
  actions: {},
  getters: {},
});
