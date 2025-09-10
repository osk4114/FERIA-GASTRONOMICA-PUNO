<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Productos</h1>
        <div class="flex items-center space-x-4">
          <!-- Debug info -->
          <div class="text-xs text-gray-500">
            Debug: showCreateForm={{ showCreateForm }} | canCreate={{ canCreateProducts }} | role={{ authStore.userRole }}
          </div>
          <button 
            @click="openCreateForm"
            class="btn-primary"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>
      
      <!-- Lista de productos -->
      <div v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in products"
          :key="product._id"
          class="card hover:shadow-lg transition-shadow duration-200"
        >
          <div class="aspect-w-16 aspect-h-9 mb-4">
            <img
              :src="product.imagen_url || '/placeholder-product.jpg'"
              :alt="product.nombre_producto"
              class="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <h3 class="font-semibold text-lg text-gray-900">{{ product.nombre_producto }}</h3>
              <span class="text-lg font-bold text-primary-600">S/ {{ product.precio }}</span>
            </div>
            
            <p class="text-gray-600 text-sm line-clamp-2">{{ product.descripcion }}</p>
            
            <div class="flex items-center justify-between text-sm">
              <span class="px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                {{ getCategoriaLabel(product.categoria) }}
              </span>
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                product.disponible 
                  ? 'bg-success-100 text-success-700' 
                  : 'bg-error-100 text-error-700'
              ]">
                {{ product.disponible ? 'Disponible' : 'No disponible' }}
              </span>
            </div>
            
            <div class="text-sm text-gray-500">
              <p>Por: {{ product.productor_id?.nombre }}</p>
              <p v-if="product.productor_id?.negocio">{{ product.productor_id.negocio }}</p>
            </div>
            
            <!-- Botones de acción -->
            <div v-if="canEditProduct(product)" class="flex space-x-2 pt-2">
              <button
                @click="editProduct(product)"
                class="btn-secondary text-sm flex-1"
              >
                <PencilIcon class="w-4 h-4 mr-1" />
                Editar
              </button>
              <button
                @click="deleteProduct(product._id)"
                class="btn-error text-sm flex-1"
              >
                <TrashIcon class="w-4 h-4 mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Estado vacío -->
      <div v-else class="card">
        <div class="text-center py-12">
          <CubeIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
          <p class="text-gray-600 mb-4">
            {{ canCreateProducts 
              ? 'Comienza agregando tu primer producto a la feria.' 
              : 'Aún no hay productos registrados en la feria.'
            }}
          </p>
          <button 
            v-if="canCreateProducts"
            @click="showCreateForm = true"
            class="btn-primary"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Crear mi primer producto
          </button>
        </div>
      </div>
    </div>
  </AppLayout>

  <!-- Modal de crear/editar producto -->
  <div
    v-if="showCreateForm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    style="z-index: 999999 !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;"
    @click.self="closeForm"
  >
    <div 
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
      style="z-index: 1000000 !important; position: relative !important;"
      @click.stop
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
          </h2>
          <button
            @click="closeForm"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="submitProduct" class="space-y-6">
          <!-- Información básica -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre del producto *
              </label>
              <input
                v-model="form.nombre_producto"
                type="text"
                required
                class="input-field"
                placeholder="Ej: Cuy chactado"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Precio (S/) *
              </label>
              <input
                v-model.number="form.precio"
                type="number"
                step="0.01"
                min="0"
                required
                class="input-field"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              v-model="form.descripcion"
              required
              rows="3"
              class="input-field"
              placeholder="Describe tu producto..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select v-model="form.categoria" required class="input-field">
                <option value="">Selecciona una categoría</option>
                <option value="plato_principal">Plato Principal</option>
                <option value="entrada">Entrada</option>
                <option value="postre">Postre</option>
                <option value="bebida">Bebida</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Stock inicial
              </label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                class="input-field"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Ingredientes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ingredientes
            </label>
            <div class="space-y-2">
              <div
                v-for="(ingrediente, index) in form.ingredientes"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="form.ingredientes[index]"
                  type="text"
                  class="input-field flex-1"
                  placeholder="Ingrediente"
                />
                <button
                  type="button"
                  @click="removeIngredient(index)"
                  class="text-error-500 hover:text-error-700"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
              <button
                type="button"
                @click="addIngredient"
                class="btn-secondary w-full"
              >
                <PlusIcon class="w-4 h-4 mr-2" />
                Agregar ingrediente
              </button>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de preparación (minutos)
              </label>
              <input
                v-model.number="form.tiempo_preparacion"
                type="number"
                min="1"
                class="input-field"
                placeholder="30"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Calorías (aproximadas)
              </label>
              <input
                v-model.number="form.calorias"
                type="number"
                min="0"
                class="input-field"
                placeholder="250"
              />
            </div>
          </div>

          <!-- Características dietéticas -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Características dietéticas
            </label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label class="flex items-center">
                <input
                  v-model="form.es_vegetariano"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Vegetariano</span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="form.es_vegano"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Vegano</span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="form.contiene_gluten"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Contiene gluten</span>
              </label>
            </div>
          </div>

          <!-- URL de imagen -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              URL de imagen (opcional)
            </label>
            <input
              v-model="form.imagen_url"
              type="url"
              class="input-field"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              @click="closeForm"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              {{ isLoading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import axios from 'axios'
import AppLayout from '@/components/layout/AppLayout.vue'
import { 
  CubeIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const authStore = useAuthStore()
const products = ref([])
const showCreateForm = ref(false)
const editingProduct = ref(null)
const isLoading = ref(false)

// Formulario reactivo
const form = reactive({
  nombre_producto: '',
  descripcion: '',
  precio: '',
  categoria: '',
  ingredientes: [''],
  tiempo_preparacion: '',
  calorias: '',
  es_vegetariano: false,
  es_vegano: false,
  contiene_gluten: false,
  imagen_url: '',
  stock: ''
})

// Computed properties
const canCreateProducts = computed(() => {
  console.log('🔍 Verificando permisos de creación:', {
    userRole: authStore.userRole,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user
  })
  return authStore.isAuthenticated && 
         (authStore.userRole === 'administrador' || 
          authStore.userRole === 'organizador' || 
          authStore.userRole === 'productor')
})

// Funciones del modal
const openCreateForm = () => {
  console.log('🆕 Abriendo formulario de crear producto')
  console.log('🔍 Estado antes:', showCreateForm.value)
  showCreateForm.value = true
  console.log('🔍 Estado después:', showCreateForm.value)
  
  // Verificar después de un tick
  setTimeout(() => {
    console.log('🔍 Estado después de setTimeout:', showCreateForm.value)
    const modal = document.querySelector('.fixed.inset-0.bg-black')
    console.log('🔍 Modal en DOM:', modal)
    if (modal) {
      const styles = window.getComputedStyle(modal)
      console.log('🎨 Modal computed styles:')
      console.log('  - display:', styles.display)
      console.log('  - visibility:', styles.visibility)
      console.log('  - opacity:', styles.opacity)
      console.log('  - z-index:', styles.zIndex)
      console.log('  - position:', styles.position)
      console.log('  - top:', styles.top)
      console.log('  - left:', styles.left)
      console.log('  - width:', styles.width)
      console.log('  - height:', styles.height)
    }
  }, 100)
}

const addIngredient = () => {
  form.ingredientes.push('')
}

const removeIngredient = (index) => {
  if (form.ingredientes.length > 1) {
    form.ingredientes.splice(index, 1)
  }
}

const closeForm = () => {
  showCreateForm.value = false
  editingProduct.value = null
  resetForm()
}

const resetForm = () => {
  Object.keys(form).forEach(key => {
    if (key === 'ingredientes') {
      form[key] = ['']
    } else if (typeof form[key] === 'boolean') {
      form[key] = false
    } else {
      form[key] = ''
    }
  })
}

// Funciones CRUD
const fetchProducts = async () => {
  try {
    console.log('🔄 Fetching products from:', `${API_BASE_URL}/products`)
    const response = await axios.get(`${API_BASE_URL}/products`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    console.log('📦 Products response:', response.data)
    
    // El backend devuelve los productos en response.data.data.products
    products.value = response.data.data?.products || response.data.products || response.data
    console.log('✅ Products set to:', products.value)
    console.log('📊 Number of products:', products.value.length)
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    toast.error('Error al cargar productos')
  }
}

const submitProduct = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    // Filtrar ingredientes vacíos
    const productData = {
      ...form,
      ingredientes: form.ingredientes.filter(ing => ing.trim() !== '')
    }
    
    console.log('💾 Enviando datos del producto:', productData)
    
    let response
    if (editingProduct.value) {
      response = await axios.put(`${API_BASE_URL}/products/${editingProduct.value._id}`, productData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      toast.success('Producto actualizado exitosamente')
    } else {
      response = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      console.log('✅ Producto creado, respuesta:', response.data)
      toast.success('Producto creado exitosamente')
    }
    
    closeForm()
    console.log('🔄 Recargando lista de productos...')
    await fetchProducts()
  } catch (error) {
    console.error('❌ Error submitting product:', error)
    console.error('❌ Error response:', error.response?.data)
    toast.error(error.response?.data?.message || 'Error al guardar producto')
  } finally {
    isLoading.value = false
  }
}

const editProduct = (product) => {
  editingProduct.value = product
  
  // Llenar el formulario con los datos del producto
  Object.keys(form).forEach(key => {
    if (product[key] !== undefined) {
      form[key] = product[key]
    }
  })
  
  // Asegurar que ingredientes es un array
  if (!Array.isArray(form.ingredientes) || form.ingredientes.length === 0) {
    form.ingredientes = ['']
  }
  
  showCreateForm.value = true
}

const deleteProduct = async (productId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    return
  }
  
  try {
    await axios.delete(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    toast.success('Producto eliminado exitosamente')
    await fetchProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
    toast.error('Error al eliminar producto')
  }
}

const canEditProduct = (product) => {
  if (authStore.userRole === 'administrador' || authStore.userRole === 'organizador') {
    return true
  }
  
  if (authStore.userRole === 'productor') {
    return product.productor_id?._id === authStore.user.id || 
           product.productor_id === authStore.user.id
  }
  
  return false
}

const getCategoriaLabel = (categoria) => {
  const labels = {
    plato_principal: 'Plato Principal',
    entrada: 'Entrada',
    postre: 'Postre',
    bebida: 'Bebida',
    snack: 'Snack'
  }
  return labels[categoria] || categoria
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 Products.vue mounted')
  console.log('👤 Auth Store:', {
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.userRole,
    user: authStore.user
  })
  
  await fetchProducts()
})
</script>
