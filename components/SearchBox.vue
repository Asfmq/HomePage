<template>
  <div id="search-lylme">
    <div class="search-container">
      <div class="search-box">
        <div class="search-input-container">
          <!-- Search engine icon -->
          <div class="search-engine" @click="toggleDropdown">
            <div class="search-engine-icon">
              <IconComponent :icon="currentSearchEngine.icon" />
            </div>
            <div class="search-engine-arrow">
              <IconComponent icon="#icon-up" v-if="showDropdown" />
              <IconComponent icon="#icon-down" v-else />
            </div>
          </div>

          <!-- Search input -->
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="currentSearchEngine.placeholder"
            @keyup.enter="handleSearch"
          />

          <!-- Search button -->
          <button class="search-button" @click="handleSearch">
            <IconComponent icon="#icon-sousuo" />
          </button>
        </div>
      </div>

      <!-- 下拉菜单 -->
      <transition name="dropdown-expand">
        <div v-show="showDropdown" class="search-dropdown">
          <div class="dropdown-content">
            <div
              v-for="engine in searchEngines"
              :key="engine.name"
              class="search-option"
              :class="{ active: currentSearchEngine.name === engine.name }"
              @click="selectSearchEngine(engine)"
            >
              <div class="option-icon">
                <IconComponent :icon="engine.icon" />
              </div>
              <div class="option-name">{{ engine.name }}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { defaultConfig } from '~/utils/config'
import IconComponent from './IconComponent.vue'

const searchQuery = ref('')
const showDropdown = ref(false)

// 从配置中获取搜索引擎数据
const searchEngines = computed(() => defaultConfig.links.searchEngines)

// 当前选中的搜索引擎（默认第一个）
const currentSearchEngine = ref(searchEngines.value[0])

// 切换下拉菜单显示状态
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 选择搜索引擎
const selectSearchEngine = (engine: any) => {
  currentSearchEngine.value = engine
  // 立即收起下拉菜单，不等待动画
  showDropdown.value = false
}

// 执行搜索
const handleSearch = () => {
  let searchUrl = currentSearchEngine.value.url

  // 如果有输入文本，进行搜索
  if (searchQuery.value.trim()) {
    // 检查URL是否已经包含参数
    if (searchUrl.includes('?')) {
      // 如果已经有参数，添加&参数
      searchUrl += encodeURIComponent(searchQuery.value.trim())
    } else {
      // 如果没有参数，添加?参数
      searchUrl += encodeURIComponent(searchQuery.value.trim())
    }
  } else {
    // 如果没有输入文本，直接跳转到搜索引擎首页
    // 移除URL中的参数部分，只保留域名
    const url = new URL(searchUrl)
    searchUrl = url.origin
  }

  // 在新窗口打开搜索结果
  window.open(searchUrl, '_blank')

  // 清空搜索框
  searchQuery.value = ''
}

</script>

<style scoped>
#search-lylme {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.search-container {
  position: relative;
  /* background: rgba(255, 255, 255, 0.95); */
  border-radius: 25px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  overflow: visible !important;
  /* border: 2px solid blue; 调试用边框 */
}

.search-box {
  display: flex;
  align-items: center;
  padding: 8px;
  position: relative;
  z-index: 1;
}

.search-input-container {
  flex: 1;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  height: 60px;
  border-radius: 20px;
  padding: 0 16px 0 16px;
  position: relative;
}

.search-engine {
  display: flex;
  align-items: center;
  margin-right: 12px;
  cursor: pointer;
  position: relative;
}

.search-engine-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgb(255, 255, 255);
  margin-right: 6px;
}

.search-engine-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.search-engine-arrow {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: #333;
  padding: 12px 0;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #4a91e200;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-left: 8px;
}

.search-button:hover {
  /* background: #357abd; */
  transform: scale(1.05);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .search-box {
    padding: 6px;
  }

  .search-input-container {
    padding: 0 12px 0 12px;
  }

  .search-engine-icon {
    width: 28px;
    height: 28px;
  }

  .search-button {
    width: 32px;
    height: 32px;
    margin-left: 6px;
  }

  .search-input {
    font-size: 14px;
    padding: 10px 0;
  }
}
</style>

<style>
/* 下拉菜单展开动画 */
.dropdown-enter-active {
  /* transition: all 0.1s ease; */
  overflow: hidden;
}

.dropdown-leave-active {
  /* transition: all 0.15s ease; */
  overflow: hidden;
}

.dropdown-enter-from,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
}

.search-dropdown {
  background: rgba(255, 255, 255, 0);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  backdrop-filter: blur(10px);
  overflow: hidden;
  margin-top: 12px;
  /* animation: dropdownSlideIn 0.1s ease-out; */
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
}

.search-option {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  /* transition: all 0.1s ease; */
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  min-width: 0;
}

.search-option:hover {
  background: rgba(74, 144, 226, 0.1);
  border-color: rgba(74, 144, 226, 0.2);
}

.search-option.active {
  background: rgb(255, 255, 255);
  border-color: rgba(74, 144, 226, 0.3);
}

.option-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  flex-shrink: 0;
}

.option-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.option-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}
</style>