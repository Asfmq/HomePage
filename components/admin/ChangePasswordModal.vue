<template>
  <BaseModal
    :model-value="modelValue"
    title="修改密码"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="form-group">
      <label>当前密码</label>
      <input v-model="passwordForm.current" type="password" class="form-control" placeholder="输入当前密码">
    </div>
    <div class="form-group">
      <label>新密码</label>
      <input v-model="passwordForm.new" type="password" class="form-control" placeholder="输入新密码">
    </div>
    <div class="form-group">
      <label>确认新密码</label>
      <input v-model="passwordForm.confirm" type="password" class="form-control" placeholder="再次输入新密码">
    </div>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">取消</button>
      <button type="button" class="btn btn-warning" @click="changePassword" :disabled="loading">
        {{ loading ? '修改中...' : '修改密码' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'change-password'])

const passwordForm = ref({ current: '', new: '', confirm: '' })
const loading = ref(false)

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    passwordForm.value = { current: '', new: '', confirm: '' }
  }
})

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    // Let parent handle notification or emit error
    emit('change-password', { error: '两次输入的密码不一致' })
    return
  }

  loading.value = true
  try {
    await emit('change-password', {
      current: passwordForm.value.current,
      new: passwordForm.value.new
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #333);
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-color, #495057);
  background-color: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--border-radius, 0.25rem);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: var(--primary-color, #80bdff);
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-warning {
  color: #212529;
  background-color: var(--warning-color, #ffc107);
  border-color: var(--warning-color, #ffc107);
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}
</style>
