<script setup>
import FileUploadComponent from "./components/FileUploadComponent.vue";
import HeaderComponent from "./components/HeaderComponent.vue";
</script>

<template>
  <HeaderComponent />
  <!-- <FileUploadComponent /> -->
  <div class="container mx-auto max-w-7xl">
    <RouterView />
  </div>
</template>

<style scoped></style>
