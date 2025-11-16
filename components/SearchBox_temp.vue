<template>
  <div id="search" class="s-search s-curren" v-if="hasSearchEngines">
    <div id="search-list" class="hide-type-list">
      <div class="search-group group-a">
        <div class="search-box">
          <div id="search-lylme">
            <form :action="formAction" method="get" target="_blank" id="super-search-fm" @submit="handleSearch">
              <div
                id="checke-so"
                @click="toggleSearchEngines"
                :aria-expanded="showSearchEngines"
                :aria-label="`当前搜索引擎: ${activeSearchEngine?.name || '选择搜索引擎'}`"
                role="button"
                tabindex="0"
                @keydown.enter.prevent="toggleSearchEngines"
                @keydown.space.prevent="toggleSearchEngines"
              >
                <IconComponent :icon="activeSearchEngine?.icon || '#icon-search'" type="engine" class="lylme" />
                <IconComponent icon="#icon-down" size="16" class="sw" v-show="!showSearchEngines" style="margin: 5px;" />
                <IconComponent icon="#icon-up" size="16" class="sw" v-show="showSearchEngines" style="margin: 5px;" />
              </div>
              <input
                type="text"
                id="search-text"
                v-model="searchQuery"
                :placeholder="activeSearchEngine?.placeholder || '搜索...'"
                @input="handleSearchInput"
                @focus="handleSearchFocus"
                @keydown.down.prevent="focusNextSuggestion"
                @keydown.up.prevent="focusPreviousSuggestion"
                @keydown.esc="hideSuggestions"
                @keydown.enter.prevent="selectFocusedSuggestion"
                @keydown.tab.prevent="handleTabKey"
                autocomplete="off"
                :aria-label="`搜索 ${activeSearchEngine?.name || '引擎'}`"
                :aria-expanded="showSuggestions"
                :aria-owns="showSuggestions ? 'search-suggestions' : undefined"
                :aria-activedescendant="focusedSuggestionIndex >= 0 ? `suggestion-${focusedSuggestionIndex}` : undefined"
                role="combobox"
                ref="searchInput"
              >
              <button
                class="submit"
                id="search-submit"
                type="submit"
                :aria-label="`使用 ${activeSearchEngine?.name || '引擎'} 搜索`"
                title="搜索"
              >
                <IconComponent icon="#icon-sousuo" size="22" style="color: #fff; margin: 0 20px;" />
              </button>
            </form>
          </div>
        </div>

        <!-- Search Engine Selection -->
        <div class="search-engine-dropdown" v-show="showSearchEngines">
          <ul class="search-type" id="chso" role="menu" :aria-label="'搜索引擎选择'">
            <li
              v-for="(engine, index) in searchEngines"
              :key="engine.name"
              :id="`engine-${index}`"
              role="menuitem"
              :class="{ active: activeSearchEngine?.name === engine.name }"
              @click="selectSearchEngine(engine)"
              @keydown.up.prevent="focusPreviousEngine(index)"
              @keydown.down.prevent="focusNextEngine(index)"
              @keydown.enter.prevent="selectSearchEngine(engine)"
              @keydown.esc.prevent="toggleSearchEngines"
              tabindex="-1"
            >
              <IconComponent :icon="engine.icon" type="engine" :size="14" />
              <span>{{ engine.name }}</span>
            </li>
          </ul>
        </div>

        <!-- Search Suggestions -->
        <ul
          v-show="showSuggestions"
          class="search-suggestions"
          id="search-suggestions"
          role="listbox"
          :aria-label="`${searchQuery} 的搜索建议`"
        >
          <li
            v-for="(suggestion, index) in searchSuggestions"
            :key="index"
            :id="`suggestion-${index}`"
            role="option"
            :class="{ 'focused': index === focusedSuggestionIndex }"
            :aria-selected="index === focusedSuggestionIndex"
            @click="selectSuggestion(suggestion)"
            @mouseover="focusedSuggestionIndex = index"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- Empty state when no search engines are available -->
  <div v-else class="search-empty-state">
    <IconComponent icon="#icon-search" size="32" />
    <p>暂无可用的搜索引擎</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
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
const currentSearchEngine = ref<SearchEngine>(
  props.initialEngine ||
  (props.searchEngines && props.searchEngines.length > 0 ? props.searchEngines[0] : null)
)
const showSearchEngines = ref(false)
const showSuggestions = ref(false)
const searchSuggestions = ref<string[]>([])
const searchTimeout = ref<NodeJS.Timeout | null>(null)
const searchInput = ref<HTMLInputElement>()
const focusedSuggestionIndex = ref(-1)
const focusedEngineIndex = ref(-1)

