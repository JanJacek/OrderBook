<template>
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
defineOptions({
  name: 'App',
});
</script>
