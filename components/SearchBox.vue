<template>
  <div id="search" class="s-search s-curren">
    <div id="search-list" class="hide-type-list">
      <div class="search-group group-a">
        <div class="search-box">
          <div id="search-lylme">
            <form :action="currentSearchEngine.url" method="get" target="_blank" id="super-search-fm" @submit="handleSearch">
              <div id="checke-so" @click="toggleSearchEngines">
                <IconComponent :icon="currentSearchEngine.icon" type="engine" class="lylme" />
                <IconComponent icon="#icon-up" size="16" class="sw" v-show="!showSearchEngines" style="margin: 5px;" />
                <IconComponent icon="#icon-down" size="16" class="sw" v-show="showSearchEngines" style="margin: 5px;" />
              </div>
              <input
                type="text"
                id="search-text"
                v-model="searchQuery"
                :placeholder="currentSearchEngine.placeholder"
                @input="handleSearchInput"
                @focus="handleSearchFocus"
                autocomplete="off"
                ref="searchInput"
              >
              <button class="submit" id="search-submit" type="submit">
                <IconComponent icon="#icon-sousuo" size="22" style="color: #fff; margin: 0 20px;" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Search Engine Selection -->
      <div class="search-engine-dropdown" v-show="showSearchEngines">
        <ul class="search-type" id="chso">
          <li
            v-for="engine in searchEngines"
            :key="engine.name"
            :class="{ active: currentSearchEngine.name === engine.name }"
            @click="selectSearchEngine(engine)"
          >
            <IconComponent :icon="engine.icon" type="engine" :size="14" />
            <span>{{ engine.name }}</span>
          </li>
        </ul>
      </div>

      <!-- Search Suggestions -->
      <ul v-show="showSuggestions" class="search-suggestions" id="word">
        <li
          v-for="(suggestion, index) in searchSuggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import type { SearchEngine } from '~/types/config'

interface Props {
  searchEngines: SearchEngine[]
  initialEngine?: SearchEngine
}

interface Emits {
  (e: 'search', query: string, engine: SearchEngine): void
}

const props = withDefaults(defineProps<Props>(), {
  initialEngine: undefined
})

const emit = defineEmits<Emits>()

// State
const searchQuery = ref('')
const currentSearchEngine = ref<SearchEngine>(props.initialEngine || props.searchEngines[0])
const showSearchEngines = ref(false)
const showSuggestions = ref(false)
const searchSuggestions = ref<string[]>([])
const searchTimeout = ref<NodeJS.Timeout | null>(null)
const searchInput = ref<HTMLInputElement>()

// Computed - searchEngineIcon was unused, removed

// Methods
const toggleSearchEngines = () => {
  showSearchEngines.value = !showSearchEngines.value
  if (showSearchEngines.value) {
    showSuggestions.value = false
  }
}

const selectSearchEngine = (engine: SearchEngine) => {
  currentSearchEngine.value = engine
  showSearchEngines.value = false

  // Update form action
  const form = document.getElementById('super-search-fm') as HTMLFormElement
  if (form) {
    form.action = engine.url
  }

  // Focus input
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })
}

const handleSearch = (event: Event) => {
  event.preventDefault()
  if (searchQuery.value.trim()) {
    const searchUrl = currentSearchEngine.value.url + encodeURIComponent(searchQuery.value.trim())
    window.open(searchUrl, '_blank')
    emit('search', searchQuery.value.trim(), currentSearchEngine.value)
  }
}

const handleSearchInput = () => {
  // Debounce search suggestions
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  if (searchQuery.value.trim()) {
    searchTimeout.value = setTimeout(() => {
      fetchSearchSuggestions(searchQuery.value.trim())
    }, 300)
  } else {
    hideSuggestions()
  }
}

const handleSearchFocus = () => {
  if (searchQuery.value.trim()) {
    fetchSearchSuggestions(searchQuery.value.trim())
  }
}

const hideSuggestions = () => {
  showSuggestions.value = false
  searchSuggestions.value = []
}

const fetchSearchSuggestions = async (query: string) => {
  try {
    // Debounce and cache search suggestions to improve performance
    const cacheKey = `search_suggestions_${query}`
    const cached = localStorage?.getItem(cacheKey)

    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      // Use cached data if it's less than 5 minutes old
      if (Date.now() - timestamp < 300000) {
        searchSuggestions.value = data
        showSuggestions.value = true
        return
      }
    }

    // Using a simple fallback for now since Baidu API may have CORS issues
    const fallbackSuggestions = [
      `${query} 教程`,
      `${query} 下载`,
      `${query} 官网`,
      `${query} 最新版本`,
      `${query} 使用方法`,
      `${query} 配置`
    ]

    // Cache the results
    localStorage?.setItem(cacheKey, JSON.stringify({
      data: fallbackSuggestions,
      timestamp: Date.now()
    }))

    searchSuggestions.value = fallbackSuggestions
    showSuggestions.value = true
  } catch (error) {
    console.error('Failed to fetch search suggestions:', error)
    hideSuggestions()
  }
}

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  hideSuggestions()

  // Trigger search
  nextTick(() => {
    const form = document.getElementById('super-search-fm') as HTMLFormElement
    if (form) {
      form.requestSubmit()
    }
  })
}

