<template>
  <div class="fmq-homepage" :style="backgroundStyle">
    <!-- SVG图标定义 -->
    <svg style="display: none;" xmlns="http://www.w3.org/2000/svg">
      <symbol id="icon-bing" viewBox="0 0 24 24">
        <path fill="#00809D" d="M12.027 2.506l6.937 2.329c.396.133.695.45.8.855l1.688 6.542a1.145 1.145 0 0 1-.382 1.192l-5.258 4.214a1.153 1.153 0 0 1-1.412 0l-5.258-4.214a1.144 1.144 0 0 1-.382-1.192l1.688-6.542c.105-.405.404-.722.8-.855l6.937-2.329c.278-.093.58-.093.858 0z"/>
        <path fill="#00B4E6" d="M12.843 3.769l5.576 2.116c.286.095.504.325.581.618l1.288 4.991c.077.293-.019.603-.252.804l-4.014 3.221a.828.828 0 0 1-1.016 0L8.992 12.298a.663.663 0 0 1-.252-.804l1.288-4.991c.077-.293.295-.523.581-.618l5.576-2.116c.227-.075.473-.075.7 0z"/>
      </symbol>
      <symbol id="icon-icon_baidulogo" viewBox="0 0 24 24">
        <circle fill="#2932E1" cx="12" cy="12" r="8"/>
        <circle fill="#fff" cx="12" cy="12" r="3"/>
      </symbol>
      <symbol id="icon-sougou" viewBox="0 0 24 24">
        <circle fill="#FB6022" cx="12" cy="12" r="8"/>
        <circle fill="#fff" cx="12" cy="12" r="3"/>
      </symbol>
      <symbol id="icon-zhihu" viewBox="0 0 24 24">
        <circle fill="#0084FE" cx="12" cy="12" r="8"/>
        <path fill="#fff" d="M10 10h4v4h-4z"/>
      </symbol>
      <symbol id="icon-bili" viewBox="0 0 24 24">
        <rect fill="#FB7299" x="4" y="4" width="16" height="16" rx="2"/>
        <circle fill="#fff" cx="9" cy="12" r="1.5"/>
        <circle fill="#fff" cx="15" cy="12" r="1.5"/>
      </symbol>
      <symbol id="icon-weibo" viewBox="0 0 24 24">
        <circle fill="#FF5722" cx="12" cy="12" r="8"/>
        <circle fill="#fff" cx="9" cy="12" r="1.5"/>
        <circle fill="#fff" cx="15" cy="12" r="1.5"/>
      </symbol>
      <symbol id="icon-google00" viewBox="0 0 24 24">
        <circle fill="#4285F4" cx="12" cy="12" r="8"/>
        <path fill="#fff" d="M8 12h8v2H8z"/>
      </symbol>
      <symbol id="icon-fanyi" viewBox="0 0 24 24">
        <circle fill="#0084FE" cx="12" cy="12" r="8"/>
        <path fill="#fff" d="M10 10h4v4h-4z"/>
      </symbol>
    </svg>
    <!-- 顶部导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample05">
        <i class="fa-solid fa-bars"></i>
        <span><i class="fa-solid fa-times"></i></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarsExample05">
        <ul class="navbar-nav mr-auto">
          <li v-for="item in homepageConfig.links.navItems" :key="item.id" class="nav-item">
            <a class="nav-link" :href="item.url" :id="item.id">{{ item.name }}</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="container" style="margin-top:10vh;">
      <!-- 时间显示 -->
      <div id="main">
        <div id="show_time">{{ currentTime }}</div>
        <div id="show_date">{{ currentDate }}</div>
      </div>

      <!-- 搜索框 -->
      <div id="search" class="s-search s-curren">
        <div id="search-list" class="hide-type-list">
          <div class="search-group group-a">
            <div class="search-box">
              <div id="search-lylme">
                <form @submit.prevent="performSearch">
                  <div id="checke-so" @click="toggleEngineList">
                    <svg v-if="selectedSearchEngine.icon && selectedSearchEngine.icon.startsWith('#')" width="18" height="18" style="vertical-align: -0.15em;">
                      <use :href="selectedSearchEngine.icon"></use>
                    </svg>
                    <i v-else class="fa-brands fa-bing"></i>
                    <i class="fa-solid fa-chevron-up sw" v-show="showEngineList"></i>
                    <i class="fa-solid fa-chevron-down sw" v-show="!showEngineList"></i>
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    id="search-text"
                    :placeholder="selectedSearchEngine.placeholder"
                    style="outline:0"
                    autocomplete="off"
                    @keyup.enter="performSearch"
                  >
                  <button class="submit" id="search-submit" type="submit">
                    <i class="fa-solid fa-search" style="width: 22px; height: 22px; margin: 0 20px; color: #fff;"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- 搜索类型选择 -->
        <ul class="search-type" v-show="showEngineList">
          <li v-for="engine in homepageConfig.links.searchEngines" :key="engine.name">
            <input
              type="radio"
              :name="'type'"
              :id="engine.name"
              :value="engine.url"
              v-model="selectedSearchEngineUrl"
              :data-placeholder="engine.placeholder"
              hidden
            >
            <label
              :for="engine.name"
              @click="selectEngine(engine)"
              :style="{ color: engine.color || '#0c498c' }"
            >
              <svg v-if="engine.icon && engine.icon.startsWith('#')" width="14" height="14" style="margin: 0 5px 0 8px; vertical-align: -0.15em;">
                <use :href="engine.icon"></use>
              </svg>
              <img
                v-else-if="engine.icon && !engine.icon.startsWith('#')"
                :src="engine.icon"
                :alt="engine.name"
                style="width: 14px; height: 14px; margin: 0 5px 0 8px; vertical-align: -0.15em;"
              >
              <span style="font-weight:600">{{ engine.name }}</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- 动态生成分类 -->
      <ul class="mylist row">
        <li
          v-for="category in homepageConfig.links.categories"
          :key="category.title"
          class="col-12 col-md-6 col-lg-4 mb-4"
        >
          <h2 class="title">
            <i v-if="category.icon && category.icon.startsWith('#')" class="icon-placeholder"></i>
            <span>{{ category.title }}</span>
          </h2>
          <div class="row">
            <div
              v-for="link in category.links"
              :key="link.name"
              class="lylme-3 col-4 col-sm-3 col-md-4"
            >
              <a :href="link.url" target="_blank" rel="nofollow">
                <i v-if="link.icon && link.icon.startsWith('fa-')" :class="link.icon"></i>
                <img
                  v-else-if="link.icon && !link.icon.startsWith('fa-')"
                  :src="link.icon"
                  :alt="link.name"
                  @error="handleImageError"
                >
                <i v-else class="fa-solid fa-link"></i>
                <span>{{ link.name }}</span>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </main>

    <!-- 底部信息 -->
    <footer class="mt-5 mb-3 footer text-muted text-center">
      <p v-if="homepageConfig.copyright.show" id="copyright">
        Copyright ©{{ homepageConfig.copyright.text}} <a href="/" target="_blank">{{ homepageConfig.copyright.target }}</a>. All Rights Reserved.
        <br v-if="homepageConfig.copyright.showRecord">
        <a :href="homepageConfig.copyright.recordUrl" target="_blank" class="icp">{{ homepageConfig.copyright.record }}</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { homepageConfig } from '~/config/homepage.js'

