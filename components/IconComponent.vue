<template>
  <component
    :is="iconComponent"
    v-bind="memoizedIconProps"
    :class="iconClass"
    :style="iconStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string | null
  type?: 'svg' | 'img' | 'engine' | 'link' | 'title'
  size?: string | number
  class?: string
  style?: Record<string, any>
  loading?: 'lazy' | 'eager'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'svg',
  size: 20,
  class: '',
  style: () => ({}),
  loading: 'lazy'
})

const iconComponent = computed(() => {
  if (!props.icon) return null

  if (props.icon.startsWith('<svg')) {
    return 'div'
  }

  if (props.icon.startsWith('#')) {
    return 'svg'
  }

  if (props.icon.startsWith('http') || props.icon.startsWith('/')) {
    return 'img'
  }

  return null
})

// Memoize icon props to prevent unnecessary recalculations
const memoizedIconProps = computed(() => iconProps.value)

const iconProps = computed(() => {
  if (!props.icon) return {}

  if (props.icon.startsWith('<svg')) {
    return {
      innerHTML: props.icon,
      class: ['svg-icon', props.class].filter(Boolean).join(' ')
    }
  }

  if (props.icon.startsWith('#')) {
    return {
      class: ['icon', 'aria-hidden', 'true', props.class].filter(Boolean).join(' ')
    }
  }

  if (props.icon.startsWith('http') || props.icon.startsWith('/')) {
    const altText = props.type === 'engine' ? 'Search engine' :
                  props.type === 'link' ? 'Link' :
                  props.type === 'title' ? 'Category' : 'Icon'
    return {
      src: props.icon,
      alt: altText,
      class: [`${props.type}-icon`, props.class].filter(Boolean).join(' '),
      loading: props.loading
    }
  }

  return {}
})

const iconClass = computed(() => {
  const classes: string[] = []

  // Add size class if numeric size is provided
  if (typeof props.size === 'number') {
    classes.push(`icon-size-${props.size}`)
  } else if (typeof props.size === 'string') {
    classes.push(`icon-${props.size}`)
  }

  return classes.join(' ')
})

const iconStyle = computed(() => {
  const style: Record<string, any> = {}

  // Add size style if needed
  if (props.size && (props.iconComponent === 'img' || props.iconComponent === 'svg')) {
    style.width = typeof props.size === 'string' ? props.size : `${props.size}px`
    style.height = typeof props.size === 'string' ? props.size : `${props.size}px`
  }

  if (props.iconComponent === 'img') {
    style.objectFit = 'contain'
  }

  // Merge custom styles
  return { ...style, ...props.style }
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
}

.icon {
  display: inline-block;
  fill: currentColor;
}

.engine-icon,
.link-icon {
  display: inline-block;
  object-fit: contain;
}

/* Common icon sizes */
.icon-size-16 { width: 16px; height: 16px; }
.icon-size-20 { width: 20px; height: 20px; }
.icon-size-24 { width: 24px; height: 24px; }
.icon-size-32 { width: 32px; height: 32px; }
.icon-size-45 { width: 45px; height: 45px; }
.icon-size-14 { width: 14px; height: 14px; }
</style>