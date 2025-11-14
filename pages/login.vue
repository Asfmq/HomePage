<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>管理员登录</h2>
        <p class="text-muted">请输入管理员密码</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': error }"
            placeholder="请输入管理员密码"
            required
          >
          <div v-if="error" class="invalid-feedback">
            {{ error }}
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm mr-2"></span>
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="login-footer">
        <p class="text-muted small">
          如忘记密码，请联系管理员
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Redirect if already logged in
const { data: isAuthenticated } = await useFetch('/api/auth/verify')

if (isAuthenticated.value) {
  await navigateTo('/admin')
}

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
      // Store token in localStorage
      if (process.client) {
        localStorage.setItem('admin_token', response.token)
      }

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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-form .form-group {
  margin-bottom: 25px;
}

.login-form label {
  color: #555;
  font-weight: 500;
  margin-bottom: 8px;
}

.login-form .form-control {
  height: 50px;
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 0 15px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-form .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  transform: none;
  box-shadow: none;
}

.login-footer {
  text-align: center;
  margin-top: 25px;
}

.spinner-border {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.mr-2 {
  margin-right: 8px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
}
</style>