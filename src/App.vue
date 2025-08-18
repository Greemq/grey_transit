<script setup>
import FileUploadComponent from "./components/FileUploadComponent.vue";
import HeaderComponent from "./components/HeaderComponent.vue";
</script>

<template>
  <HeaderComponent />
  <!-- <FileUploadComponent /> -->

  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped></style>
