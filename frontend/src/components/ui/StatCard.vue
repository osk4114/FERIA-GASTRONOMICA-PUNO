<template>
  <div class="card">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div :class="[
          'w-12 h-12 rounded-lg flex items-center justify-center',
          colorClasses[color]
        ]">
          <component 
            :is="iconComponent" 
            class="w-6 h-6 text-white"
            v-if="!loading"
          />
          <div 
            v-else
            class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
      </div>
      <div class="ml-4 flex-1">
        <dt class="text-sm font-medium text-gray-500 truncate">
          {{ title }}
        </dt>
        <dd class="mt-1 text-2xl font-semibold text-gray-900">
          <span v-if="!loading">{{ formattedValue }}</span>
          <div v-else class="h-8 bg-gray-200 rounded animate-pulse"></div>
        </dd>
      </div>
    </div>
    
    <!-- Trend indicator (optional) -->
    <div v-if="trend && !loading" class="mt-4 flex items-center">
      <div :class="[
        'flex items-center text-sm',
        trend.direction === 'up' ? 'text-success-600' : 
        trend.direction === 'down' ? 'text-error-600' : 'text-gray-500'
      ]">
        <component 
          :is="trendIcon" 
          class="w-4 h-4 mr-1"
        />
        <span>{{ trend.value }}% desde el mes pasado</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  CubeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'yellow', 'purple', 'red'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  trend: {
    type: Object,
    default: null
    // { direction: 'up|down|neutral', value: number }
  }
})

const iconMap = {
  CubeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UsersIcon
}

const colorClasses = {
  blue: 'bg-primary-600',
  green: 'bg-success-600',
  yellow: 'bg-warning-600',
  purple: 'bg-purple-600',
  red: 'bg-error-600'
}

const iconComponent = computed(() => {
  return iconMap[props.icon] || CubeIcon
})

const trendIcon = computed(() => {
  if (!props.trend) return MinusIcon
  
  switch (props.trend.direction) {
    case 'up':
      return ArrowUpIcon
    case 'down':
      return ArrowDownIcon
    default:
      return MinusIcon
  }
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return new Intl.NumberFormat('es-PE').format(props.value)
  }
  return props.value
})
</script>
