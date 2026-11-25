<template>
  <BaseModal
    :model-value="modelValue"
    title="网站信息设置"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="form-group">
      <label>网站标题</label>
      <input v-model="localConfig.title" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>网站描述</label>
      <textarea v-model="localConfig.description" class="form-control" rows="3"></textarea>
    </div>
    <div class="form-group">
      <label>关键词</label>
      <input v-model="localConfig.keywords" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>作者</label>
      <input v-model="localConfig.author" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>网站图标</label>
      <input v-model="localConfig.favicon" type="text" class="form-control" />
    </div>
    <div class="form-group">
      <label>背景图片</label>
      <input v-model="localConfig.backgroundImage" type="text" class="form-control" />
    </div>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">
        取消
      </button>
      <button type="button" class="btn btn-primary" :disabled="saving" @click="save">
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'
import type { SiteConfig } from '~/types/config'

const props = defineProps<{
  modelValue: boolean
  config: SiteConfig
  saving?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const localConfig = ref<SiteConfig>({} as SiteConfig)

// Initialize local config when modal opens
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      localConfig.value = JSON.parse(JSON.stringify(props.config))
    }
  }
)

// 保存状态由父组件驱动：emit 返回 void，无法在这里等待请求完成，
// 以前的 await emit(...) 是假等待，会让按钮 loading 立即结束。
const save = () => {
  if (props.saving) return
  emit('save', localConfig.value)
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
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius, 0.25rem);
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: var(--primary-color, #80bdff);
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