// Computed
const activeSearchEngine = computed(() => {
  if (currentSearchEngine.value) {
    return currentSearchEngine.value
  }

  if (props.searchEngines && props.searchEngines.length > 0) {
    return props.searchEngines[0]
  }

  return null
})

const formAction = computed(() => {
  return activeSearchEngine.value?.url || '#'
})

const hasSearchEngines = computed(() => {
  return props.searchEngines && props.searchEngines.length > 0
})

// Methods
const toggleSearchEngines = () => {
  showSearchEngines.value = !showSearchEngines.value
  if (showSearchEngines.value) {
    showSuggestions.value = false
    // Set focus to first engine when dropdown opens
    nextTick(() => {
      const currentEngineIndex = props.searchEngines.findIndex(
        engine => engine.name === activeSearchEngine.value?.name
      )
      if (currentEngineIndex >= 0) {
        focusedEngineIndex.value = currentEngineIndex
        document.getElementById(`engine-${currentEngineIndex}`)?.focus()
      }
    })
  }
}

const selectSearchEngine = (engine: SearchEngine) => {
  currentSearchEngine.value = engine
  showSearchEngines.value = false

  // Focus input
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })
}

const buildSearchUrl = (engine: SearchEngine, query: string): string => {
  const baseUrl = engine.url

  // Check if URL already has a parameter (ends with = or & or ?)
  if (baseUrl.endsWith('=')) {
    return baseUrl + encodeURIComponent(query)
  }

  // Check if URL has parameters
  if (baseUrl.includes('?')) {
    if (baseUrl.endsWith('&')) {
      return baseUrl + encodeURIComponent(query)
    } else {
      return baseUrl + '&' + (engine.name === '翻译' ? 'text=' : 'q=') + encodeURIComponent(query)
    }
  }

  // No parameters, add them
  const paramName = engine.name === '翻译' ? 'text' : 'q'
  return baseUrl + '?' + paramName + '=' + encodeURIComponent(query)
}

const handleSearch = (event: Event) => {
  event.preventDefault()
  const query = searchQuery.value.trim()
  const engine = activeSearchEngine.value

  // If there's a focused suggestion, use it instead
  if (focusedSuggestionIndex.value >= 0 && searchSuggestions.value[focusedSuggestionIndex.value]) {
    const suggestion = searchSuggestions.value[focusedSuggestionIndex.value]
    if (suggestion.trim() && engine?.url) {
      const searchUrl = buildSearchUrl(engine, suggestion.trim())
      window.open(searchUrl, '_blank')
      emit('search', suggestion.trim(), engine)
    }
    return
  }

  if (query && engine?.url) {
    const searchUrl = buildSearchUrl(engine, query)
    window.open(searchUrl, '_blank')
    emit('search', query, engine)
  }
}

const handleSearchInput = () => {
  // Debounce search suggestions
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
    searchTimeout.value = null
  }

  const trimmedQuery = searchQuery.value.trim()
  if (trimmedQuery && trimmedQuery.length >= 2) {
    // Only fetch suggestions for queries with at least 2 characters
    searchTimeout.value = setTimeout(() => {
      fetchSearchSuggestions(trimmedQuery)
    }, 300)
  } else {
    hideSuggestions()
  }
}