const clickOutsideHandler = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('#search') || !target.closest('#word')) {
    hideSuggestions()
  }
  if (!target.closest('#checke-so') && !target.closest('#chso')) {
    showSearchEngines.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Auto-focus on search input
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })

  // Add click outside listener
  document.addEventListener('click', clickOutsideHandler)
})

onUnmounted(() => {
  document.removeEventListener('click', clickOutsideHandler)
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})

// Expose methods for parent component
defineExpose({
  focus: () => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  },
  clear: () => {
    searchQuery.value = ''
    hideSuggestions()
    showSearchEngines.value = false
  }
})
</script>

<style scoped>
/* Main search container */
#search {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 40px auto;
  position: relative;
}

#search-list {
  position: relative;
  overflow-x: hidden;
}

.search-group {
  margin: 0;
  padding: 0;
}

.search-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Search input container */
#search-lylme {
  text-align: initial;
  backdrop-filter: saturate(100%) blur(10px);
  border: 0;
  width: 100%;
  margin-bottom: 5px;
  font-size: 18px;
  color: #222226;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  box-shadow: 0px 2px 12px 0px rgb(34 34 38 / 10%);
  position: relative;
  overflow: hidden;
}

/* Search form */
#super-search-fm {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
}

/* Engine selector button */
#checke-so {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  background: rgba(255, 255, 255, 0.3);
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 28px;
}

#checke-so:hover {
  background: rgba(255, 255, 255, 0.5);
}

#checke-so .lylme {
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#checke-so .sw {
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

#checke-so .sw svg {
  width: 12px !important;
  height: 12px !important;
}

/* Search input */
#search-text {
  border: 0;
  width: calc(100% - 120px); /* Account for engine selector and submit button */
  font-size: 18px;
  color: #222226;
  background: transparent;
  outline: none;
  padding: 15px 20px 15px 80px; /* Left padding to make room for engine selector */
  height: 50px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

#search-text:focus {
  background: rgba(255, 255, 255, 0.1);
}

#search-text::placeholder {
  color: #555666;
  font-size: 16px;
  opacity: 0.8;
}

#search-text::-webkit-input-placeholder {
  color: #555666;
  font-size: 16px;
  opacity: 0.8;
}

#search-text::-moz-placeholder {
  color: #555666;
  font-size: 16px;
  opacity: 0.8;
}

#search-text:-ms-input-placeholder {
  color: #555666;
  font-size: 16px;
  opacity: 0.8;
}

/* Search submit button */
#search-submit {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 123, 255, 0.1);
  border: 0;
  border-radius: 0 15px 15px 0;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  backdrop-filter: blur(5px);
}

#search-submit:hover {
  background: rgba(0, 123, 255, 0.2);
  transform: translateX(-2px);
}

#search-submit:active {
  transform: translateX(0);
}

#search-submit svg {
  transition: transform 0.2s ease;
}

#search-submit:hover svg {
  transform: scale(1.1);
}

/* Engine dropdown */
.search-engine-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  margin-top: 5px;
}

.search-type {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
}

.search-type li {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.search-type li:last-child {
  border-bottom: none;
}

.search-type li:hover,
.search-type li.active {
  background-color: rgba(0, 123, 255, 0.1);
}

.search-type li svg {
  width: 20px !important;
  height: 20px !important;
  flex-shrink: 0;
}

.search-type span {
  color: #0c498c;
  font-weight: 500;
  font-size: 14px;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
}

.search-suggestions li {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.search-suggestions li:last-child {
  border-bottom: none;
}

.search-suggestions li:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Animation */
.search-engine-dropdown {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  #search {
    max-width: 95%;
    margin: 20px auto;
  }

  #search-text {
    width: calc(100% - 100px);
    font-size: 16px;
    padding: 12px 15px 12px 65px;
    height: 45px;
  }

  #checke-so {
    left: 10px;
    padding: 3px 6px;
  }

  #search-submit {
    padding: 0 12px;
  }

  .search-engine-dropdown {
    max-height: 250px;
    overflow-y: auto;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  #search-text {
    width: calc(100% - 90px);
    font-size: 14px;
    padding: 10px 12px 10px 60px;
    height: 40px;
  }

  #search-lylme {
    border-radius: 12px;
  }

  #search-submit {
    height: 40px;
    padding: 0 10px;
  }

  #checke-so {
    left: 8px;
    padding: 2px 4px;
  }
}
</style>