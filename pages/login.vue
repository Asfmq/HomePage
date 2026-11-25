<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h2 class="login-title">管理员登录</h2>
      <input
        v-model="password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': error }"
        placeholder="请输入密码"
        required
        autofocus
      />
      <div v-if="error" class="invalid-feedback d-block text-center mt-2">
        {{ error }}
      </div>
      <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { defaultConfig } from '~/utils/config'

// 首屏配置：SSR 阶段就取到并写进 body 样式，避免"先没有背景、挂载后才出现"的突变
const { data: siteConfig } = await useAsyncData('site-config', () => $fetch('/api/config'), {
  default: () => defaultConfig
})

useHead(() => ({
  bodyAttrs: {
    style: siteConfig.value.backgroundImage
      ? `background-image:url(${siteConfig.value.backgroundImage});background-size:cover;background-position:center;background-repeat:no-repeat;background-attachment:fixed;`
      : 'background-color:#f5f5f5;'
  },
  link: siteConfig.value.favicon
    ? [{ rel: 'icon', type: 'image/x-icon', href: siteConfig.value.favicon }]
    : []
}))

// 已登录则跳转后台：
// - SSR 阶段用 cookie 预检，服务端等待不影响首屏；
// - 客户端放到 onMounted 里非阻塞执行，避免路由到登录页时因 await 接口而短暂空白。
if (import.meta.server) {
  const headers = useRequestHeaders(['cookie'])
  const isAuthenticated = await $fetch<boolean>('/api/auth/verify', { headers }).catch(() => false)
  if (isAuthenticated) {
    await navigateTo('/admin')
  }
}

onMounted(async () => {
  try {
    if (await $fetch<boolean>('/api/auth/verify')) {
      await navigateTo('/admin')
    }
  } catch {
    // 校验失败按未登录处理
  }
})

// State
const password = ref('')
const loading = ref(false)
const error = ref('')

// Methods
const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value }
    })

    if (response?.success) {
      // token 由服务端写入 httpOnly cookie，前端不保存任何凭证
      await navigateTo('/admin')
    } else {
      error.value = '登录失败，请检查密码'
    }
  } catch (err: any) {
    error.value =
      err.data?.message || err.data?.statusMessage || err.statusMessage || '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.login-form {
  width: 90%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-form .form-control {
  width: 100%;
  height: auto;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  background: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
}

.login-form .btn {
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #007bff;
  border: none;
  transition: all 0.3s ease;
}

.login-form .btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.login-title {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 500;
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  border-color: #80bdff;
}

.btn-block {
  width: 100%;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>
