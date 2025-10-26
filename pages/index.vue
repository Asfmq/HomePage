<template>
  <div class="fmq-homepage">
    <header class="header text-center py-4">
      <h1 class="main-title">fmq的主页</h1>
      <div class="datetime">
        <p>当前时间: {{ currentTime }}</p>
        <p>当前日期: {{ currentDate }}</p>
      </div>
    </header>

    <nav class="main-nav text-center mb-4">
      <ul class="nav-links list-inline">
        <li class="list-inline-item">
          <a href="https://home.asfmq.cn/" class="nav-link" target="_blank">主页</a>
        </li>
        <li class="list-inline-item">
          <a href="https://blog.asfmq.cn/" class="nav-link" target="_blank">博客</a>
        </li>
        <li class="list-inline-item">
          <a href="https://github.com/fmq-github" class="nav-link" target="_blank">GitHub</a>
        </li>
        <li class="list-inline-item">
          <a href="https://www.travellings.cn/go.html" class="nav-link" target="_blank">开往</a>
        </li>
        <li class="list-inline-item">
          <a href="https://www.foreverblog.cn/go.html" class="nav-link" target="_blank">十年之约</a>
        </li>
      </ul>
    </nav>

    <section class="search-section text-center mb-5">
      <div class="search-container">
        <div class="search-engine-selector mb-3">
          <select v-model="selectedSearchEngine" class="form-select d-inline-block w-auto">
            <option v-for="engine in searchEngines" :key="engine.name" :value="engine">
              {{ engine.name }}
            </option>
          </select>
        </div>
        <div class="search-input-group">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control d-inline-block search-input"
            :placeholder="selectedSearchEngine.placeholder"
            @keyup.enter="performSearch"
          >
          <button @click="performSearch" class="btn btn-success search-btn">
            搜索
          </button>
        </div>
      </div>
    </section>

    <main class="categories-container">
      <div v-for="category in categories" :key="category.title" class="category-section mb-4">
        <div class="category-card">
          <h2 class="category-title">
            <i :class="category.icon"></i>
            {{ category.title }}
          </h2>
          <div class="links-grid">
            <a
              v-for="link in category.links"
              :key="link.name"
              :href="link.url"
              class="link-item"
              target="_blank"
              :title="link.description || link.name"
            >
              <i :class="link.icon" v-if="link.icon"></i>
              <img
                v-if="link.svg"
                :src="link.svg"
                :alt="link.name"
                class="link-icon"
              >
              <span>{{ link.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer text-center mt-5 py-4">
      <p class="copyright">{{ copyright }}</p>
      <div class="footer-links">
        <a href="https://beian.miit.gov.cn/" target="_blank" class="footer-link">备案号</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 时间相关
const currentTime = ref('')
const currentDate = ref('')

// 搜索相关
const searchQuery = ref('')
const selectedSearchEngine = ref({
  name: 'Google',
  url: 'https://www.google.com/search?q=',
  placeholder: '输入搜索内容...'
})

const searchEngines = [
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    placeholder: '输入搜索内容...'
  },
  {
    name: '百度',
    url: 'https://www.baidu.com/s?wd=',
    placeholder: '输入搜索内容...'
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    placeholder: '输入搜索内容...'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/search?q=',
    placeholder: '搜索GitHub仓库...'
  }
]

// 导航链接数据
const categories = ref([
  {
    title: '常用工具',
    icon: 'fa-solid fa-tools',
    links: [
      { name: 'GitHub', url: 'https://github.com', icon: 'fa-brands fa-github' },
      { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'fa-brands fa-stack-overflow' },
      { name: 'MDN', url: 'https://developer.mozilla.org', icon: 'fa-brands fa-firefox-browser' },
      { name: 'VS Code', url: 'https://code.visualstudio.com', icon: 'fa-solid fa-code' }
    ]
  },
  {
    title: '学习资源',
    icon: 'fa-solid fa-graduation-cap',
    links: [
      { name: 'Vue.js', url: 'https://vuejs.org', icon: 'fa-brands fa-vuejs' },
      { name: 'React', url: 'https://reactjs.org', icon: 'fa-brands fa-react' },
      { name: 'Node.js', url: 'https://nodejs.org', icon: 'fa-brands fa-node-js' },
      { name: 'CSS-Tricks', url: 'https://css-tricks.com', icon: 'fa-brands fa-css3' }
    ]
  },
  {
    title: '设计资源',
    icon: 'fa-solid fa-palette',
    links: [
      { name: 'Dribbble', url: 'https://dribbble.com', icon: 'fa-brands fa-dribbble' },
      { name: 'Behance', url: 'https://behance.net', icon: 'fa-brands fa-behance' },
      { name: 'Figma', url: 'https://figma.com', icon: 'fa-brands fa-figma' },
      { name: 'Unsplash', url: 'https://unsplash.com', icon: 'fa-solid fa-image' }
    ]
  }
])

// 版权信息
const copyright = ref('© 2024 fmq. All rights reserved.')

// 更新时间函数
const updateDateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN')
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 搜索函数
const performSearch = () => {
  if (searchQuery.value.trim()) {
    const searchUrl = selectedSearchEngine.value.url + encodeURIComponent(searchQuery.value)
    window.open(searchUrl, '_blank')
  }
}

// 组件挂载时启动时钟
onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 1000)
})
</script>

<style scoped>
.fmq-homepage {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 1rem;
}

.header {
  margin-bottom: 2rem;
}

.main-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.3); }
  to { text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.5); }
}

.datetime {
  font-size: 1.2rem;
  opacity: 0.9;
}

.datetime p {
  margin: 0.25rem 0;
}

.nav-links {
  padding: 0;
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50px;
  transition: all 0.3s ease;
  display: inline-block;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

.nav-link:hover {
  background: rgba(255,255,255,0.2);
  border-color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  color: white;
  text-decoration: none;
}

.search-section {
  margin: 3rem 0;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-group {
  display: flex;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  background: white;
}

.search-input {
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  flex: 1;
  outline: none;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  border: none;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: linear-gradient(45deg, #45a049, #4CAF50);
  transform: scale(1.05);
}

.categories-container {
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #fff;
  text-align: center;
  font-weight: 600;
}

.category-title i {
  margin-right: 0.5rem;
  color: #ffd700;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.link-item {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 1rem;
  background: rgba(255,255,255,0.15);
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255,255,255,0.1);
}

.link-item:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  color: white;
  text-decoration: none;
}

.link-item i {
  margin-right: 0.75rem;
  font-size: 1.2rem;
  color: #ffd700;
}

.link-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  filter: brightness(0) invert(1);
}

.footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.3);
  opacity: 0.8;
}

.copyright {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.footer-link {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  margin: 0 1rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: white;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }

  .nav-link {
    display: block;
    margin: 0.5rem 0;
    text-align: center;
  }

  .search-input-group {
    flex-direction: column;
    border-radius: 15px;
  }

  .search-btn {
    border-radius: 0 0 15px 15px;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>