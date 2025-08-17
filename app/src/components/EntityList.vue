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

    <!-- Loading -->
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <!-- Error -->
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <!-- Data List -->
    <div v-if="!loading && !error" class="data-list">
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

    <!-- Create/Edit Form Modal -->
    <EntityForm
      :show="showCreateForm || showEditForm"
      :entity="normalizedEntity"
      :is-edit="showEditForm"
      :form-data="formData"
      @submit="submitForm"
      @cancel="cancelForm"
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
    }
  },
  emits: ['go-home'],
  setup(props) {
    const items = ref([])
    const loading = ref(false)
    const error = ref('')
    const showCreateForm = ref(false)
    const showEditForm = ref(false)
    const showViewModal = ref(false)
    const selectedItem = ref({})
    
    const formData = reactive({
      // Platform fields
      platform_ID: '',
      title: '',
      organism: '',
      technology: '',
      descript: '',
      // Sample fields
      sample_ID: '',
      source_name: '',
      characteristics: '',
      protocol: '',
      // Series fields
      series_ID: '',
      summary: '',
      overall_design: '',
      supplementary_data_link: ''
    })

    // Normalize entity names to singular form
    const normalizedEntity = computed(() => {
      const entityMap = {
        'platforms': 'platform',
        'samples': 'sample',
        'series': 'series',  // same singular/plural
        'platform': 'platform',
        'sample': 'sample'
      }
      return entityMap[props.entity.toLowerCase()] || props.entity
    })

    const entityDisplayName = computed(() => {
      const entity = normalizedEntity.value
      return entity.charAt(0).toUpperCase() + entity.slice(1)
    })

    // Get the correct ID field for each entity type
    const getIdField = (item) => {
      const entity = normalizedEntity.value
      switch(entity) {
        case 'platform': return item.platform_ID
        case 'sample': return item.sample_ID
        case 'series': return item.series_ID
        default: return item.id
      }
    }

    // Get unique key for v-for iteration
    const getItemKey = (item) => {
      return getIdField(item) || item.id || Math.random()
    }

    const loadData = async () => {
      loading.value = true
      error.value = ''

      try {
        console.log(`Loading data for entity: ${props.entity}`)
        const response = await api.fetchAll(normalizedEntity.value, { limit: 10 })
        console.log('API Response:', response)
        items.value = response.data || []
      } catch (err) {
        console.error('Error loading data:', err)
        error.value = `Failed to load ${normalizedEntity.value}: ${err.message}`
      } finally {
        loading.value = false
      }
    }

    const refreshData = () => {
      loadData()
    }

    const viewItem = (item) => {
      selectedItem.value = item
      showViewModal.value = true
    }

    const editItem = (item) => {
      selectedItem.value = item
      // Reset form data
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
      // Populate with item data
      Object.keys(item).forEach(key => {
        if (formData.hasOwnProperty(key)) {
          formData[key] = item[key] || ''
        }
      })
      // Handle JSON fields
      if (item.characteristics && typeof item.characteristics === 'object') {
        formData.characteristics = JSON.stringify(item.characteristics)
      }
      showEditForm.value = true
    }

    const deleteItem = async (item) => {
      const idField = getIdField(item)
      if (confirm(`Are you sure you want to delete this ${normalizedEntity.value}?`)) {
        try {
          await api.deleteOne(normalizedEntity.value, idField)
          await refreshData()
        } catch (err) {
          error.value = `Failed to delete ${normalizedEntity.value}: ${err.message}`
        }
      }
    }

    const submitForm = async (data) => {
      try {
        // Handle JSON parsing for characteristics
        if (data.characteristics) {
          try {
            data.characteristics = JSON.parse(data.characteristics)
          } catch (e) {
            // If parsing fails, keep as string
          }
        }

        if (showCreateForm.value) {
          await api.createOne(normalizedEntity.value, data)
        } else {
          const idField = getIdField(selectedItem.value)
          await api.updateOne(normalizedEntity.value, idField, data)
        }
        cancelForm()
        await refreshData()
      } catch (err) {
        error.value = `Failed to ${showCreateForm.value ? 'create' : 'update'} ${normalizedEntity.value}: ${err.message}`
      }
    }

    const cancelForm = () => {
      showCreateForm.value = false
      showEditForm.value = false
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
      selectedItem.value = {}
    }

    // Load data when component mounts
    onMounted(() => {
      loadData()
    })

    // Watch for entity changes and reload data
    watch(() => props.entity, () => {
      loadData()
    })

    return {
      items,
      loading,
      error,
      showCreateForm,
      showEditForm,
      showViewModal,
      selectedItem,
      formData,
      normalizedEntity,
      entityDisplayName,
      refreshData,
      viewItem,
      editItem,
      deleteItem,
      submitForm,
      cancelForm,
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
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .list-actions {
    justify-content: center;
  }
}
</style>