const handleSearchFocus = () => {
  const trimmedQuery = searchQuery.value.trim()
  if (trimmedQuery && trimmedQuery.length >= 2) {
    fetchSearchSuggestions(trimmedQuery)
  }
}

const hideSuggestions = () => {
  showSuggestions.value = false
  searchSuggestions.value = []
  focusedSuggestionIndex.value = -1
}

const focusNextSuggestion = () => {
  if (showSuggestions.value && searchSuggestions.value.length > 0) {
    focusedSuggestionIndex.value = (focusedSuggestionIndex.value + 1) % searchSuggestions.value.length
  }
}

const focusPreviousSuggestion = () => {
  if (showSuggestions.value && searchSuggestions.value.length > 0) {
    focusedSuggestionIndex.value = focusedSuggestionIndex.value <= 0
      ? searchSuggestions.value.length - 1
      : focusedSuggestionIndex.value - 1
  }
}

const handleTabKey = (event: KeyboardEvent) => {
  if (event.shiftKey) {
    // Shift+Tab: Move to search engine selector if visible
    if (showSearchEngines.value) {
      event.preventDefault()
      document.getElementById('checke-so')?.focus()
    }
  } else {
    // Tab: Move to search submit button
    event.preventDefault()
    document.getElementById('search-submit')?.focus()
  }
}

const focusNextEngine = (currentIndex: number) => {
  const nextIndex = (currentIndex + 1) % props.searchEngines.length
  focusedEngineIndex.value = nextIndex
  nextTick(() => {
    document.getElementById(`engine-${nextIndex}`)?.focus()
  })
}

const focusPreviousEngine = (currentIndex: number) => {
  const prevIndex = currentIndex <= 0 ? props.searchEngines.length - 1 : currentIndex - 1
  focusedEngineIndex.value = prevIndex
  nextTick(() => {
    document.getElementById(`engine-${prevIndex}`)?.focus()
  })
}

const generateSmartSuggestions = (query: string, engineName?: string): string[] => {
  const suggestions = [`${query}`]

  // Common suffixes
  const suffixes = ['教程', '下载', '官网', '使用方法', '是什么', '怎么样']

  // Engine-specific suggestions
  const engineSpecific: Record<string, string[]> = {
    '翻译': [`${query} 翻译成中文`, `${query} 翻译成英文`, `${query} 发音`, `${query} 同义词`],
    '知乎': [`${query} 是什么`, `${query} 怎么样`, `${query} 为什么`],
    'Bilibili': [`${query} 视频`, `${query} 直播`, `${query} 教程视频`],
    '微博': [`${query} 热搜`, `${query} 最新消息`, `${query} 相关话题`],
    'GitHub': [`${query} github`, `${query} 源码`, `${query} 教程 github`]
  }

  // Add common suffixes
  suffixes.slice(0, 4).forEach(suffix => {
    suggestions.push(`${query} ${suffix}`)
  })

  // Add engine-specific suggestions
  const specific = engineSpecific[engineName || '']
  if (specific) {
    specific.slice(0, 2).forEach(suggestion => {
      suggestions.push(suggestion)
    })
  }

  return suggestions.slice(0, 6) // Limit to 6 suggestions
}

const fetchSearchSuggestions = async (query: string) => {
  try {
    // Use localStorage if available, otherwise skip caching
    let cacheKey: string | null = null
    if (typeof localStorage !== 'undefined') {
      cacheKey = `search_suggestions_${query}_${activeSearchEngine.value?.name || 'default'}`

      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          // Use cached data if it's less than 5 minutes old
          if (Date.now() - timestamp < 300000) {
            searchSuggestions.value = data
            showSuggestions.value = true
            return
          }
        }
      } catch (cacheError) {
        console.warn('Cache read failed, generating fresh suggestions:', cacheError)
      }
    }

    // Generate smart suggestions based on query and engine
    const suggestions = generateSmartSuggestions(query, activeSearchEngine.value?.name)

    // Cache the results if localStorage is available
    if (cacheKey) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: suggestions,
          timestamp: Date.now()
        }))
      } catch (cacheError) {
        // Silently fail caching
      }
    }

    searchSuggestions.value = suggestions
    showSuggestions.value = true
  } catch (error) {
    console.error('Failed to fetch search suggestions:', error)
    hideSuggestions()
  }
}

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  hideSuggestions()

  // Trigger search programmatically
  const query = suggestion.trim()
  const engine = activeSearchEngine.value

  if (query && engine?.url) {
    const searchUrl = buildSearchUrl(engine, query)
    window.open(searchUrl, '_blank')
    emit('search', query, engine)
  }
}

