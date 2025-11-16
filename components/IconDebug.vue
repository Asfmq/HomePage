<template>
  <div v-if="showDebug" class="icon-debug" style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; font-size: 12px; z-index: 9999; border-radius: 5px;">
    <div>SVG Icons Debug Info:</div>
    <div>SVG Loaded: {{ svgLoaded }}</div>
    <div>Home Icon: {{ iconStatus.home }}</div>
    <div>Search Icon: {{ iconStatus.search }}</div>
    <div>AI Icon: {{ iconStatus.ai }}</div>
    <div>Total Icons: {{ totalIcons }}</div>
    <button @click="checkIcons" style="margin-top: 5px; padding: 2px 5px; background: #333; color: white; border: none; border-radius: 3px; cursor: pointer;">Check Icons</button>
    <button @click="showDebug = false" style="margin-left: 5px; padding: 2px 5px; background: #666; color: white; border: none; border-radius: 3px; cursor: pointer;">Hide</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showDebug = ref(false)
const svgLoaded = ref(false)
const totalIcons = ref(0)
const iconStatus = ref({
  home: false,
  search: false,
  ai: false
})

const checkIcons = () => {
  // Check if SVG element exists
  const svgElement = document.querySelector('svg[style*="position: absolute"]')
  svgLoaded.value = !!svgElement

  if (svgElement) {
    // Count total symbols
    const symbols = svgElement.querySelectorAll('symbol')
    totalIcons.value = symbols.length

    // Check specific icons
    iconStatus.value = {
      home: !!svgElement.querySelector('#icon-home'),
      search: !!svgElement.querySelector('#icon-search'),
      ai: !!svgElement.querySelector('#icon-ai')
    }
  }

  console.log('Icon Debug Info:', {
    svgLoaded: svgLoaded.value,
    totalIcons: totalIcons.value,
    iconStatus: iconStatus.value
  })
}

onMounted(() => {
  // Check icons after a short delay
  setTimeout(() => {
    checkIcons()
  }, 1000)
})
</script>

<style scoped>
.icon-debug {
  font-family: monospace;
}
</style>