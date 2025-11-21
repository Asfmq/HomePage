<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal-dialog" :class="sizeClass">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="close" @click="close">×</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
    validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'modal-sm'
    case 'lg': return 'modal-lg'
    case 'xl': return 'modal-xl'
    default: return ''
  }
})

// Close on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-glass-dark, rgba(0, 0, 0, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-out;
}

.modal-dialog {
  position: relative;
  width: 90%;
  max-width: 500px;
  margin: 1.75rem auto;
  background: var(--bg-glass, #fff);
  border-radius: var(--border-radius-lg, 12px);
  box-shadow: var(--shadow-lg, 0 20px 40px rgba(0, 0, 0, 0.2));
  animation: slideUp 0.3s ease-out;
}

.modal-lg { max-width: 800px; }
.modal-sm { max-width: 300px; }
.modal-xl { max-width: 1140px; }

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: var(--text-color, #333);
  background-clip: padding-box;
  border: none;
  border-radius: var(--border-radius-lg, 12px);
  outline: 0;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  border-top-left-radius: var(--border-radius-lg, 12px);
  border-top-right-radius: var(--border-radius-lg, 12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color, #333);
}

.close {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-muted, #999);
  text-shadow: none;
  opacity: 1;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.close:hover {
  color: var(--text-color, #333);
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.1);
  border-bottom-right-radius: var(--border-radius-lg, 12px);
  border-bottom-left-radius: var(--border-radius-lg, 12px);
  gap: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