const selectFocusedSuggestion = () => {
  if (focusedSuggestionIndex.value >= 0 && searchSuggestions.value[focusedSuggestionIndex.value]) {
    selectSuggestion(searchSuggestions.value[focusedSuggestionIndex.value])
  }
}

const clickOutsideHandler = (event: Event) => {
  const target = event.target as Element
  const searchContainer = document.getElementById('search')
  const suggestionsContainer = document.getElementById('search-suggestions')
  const engineDropdown = document.getElementById('chso')
  const engineButton = document.getElementById('checke-so')

  // Hide suggestions if clicking outside search or suggestions
  if (!searchContainer?.contains(target) && !suggestionsContainer?.contains(target)) {
    hideSuggestions()
  }

  // Hide engine dropdown if clicking outside engine button or dropdown
  if (!engineButton?.contains(target) && !engineDropdown?.contains(target)) {
    showSearchEngines.value = false
  }
}

// Lifecycle
onMounted(() => {
  try {
    // Auto-focus on search input (only on desktop devices)
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      nextTick(() => {
        if (searchInput.value) {
          searchInput.value.focus()
        }
      })
    }

    // Add click outside listener
    document.addEventListener('click', clickOutsideHandler)
  } catch (error) {
    console.warn('Error during SearchBox component mount:', error)
  }
})

onUnmounted(() => {
  try {
    // Clean up event listeners
    document.removeEventListener('click', clickOutsideHandler)

    // Clear timeout
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
      searchTimeout.value = null
    }

    // Reset all reactive state
    searchQuery.value = ''
    hideSuggestions()
    showSearchEngines.value = false
    focusedSuggestionIndex.value = -1
    focusedEngineIndex.value = -1

    // Clear refs
    if (searchInput.value) {
      searchInput.value = null
    }
  } catch (error) {
    console.warn('Error during SearchBox component unmount:', error)
  }
})

