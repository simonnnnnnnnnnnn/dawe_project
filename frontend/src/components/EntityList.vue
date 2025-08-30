<!-- components/EntityList.vue -->
<template>
  <div class="list-view">
    <div class="list-header">
      <h2>{{ entityDisplayName }}</h2>
      <div class="list-actions">
        <button @click="showCreateForm = true" class="btn btn-primary">
          Create New {{ entityDisplayName }}
        </button>
        <button @click="refreshData" class="btn btn-secondary">
          Refresh
        </button>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error">
      Error: {{ error }}
    </div>

    <!-- Loading Display -->
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <!-- Data List with Pagination -->
    <div v-else class="data-container">
      <!-- Meta Information -->
      <div class="meta">
        Showing {{ items.length }} of {{ total }} — page {{ page + 1 }} / {{ totalPages }}
      </div>

      <!-- Items List -->
      <div class="data-list">
        <EntityItem
          v-for="item in items"
          :key="getItemKey(item)"
          :item="item"
          :entity="normalizedEntity"
          @view="viewItem"
          @edit="editItem"
          @delete="deleteItem"
        />
        
        <div v-if="items.length === 0" class="empty-state">
          No {{ normalizedEntity }} found. Create your first one!
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="page === 0" class="btn btn-pagination">
          Prev
        </button>
        <button @click="nextPage" :disabled="(page + 1) >= totalPages" class="btn btn-pagination">
          Next
        </button>

        <label class="page-goto">
          Page
          <input 
            type="number" 
            v-model.number="goto" 
            min="1" 
            :max="totalPages" 
            class="page-input"
          />
          <button @click="goToInput" class="btn btn-pagination">Go</button>
        </label>

        <label class="per-page">
          Per page:
          <select v-model.number="limit" class="limit-select">
            <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Create/Edit Form Modal -->
    <EntityForm
      :show="showCreateForm || showEditForm"
      :entity="normalizedEntity"
      :isEdit="isEdit"
      :formData="formData"
      :arrayData="arrayData"
      @cancel="closeForm"
      @success="handleFormSuccess"
      @error="handleFormError"
    />

    <!-- View Details Modal -->
    <EntityDetailView
      :show="showViewModal"
      :item="selectedItem"
      :entity="normalizedEntity"
      @close="showViewModal = false"
    />
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import * as api from '../api.js'
import EntityDetailView from './EntityDetailView.vue'
import EntityForm from './EntityForm.vue'
import EntityItem from './EntityItem.vue'
//import { response } from 'express'

