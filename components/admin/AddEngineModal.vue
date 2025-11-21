<template>
  <BaseModal
    :model-value="modelValue"
    title="添加搜索引擎"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="form-group">
      <label>搜索引擎名称</label>
      <input v-model="engineForm.name" type="text" class="form-control" placeholder="如：Google">
    </div>
    <div class="form-group">
      <label>搜索URL</label>
      <input v-model="engineForm.url" type="text" class="form-control" placeholder="如：https://www.google.com/search?q=">
    </div>
    <div class="form-group">
      <label>占位符文字</label>
      <input v-model="engineForm.placeholder" type="text" class="form-control" placeholder="如：Google搜索">
    </div>
    <div class="form-group">
      <label>图标</label>
      <input v-model="engineForm.icon" type="text" class="form-control" placeholder="图标URL或SVG代码">
    </div>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">取消</button>
      <button type="button" class="btn btn-primary" @click="add">添加</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'add'])

const engineForm = ref({ name: '', url: '', placeholder: '', icon: '' })

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    engineForm.value = { name: '', url: '', placeholder: '', icon: '' }
  }
})

const add = () => {
  if (!engineForm.value.name || !engineForm.value.url) {
    // Let parent handle notification
    emit('add', { error: '请填写搜索引擎名称和URL' })
    return
  }

  emit('add', { ...engineForm.value })
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
</style>