// Expose methods for parent component
defineExpose({
  focus: () => {
    try {
      if (searchInput.value) {
        searchInput.value.focus()
      }
    } catch (error) {
      console.warn('Failed to focus search input:', error)
    }
  },
  clear: () => {
    try {
      searchQuery.value = ''
      hideSuggestions()
      showSearchEngines.value = false
      focusedSuggestionIndex.value = -1
    } catch (error) {
      console.warn('Failed to clear search state:', error)
    }
  },
  // Expose state for debugging
  getState: () => ({
    hasQuery: !!searchQuery.value.trim(),
    hasActiveEngine: !!activeSearchEngine.value,
    showSuggestions: showSuggestions.value,
    showSearchEngines: showSearchEngines.value,
    suggestionCount: searchSuggestions.value.length
  })
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

.search-empty-state {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 40px auto;
  padding: 40px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-empty-state p {
  margin: 15px 0 0 0;
  color: #666;
  font-size: 16px;
  font-weight: 500;
}

.search-empty-state svg {
  opacity: 0.6;
  filter: grayscale(50%);
}

#search-list {
  position: relative;
  overflow: visible;
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
  overflow: visible;
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

#checke-so:hover,
#checke-so:focus {
  background: rgba(255, 255, 255, 0.5);
  outline: 2px solid rgba(0, 123, 255, 0.3);
  outline-offset: 2px;
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
  min-height: 44px; /* Minimum touch target size for mobile */
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
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  z-index: 99999;
  overflow: hidden;
  min-width: 300px;
  max-height: 400px;
  border: 3px solid rgba(0, 123, 255, 0.5);
  margin: 0;
  padding: 0;
  animation: dropdownAppear 0.3s ease-out;
}

@keyframes dropdownAppear {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.search-type {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
}

/* Custom scrollbar for webkit browsers */
.search-type::-webkit-scrollbar {
  width: 6px;
}

.search-type::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.search-type::-webkit-scrollbar-thumb {
  background: rgba(0, 123, 255, 0.3);
  border-radius: 3px;
}

.search-type::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 123, 255, 0.5);
}

.search-type li {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  min-height: 44px;
  width: 100%;
  box-sizing: border-box;
}

.search-type li:last-child {
  border-bottom: none;
}

.search-type li:hover,
.search-type li.active,
.search-type li:focus {
  background-color: rgba(0, 123, 255, 0.1);
  outline: 2px solid rgba(0, 123, 255, 0.3);
  outline-offset: -2px;
}

.search-type li svg {
  width: 20px !important;
  height: 20px !important;
  flex-shrink: 0;
  background: red;
  opacity: 0.8;
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
  z-index: 1000;
  margin: 5px 0 0 0;
  padding: 0;
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
}

/* Custom scrollbar for suggestions */
.search-suggestions::-webkit-scrollbar {
  width: 6px;
}

.search-suggestions::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.search-suggestions::-webkit-scrollbar-thumb {
  background: rgba(0, 123, 255, 0.3);
  border-radius: 3px;
}

.search-suggestions::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 123, 255, 0.5);
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

.search-suggestions li:hover,
.search-suggestions li.focused {
  background-color: rgba(0, 123, 255, 0.1);
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
    height: 48px;
    min-height: 48px; /* iOS Safari recommended minimum */
  }

  #checke-so {
    left: 10px;
    padding: 4px 8px;
    min-height: 32px;
    min-width: 32px;
  }

  #search-submit {
    padding: 0 12px;
    min-height: 48px;
    min-width: 48px;
  }

  .search-engine-dropdown {
    max-height: 250px;
    overflow-y: auto;
    max-width: 90vw; /* Prevent overflow on small screens */
  }

  .search-suggestions {
    max-width: 90vw; /* Prevent overflow on small screens */
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  #search {
    max-width: 98%;
    margin: 15px auto;
  }

  #search-text {
    width: calc(100% - 85px);
    font-size: 16px; /* Keep readable size */
    padding: 12px 12px 12px 55px;
    height: 44px;
    min-height: 44px; /* Android recommended minimum */
  }

  #search-lylme {
    border-radius: 12px;
    margin-bottom: 3px;
  }

  #search-submit {
    height: 44px;
    padding: 0 10px;
    min-width: 44px;
  }

  #checke-so {
    left: 8px;
    padding: 3px 6px;
    min-height: 28px;
    min-width: 28px;
  }

  .search-engine-dropdown {
    left: 0;
    right: 0;
    max-height: 200px;
    border-radius: 8px;
    margin-top: 3px;
  }

  .search-suggestions {
    left: 0;
    right: 0;
    border-radius: 8px;
    max-height: 180px;
    margin-top: 3px;
  }

  .search-type li {
    padding: 10px 12px;
    font-size: 14px;
  }

  .search-suggestions li {
    padding: 8px 12px;
    font-size: 14px;
  }
}

/* Ultra small devices */
@media (max-width: 320px) {
  #search {
    max-width: 99%;
  }

  #search-text {
    font-size: 15px;
    padding: 10px 10px 10px 50px;
  }

  #checke-so {
    left: 6px;
    padding: 2px 4px;
    min-height: 24px;
    min-width: 24px;
  }

  #search-submit {
    padding: 0 8px;
    min-width: 40px;
  }
}
</style>