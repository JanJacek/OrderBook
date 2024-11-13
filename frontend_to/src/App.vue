<template>
  <div style="position: absolute; top: 10vh; left: 10px">
    <p class="text-h4 q-mr-md text-bold text-white">こんにちは</p>
  </div>
  <router-view />
  <div
    style="
      background-image: url(../../public/kawaii/shells.svg);
      background-repeat: no-repeat;
      background-size: cover;
      width: 100vw;
      height: 400%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      opacity: 0.9;
      transform: rotate(180deg);
    "
  ></div>
  <div style="position: fixed; bottom: 0; right: 3vw; z-index: -1">
    <p class="text-h6 q-mr-md text-bold text-white">=^.^=</p>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from 'src/stores/mainStore';
import { onMounted } from 'vue';
defineOptions({
  name: 'App',
});

const m_store = useMainStore();
//  on mounted set user date by useMainStore() action : setUserData()
onMounted(() => {
  m_store.setUserData();
});
</script>
