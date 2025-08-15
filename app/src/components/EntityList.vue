<!-- components/EntityList.vue -->
<template>
  <div class="list-view">
    <div class="list-header">
      <h2>{{ entityDisplayName }}s</h2>
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
        :key="item.id"
        :item="item"
        :entity="entity"
        @view="viewItem"
        @edit="editItem"
        @delete="deleteItem"
      />
      
      <div v-if="items.length === 0" class="empty-state">
        No {{ entity }}s found. Create your first one!
      </div>
    </div>

    <!-- Create/Edit Form Modal -->
    <EntityFormModal
      :show="showCreateForm || showEditForm"
      :entity="entity"
      :is-edit="showEditForm"
      :form-data="formData"
      @submit="submitForm"
      @cancel="cancelForm"
    />

    <!-- View Details Modal -->
    <EntityDetailView
      :show="showViewModal"
      :item="selectedItem"
      :entity="entity"
      @close="showViewModal = false"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import * as api from '../api.js'
import EntityItem from './EntityItem.vue'
import EntityFormModal from './EntityFormModal.vue'
import EntityDetailView from './EntityDetailView.vue'

export default {
  name: 'EntityList',
  components: {
    EntityItem,
    EntityFormModal,
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

    const entityDisplayName = computed(() => {
      return props.entity.charAt(0).toUpperCase() + props.entity.slice(1)
    })

    const loadData = async () => {
      loading.value = true
      error.value = ''

      try {
        const response = await api.fetchAll(props.entity, { limit: 10 })
        items.value = response.data || []
      } catch (err) {
        error.value = `Failed to load ${props.entity}s: ${err.message}`
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
      if (confirm(`Are you sure you want to delete this ${props.entity}?`)) {
        try {
          await api.deleteOne(props.entity, idField)
          await refreshData()
        } catch (err) {
          error.value = `Failed to delete ${props.entity}: ${err.message}`
        }
      }
    }

    const getIdField = (item) => {
      switch(props.entity) {
        case 'platform': return item.platform_ID
        case 'sample': return item.sample_ID  
        case 'series': return item.series_ID
        default: return item.id
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
          await api.createOne(props.entity, data)
        } else {
          const idField = getIdField(selectedItem.value)
          await api.updateOne(props.entity, idField, data)
        }
        cancelForm()
        await refreshData()
      } catch (err) {
        error.value = `Failed to ${showCreateForm.value ? 'create' : 'update'} ${props.entity}: ${err.message}`
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

    // Load data when component mounts or entity changes
    onMounted(() => {
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
      entityDisplayName,
      refreshData,
      viewItem,
      editItem,
      deleteItem,
      submitForm,
      cancelForm
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