export default {
  name: 'EntityList',
  components: {
    EntityItem,
    EntityForm,
    EntityDetailView
  },
  props: {
    entity: {
      type: String,
      required: true
    },
    initialLimit: {
      type: Number,
      default: 10
    }
  },
  emits: ['go-home'],
  setup(props) {
    // Reactive state for pagination
    const items = ref([])
    const total = ref(0)
    const limit = ref(props.initialLimit)
    const page = ref(0) // zero-based page index
    const loading = ref(false)
    const error = ref(null)
    const goto = ref(1)

    // Modal and form state
    const showCreateForm = ref(false)
    const showEditForm = ref(false)
    const showViewModal = ref(false)
    const selectedItem = ref({})
    
    const formData = reactive({
      // Platform fields
      platform_ID: '',
      status_platform: '',
      title: '',
      technology: '',
      distribution_platform: '',
      organism: '',
      manufacturer: '',
      descript: '',
      web_link: '',
      // Sample fields
      sample_ID: '',
      status_sample: '',
      title: '',
      sample_type: '',
      source_name: '',
      organism: '',
      extracted_molecule: '',
      characteristics: '',
      descript: '',
      // Series fields
      series_ID: '',
      status_series: '',
      title: '',
      organism: '',
      experiment_type: '',
      summary: '',
      overall_design: '',
      contributors: '',
      citation: '',
      supplementary_data_link: '',
      // dataset fields
      dataset_ID: '',
      title: '',
      summary: '',
      organism: '',
      platform: '',
      citation: '',
      reference_series: '',
      value_type: '',
      sample_count: null,
      // profile filds
      profile_ID: '',
      title: '',
      annotation: '',
      organism: '',
      dataset_type: ''
    })

    const arrayData = ref([])

    // Computed properties
    const currentOffset = computed(() => page.value * limit.value)

    const totalPages = computed(() => {
      if (!limit.value) return 1
      return Math.max(1, Math.ceil((Number(total.value) || 0) / limit.value))
    })

    // Normalize entity names to singular form
    const normalizedEntity = computed(() => {
      const entityMap = {
        'platforms': 'platform',
        'samples': 'sample',
        'series': 'series',
        'platform': 'platform',
        'sample': 'sample',
        'dataset': 'dataset',
        'datasets': 'dataset',
        'profile': 'profile',
        'profiles': 'profile'
      }
      return entityMap[props.entity.toLowerCase()] || props.entity
    })

    const entityDisplayName = computed(() => {
      const entity = normalizedEntity.value
      return entity.charAt(0).toUpperCase() + entity.slice(1)
    })

    const isEdit = computed(() => showEditForm.value)

    // Helper functions
    const getIdField = (item) => {
      const entity = normalizedEntity.value
      switch(entity) {
        case 'platform': return item.platform_ID
        case 'sample': return item.sample_ID
        case 'series': return item.series_ID
        case 'profile': return item.profile_ID
        case 'dataset': return item.dataset_ID
        default: return item.id
      }
    }

    const getItemKey = (item) => {
      return getIdField(item) || item.id || Math.random()
    }

    // Data loading with pagination
    const loadData = async (p = page.value) => {
      loading.value = true
      error.value = null
      
      try {
        // Clamp page to valid range
        if (p < 0) p = 0
        if (p >= totalPages.value && totalPages.value > 0) p = Math.max(0, totalPages.value - 1)
        page.value = p
        goto.value = page.value + 1

        const params = {
          limit: limit.value,
          offset: currentOffset.value
        }

        console.log(`Loading page ${p + 1} for entity: ${normalizedEntity.value}`, params)
        const response = await api.fetchAll(normalizedEntity.value, params)
        console.log('API Response:', response)

        // Handle different response formats
        if (response && response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
          // Structured response: { total, limit, offset, data }
          items.value = response.data.data
          total.value = Number(response.data.total) || items.value.length
          
          // Sync server-returned paging if provided
          if (response.data.limit) limit.value = Number(response.data.limit)
          if (response.data.offset !== undefined) {
            page.value = Math.floor(Number(response.data.offset || 0) / limit.value)
            goto.value = page.value + 1
          }
        } else if (response && Array.isArray(response.data)) {
          // Simple array response (backward compatibility)
          items.value = response.data
          total.value = response.data.length
        } else {
          items.value = []
          total.value = 0
        }
      } catch (err) {
        console.error('Failed to load data:', err)
        error.value = err?.response?.data?.error || err.message || String(err)
        items.value = []
        total.value = 0
      } finally {
        loading.value = false
      }
    }

    const loadArrayData = async () => {
      try{
        const entity = normalizedEntity.value
        const itemId = getIdField(selectedItem.value)
        if (entity === 'platform'){
          const response = await api.getPlatformArray(itemId)
          arrayData.value = response.data || []
        } else if (entity === 'sample'){
          const response = await api.getSampleArray(itemId)
          arrayData.value = response.data || []
        } else if (entity === 'profile'){
          const response = await api.getProfileArraysOfProfile(itemId)
          arrayData.value = response.data || []
        } else {
          arrayData.value = []
        }
      } catch (err) {
        console.warn('Failed to load array data:', err)
        arrayData.value = []
      }
    }

    // Pagination controls
    const nextPage = () => {
      if ((page.value + 1) < totalPages.value) loadData(page.value + 1)
    }

    const prevPage = () => {
      if (page.value > 0) loadData(page.value - 1)
    }

    const goToInput = () => {
      const target = Math.min(Math.max(1, Number(goto.value || 1)), totalPages.value)
      loadData(target - 1)
    }

    const refreshData = () => {
      loadData(page.value)
    }

    // CRUD operations
    const viewItem = (item) => {
      selectedItem.value = item
      showViewModal.value = true
    }

    const editItem = (item) => {
      console.log('Editing item:', item)
      selectedItem.value = item
      
      // Reset form data
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
      
      // Populate with item data more carefully
      Object.keys(item).forEach(key => {
        if (formData.hasOwnProperty(key)) {
          if (key === 'characteristics'){
            // special handling of json fields as that was the thing causing problems
            if (item[key] === null || item[key] === undefined){
              formData[key] = '';
            }else if (typeof item[key] === 'object'){
              // if already objec, stringify ofr displyaing
              formData[key] = JSON.stringify(item[key], null, 2);
            } else if (typeof item[key] === 'string'){
              try{
                const parsed = JSON.parse(item[key]);
                formData[key] = JSON.stringify(parsed, null, 2);
              } catch (e) {
                formData[key] = item[key]; // fallback to original string if parsing fails
              }
            } else{
              // other types
              formData[key] = String(item[key]);
            }
          } else {
            formData[key] = item[key] || '';
          }
        }
      })
      loadArrayData(item)

      console.log('Form data populated for edit:', formData)
      console.log('array data loaded :', arrayData.value)
      showEditForm.value = true
    }

    const deleteItem = async (item) => {
      console.log('Attempting to delete item:', item)
      const idField = getIdField(item)
      console.log('Using ID field:', idField, 'for entity:', normalizedEntity.value)
      
      if (!idField) {
        error.value = `Cannot delete ${normalizedEntity.value}: No valid ID found`
        return
      }
      
      if (confirm(`Are you sure you want to delete this ${normalizedEntity.value}?`)) {
        try {
          await api.deleteOne(normalizedEntity.value, idField)
          console.log(`Successfully deleted ${normalizedEntity.value} with ID:`, idField)
          await refreshData()
        } catch (err) {
          console.error('Delete error:', err)
          error.value = `Failed to delete ${normalizedEntity.value}: ${err.response?.data?.error || err.message}`
        }
      }
    }

    //neue event handler --> hoffentlich klappts mit denen
    const handleFormSuccess = async (data) => {
      console.log(`${data.entity} saved successfully`)
      closeForm()
      await loadData()
    }

    const handleFormError = (data) => {
      console.error(`Error saving ${data.entity}:`, data.error)
      error.value = `Failed to save ${data.entity}: ${data.error?.response?.data?.error || data.error.message || 'Unknown error'}`
    }

    const closeForm = () => {
      showCreateForm.value = false
      showEditForm.value = false
      selectedItem.value = {}
      arrayData.value = []
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
    }



    // Watchers
    watch(limit, () => loadData(0))
    watch(() => props.entity, () => {
      page.value = 0
      goto.value = 1
      loadData(0)
    })

    // Lifecycle
    onMounted(() => loadData(0))

    return {
      // Data
      items,
      total,
      limit,
      page,
      loading,
      error,
      goto,
      totalPages,
      showCreateForm,
      showEditForm,
      showViewModal,
      selectedItem,
      formData,
      arrayData,
      normalizedEntity,
      entityDisplayName,
      isEdit,
      
      // Methods
      loadData,
      nextPage,
      prevPage,
      goToInput,
      refreshData,
      viewItem,
      editItem,
      deleteItem,
      handleFormError,
      handleFormSuccess,
      closeForm,
      getItemKey
    }
  }
}
</script>

<style scoped>
.list-view {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  font-family: system-ui, sans-serif;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-header h2 {
  margin: 0;
  color: #333;
  flex: 1;
}

.list-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #edf2f7;
}

.btn-pagination {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.btn-pagination:hover:not(:disabled) {
  background: #edf2f7;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.data-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta {
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1rem 0;
  border-top: 1px solid #e2e8f0;
}

.page-goto {
  margin-left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.page-input {
  width: 60px;
  padding: 0.3rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  text-align: center;
}

.per-page {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.limit-select {
  padding: 0.3rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.error {
  color: #e53e3e;
  background: #fed7d7;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.empty-state {
  background: #f7fafc;
  border-radius: 8px;
  color: #4a5568;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .list-actions {
    justify-content: center;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .page-goto,
  .per-page {
    margin: 0;
    justify-content: center;
  }
}
</style>