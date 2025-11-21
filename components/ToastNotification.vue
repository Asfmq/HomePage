<template>
  <Transition name="toast">
    <div v-if="show" class="toast-notification" :class="type">
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}>()

const emit = defineEmits(['update:show'])

watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emit('update:show', false)
    }, props.duration || 3000)
  }
})
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  min-width: 200px;
  justify-content: center;
}

.success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.error {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.info {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.warning {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