// 时间相关
const currentTime = ref('')
const currentDate = ref('')

// 搜索相关
const searchQuery = ref('')
const showEngineList = ref(false)
const selectedSearchEngine = ref(homepageConfig.links.searchEngines[0])
const selectedSearchEngineUrl = ref(homepageConfig.links.searchEngines[0].url)

// 背景图片样式
const backgroundStyle = computed(() => ({
  backgroundImage: `url('${homepageConfig.backgroundImage}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed'
}))

// 监听搜索引擎选择变化
watch(selectedSearchEngineUrl, (newUrl) => {
  const engine = homepageConfig.links.searchEngines.find(e => e.url === newUrl)
  if (engine) {
    selectedSearchEngine.value = engine
  }
})

// 切换搜索引擎列表显示
const toggleEngineList = () => {
  showEngineList.value = !showEngineList.value
}

// 选择搜索引擎
const selectEngine = (engine) => {
  selectedSearchEngine.value = engine
  selectedSearchEngineUrl.value = engine.url
  showEngineList.value = false
}

// 搜索函数
const performSearch = () => {
  if (searchQuery.value.trim()) {
    const searchUrl = selectedSearchEngine.value.url + encodeURIComponent(searchQuery.value)
    window.open(searchUrl, '_blank')
  }
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// 设置页面标题
useHead({
  title: homepageConfig.title,
  meta: [
    { name: 'keywords', content: homepageConfig.keywords },
    { name: 'description', content: homepageConfig.description },
    { name: 'author', content: homepageConfig.author }
  ],
  link: [
    { rel: 'icon', href: homepageConfig.favicon }
  ]
})

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

// 组件挂载时启动时钟
onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 1000)
})
</script>

<style scoped>
.fmq-homepage {
  min-height: 100vh;
  background: #95aec5;
  color: white;
  font-size: 14px;
  overflow-x: hidden;
  position: relative;
}

.fmq-homepage::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  z-index: -1;
}

/* 导航栏样式 */
.navbar {
  position: absolute;
  z-index: 10000;
  background: transparent !important;
  padding: 1rem 2rem;
}

.navbar .navbar-toggler {
  color: #fff !important;
  border: none;
}

.navbar .nav-link {
  color: #fff !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.navbar .nav-link:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

/* 时间显示样式 */
#main {
  text-shadow: 0px 0px 3px rgb(0 0 0 / 70%);
  text-align: center;
  color: white;
  font-weight: bold;
}

#show_time {
  font-size: 80px;
  margin-bottom: 1rem;
}

#show_date {
  margin-bottom: 16px;
  font-size: 18px;
  color: #fff;
  text-shadow: 0px 1px 0px #252525;
}

/* 搜索框样式 */
.s-search {
  max-width: 600px;
  margin: 2rem auto;
}

#search-lylme {
  text-align: initial;
  backdrop-filter: saturate(100%) blur(10px);
  border: 0;
  width: 100%;
  margin-bottom: 5px;
  line-height: 50px;
  font-size: 18px;
  color: #222226;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.5);
  transition: 0.3s all linear;
  padding-left: 10px;
  box-shadow: 0px 2px 12px 0px rgb(34 34 38 / 10%);
  position: relative;
}

#search-text {
  border: 0;
  width: 80%;
  font-size: 18px;
  color: #222226;
  background: transparent;
  outline: none;
}

#search-text::placeholder {
  color: #555666;
  font-size: 16px;
}

#search-submit {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: 0;
  width: auto;
  height: 50px;
  border-radius: 0 10px 10px 0;
  outline: none;
  cursor: pointer;
}

#search-submit:hover {
  background-color: rgba(255, 255, 255, 0.342);
}

#checke-so {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
}

#checke-so i {
  font-size: 18px;
  color: #0c498c;
}

.sw {
  margin-left: 5px;
  font-size: 12px;
  color: #0c498c;
}

/* 搜索类型选择器 */
.search-type {
  white-space: nowrap;
  margin: 0;
  padding-left: 0;
  display: block;
  text-align: center;
}

.search-type li {
  margin-bottom: 10px;
  margin-right: 5px;
  display: inline-block;
  background: rgba(255,255,255,0.7);
  height: 50px;
  line-height: 50px;
  list-style: none;
  border-radius: 25px;
  overflow: hidden;
}

.search-type li:hover {
  background: rgba(255,255,255,0.9);
}

.search-type li label {
  display: inline-block;
  padding: 0 11px;
  font-size: 14px;
  border-radius: 3px 3px 0 0;
  margin: 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.search-type input:checked+label,
.search-type input:hover+label {
  background-color: #fff;
  height: 50px;
  border-radius: 25px;
}

.icon-placeholder {
  width: 14px;
  height: 14px;
  margin: 0 5px 0 8px;
  vertical-align: -0.15em;
  display: inline-block;
}

/* 分类样式 */
.mylist {
  width: 100%;
  min-width: auto;
  list-style: none;
  position: relative;
  padding: 0;
  border-radius: 8px;
}

.mylist li.title {
  width: 100%;
  min-width: auto;
  height: 35px;
  text-align: center;
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 1px 1px 8px #504b4b;
  margin-bottom: 1rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.mylist li.title:hover {
  opacity: 1;
}

.mylist li.lylme-3 {
  width: 100px;
  transition: 0.3s all linear;
  font-size: 14px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.mylist li.lylme-3 a {
  width: 100%;
  color: #fff;
  display: block;
  text-align: center;
  padding: 1rem 0.5rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  text-decoration: none;
}

.mylist li.lylme-3 a:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-5px);
  color: white;
  text-decoration: none;
}

.mylist li.lylme-3 i,
.mylist li.lylme-3 img {
  display: block;
  width: 45px;
  height: 45px;
  margin: 0 auto 0.3rem;
  color: #ffd700;
  font-size: 24px;
  text-align: center;
}

.mylist li.lylme-3 img {
  border-radius: 8px;
  object-fit: cover;
}

.mylist li.lylme-3 span {
  width: 100%;
  text-align: center;
  display: block;
  font-size: 12px;
  line-height: 1.2;
}

/* 底部样式 */
.footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.3);
  opacity: 0.8;
}

.footer p {
  color: #fff !important;
  text-shadow: 0px 1px 0px #000;
}

.footer a {
  color: #fff !important;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.icp {
  font-size: 12px;
  text-align: center;
  color: #fff !important;
  text-shadow: 0px 1px 0px #000;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem 1rem;
  }

  #show_time {
    font-size: 60px;
  }

  #show_date {
    font-size: 16px;
  }

  .mylist li.lylme-3 {
    width: 80px;
  }

  .mylist li.lylme-3 i,
  .mylist li.lylme-3 img {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .search-type li {
    margin-bottom: 5px;
    margin-right: 2px;
  }

  .search-type li label {
    padding: 0 8px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  #show_time {
    font-size: 48px;
  }

  .mylist li.lylme-3 {
    width: 70px;
  }

  .mylist li.lylme-3 span {
    font-size: 10px;
  }

  #search-lylme {
    padding-left: 5px;
  }

  #search-text {
    width: 75%;
    font-size: 16px;
  }
}
</style>