<template>
  <BaseModal
    :model-value="modelValue"
    title="版权设置"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="form-group">
      <label>
        <input v-model="localCopyright.show" type="checkbox"> 显示版权信息
      </label>
    </div>
    <div class="form-group">
      <label>版权文字</label>
      <input v-model="localCopyright.text" type="text" class="form-control">
    </div>
    <div class="form-group">
      <label>版权链接目标</label>
      <input v-model="localCopyright.target" type="text" class="form-control">
    </div>
    <div class="form-group">
      <label>
        <input v-model="localCopyright.showRecord" type="checkbox"> 显示备案信息
      </label>
    </div>
    <div class="form-group">
      <label>备案号</label>
      <input v-model="localCopyright.record" type="text" class="form-control">
    </div>
    <div class="form-group">
      <label>备案链接</label>
      <input v-model="localCopyright.recordUrl" type="text" class="form-control">
    </div>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">取消</button>
      <button type="button" class="btn btn-primary" @click="save" :disabled="loading">
        {{ loading ? '保存中...' : '保存' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'

const props = defineProps<{
  modelValue: boolean
  copyright: any
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const localCopyright = ref<any>({})
const loading = ref(false)

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    localCopyright.value = JSON.parse(JSON.stringify(props.copyright))
  }
})

const save = async () => {
  loading.value = true
  try {
    await emit('save', localCopyright.value)
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
</style>
