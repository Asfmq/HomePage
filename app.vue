<template>
  <div>
    <!-- Main Content -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Set up page head
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  },
  bodyAttrs: {
    class: 'bg-gradient'
  }
})
</script>

<style>
/* Global styles will be added here if needed */
</style>