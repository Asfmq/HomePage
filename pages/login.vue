<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2 class="login-title">管理员登录</h2>
      <input
        v-model="password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': error }"
        placeholder="请输入密码"
        required
        autofocus
      >
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
// Redirect if already logged in
const { data: isAuthenticated } = await useFetch('/api/auth/verify')

if (isAuthenticated.value) {
  await navigateTo('/admin')
}

// Load config and set background image
const loadConfig = async () => {
  try {
    const siteConfig = await $fetch('/api/config')
    if (siteConfig?.backgroundImage) {
      document.body.style.backgroundImage = `url(${siteConfig.backgroundImage})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundAttachment = 'fixed'
    } else {
      // Set default background color
      document.body.style.backgroundColor = '#f5f5f5'
    }

    // Set favicon
    if (siteConfig?.favicon) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link')
      link.rel = 'icon'
      link.href = siteConfig.favicon
      document.head.appendChild(link)
    }
  } catch (error) {
    console.error('加载配置失败:', error)
    // Set default background color
    document.body.style.backgroundColor = '#f5f5f5'
  }
}

// Load background image and favicon from config
onMounted(async () => {
  await loadConfig()
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

    if (response?.success && response?.token) {
      // Store token in both localStorage and cookie
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('admin_token', response.token)
      }

      // Set cookie for server-side access
      const cookie = useCookie('admin_token')
      cookie.value = response.token

      // Redirect to admin page
      await navigateTo('/admin')
    } else {
      error.value = '登录失败，请检查密码'
    }
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.statusMessage || '登录失败，请稍后重试'
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