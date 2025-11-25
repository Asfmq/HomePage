<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? '编辑分类' : '添加新分类'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="form-group">
      <label>分类名称</label>
      <input v-model="categoryForm.title" type="text" class="form-control" placeholder="输入分类名称">
    </div>
    <div class="form-group">
      <label>分类图标</label>
      <input v-model="categoryForm.icon" type="text" class="form-control" placeholder="图标SVG代码">
    </div>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">取消</button>
      <button type="button" class="btn btn-primary" @click="submit">{{ isEdit ? '保存' : '添加' }}</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'

const props = defineProps<{
  modelValue: boolean
  initialData?: { title: string; icon: string } | null
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const categoryForm = ref({ title: '', icon: '' })

const isEdit = computed(() => !!props.initialData)

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.initialData) {
      categoryForm.value = { ...props.initialData }
    } else {
      categoryForm.value = { title: '', icon: '' }
    }
  }
})

const submit = () => {
  if (!categoryForm.value.title) {
    emit('submit', { error: '请填写分类名称' })
    return
  }

  emit('submit', { ...categoryForm.value })
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
