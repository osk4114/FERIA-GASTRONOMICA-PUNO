<template>
  <div 
    @click="$emit('click')"
    :class="[
      'relative cursor-pointer rounded-lg p-6 transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md',
      getColorClasses(color)
    ]"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <div :class="[
          'flex items-center justify-center w-12 h-12 rounded-lg',
          getIconBackground(color)
        ]">
          <component :is="iconComponent" :class="[
            'h-6 w-6',
            getIconColor(color)
          ]" />
        </div>
      </div>
      <div class="ml-4 flex-1">
        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ description }}</p>
      </div>
    </div>
    
    <!-- Hover effect -->
    <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-200 hover:opacity-5" 
         :class="getHoverGradient(color)">
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  UsersIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  StarIcon,
  HeartIcon,
  CheckCircleIcon,
  ServerIcon,
  ShieldCheckIcon,
  ClockIcon,
  CogIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'purple', 'yellow', 'red', 'indigo', 'gray'].includes(value)
  }
})

defineEmits(['click'])

const iconMap = {
  UsersIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  StarIcon,
  HeartIcon,
  CheckCircleIcon,
  ServerIcon,
  ShieldCheckIcon,
  ClockIcon,
  CogIcon,
  PlusIcon,
  EyeIcon
}

const iconComponent = computed(() => {
  return iconMap[props.icon] || CubeIcon
})

const getColorClasses = (color) => {
  const classes = {
    blue: 'bg-blue-50 hover:bg-blue-100',
    green: 'bg-green-50 hover:bg-green-100',
    purple: 'bg-purple-50 hover:bg-purple-100',
    yellow: 'bg-yellow-50 hover:bg-yellow-100',
    red: 'bg-red-50 hover:bg-red-100',
    indigo: 'bg-indigo-50 hover:bg-indigo-100',
    gray: 'bg-gray-50 hover:bg-gray-100'
  }
  return classes[color] || classes.blue
}

const getIconBackground = (color) => {
  const classes = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    indigo: 'bg-indigo-100',
    gray: 'bg-gray-100'
  }
  return classes[color] || classes.blue
}

const getIconColor = (color) => {
  const classes = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600',
    gray: 'text-gray-600'
  }
  return classes[color] || classes.blue
}

const getHoverGradient = (color) => {
  const classes = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
    gray: 'from-gray-500 to-gray-600'
  }
  return classes[color] || classes.blue
}
</script>
