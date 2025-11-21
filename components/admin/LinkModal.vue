<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? '编辑链接' : '添加新链接'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="form-group">
      <label>网站名称</label>
      <input v-model="linkForm.name" type="text" class="form-control" placeholder="输入网站名称">
    </div>
    <div class="form-group">
      <label>
        网站URL
        <span v-if="isEdit" class="url-link-text" @click="visitLink" title="访问链接">
          <svg width="12" height="12" viewBox="0 0 1024 1024" fill="currentColor" style="display: inline-block; vertical-align: middle;">
            <path d="M853.333 170.667 570.667 453.333l60.333 60.333L913.333 231.333 913.333 384 960 384 960 128 704 128 704 174.667 853.333 170.667zM896 384 896 896c0 35.346-28.654 64-64 64L192 960c-35.346 0-64-28.654-64-64L128 128c0-35.346 28.654-64 64-64l384 0L576 192 192 192 192 896l640 0L832 384 896 384z"/>
          </svg>
        </span>
      </label>
      <input v-model="linkForm.url" type="url" class="form-control" placeholder="输入网站URL">
    </div>
    <div class="form-group">
      <label>图标URL</label>
      <input v-model="linkForm.icon" type="text" class="form-control" placeholder="输入图标URL">
      <button type="button" class="btn btn-sm btn-info mt-2" @click="autoFetchSiteInfo">自动获取网站信息</button>
    </div>

    <template #footer>
      <button v-if="isEdit" type="button" class="btn btn-danger" @click="deleteLink">删除</button>
      <button type="button" class="btn btn-secondary" @click="$emit('update:modelValue', false)">取消</button>
      <button type="button" class="btn btn-primary" @click="save">
        {{ isEdit ? '保存' : '添加' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'

const props = defineProps<{
  modelValue: boolean
  initialData?: { name: string; url: string; icon: string }
  isEdit?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'save', 'delete', 'fetch-info'])

const linkForm = ref({ name: '', url: '', icon: '' })

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.initialData) {
      linkForm.value = { ...props.initialData }
    } else {
      linkForm.value = { name: '', url: '', icon: '' }
    }
  }
})

const save = () => {
  if (!linkForm.value.name || !linkForm.value.url) {
    emit('save', { error: '请填写网站名称和URL' })
    return
  }
  emit('save', { ...linkForm.value })
}

const deleteLink = () => {
  if (confirm('确定要删除这个链接吗？')) {
    emit('delete')
  }
}

const visitLink = () => {
  if (linkForm.value.url) {
    window.open(linkForm.value.url, '_blank')
  }
}

const autoFetchSiteInfo = async () => {
  if (!linkForm.value.url) {
    emit('fetch-info', { error: '请先输入网站URL' })
    return
  }
  
  try {
    const data = await $fetch('/api/fetch-site-info', {
      params: { url: linkForm.value.url }
    })
    
    if (data.title) linkForm.value.name = data.title
    if (data.favicon) linkForm.value.icon = data.favicon
    
    emit('fetch-info', { success: true })
  } catch (error) {
    emit('fetch-info', { error: '获取网站信息失败' })
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

.url-link-text {
  margin-left: 10px;
  color: var(--primary-color, #007bff);
  cursor: pointer;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  transition: opacity 0.2s ease;
}

.url-link-text:hover {
  opacity: 0.7;
  text-decoration: underline;
}

.btn-info {
  color: #fff;
  background-color: var(--info-color, #17a2b8);
  border-color: var(--info-color, #17a2b8);
}

.btn-danger {
  color: #fff;
  background-color: var(--danger-color, #dc3545);
  border-color: var(--danger-color, #dc3545);
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: var(--border-radius, 0.2rem);
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>
