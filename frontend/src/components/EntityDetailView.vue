<!-- components/EntityDetailView.vue -->
<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content detail-modal">
      <div class="modal-header">
        <h2>{{ displayName }}</h2>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <!-- Main Entity Details -->
      <div class="entity-details">
        <h3>{{ entityDisplayName }} Information</h3>
        <div class="details-grid">
          <div v-for="(value, key) in mainFields" :key="key" class="detail-item">
            <strong>{{ formatKey(key) }}:</strong>
            <span>{{ formatValue(value) }}</span>
          </div>
        </div>
      </div>

      <!-- Related Array Data -->
      <div v-if="hasArrayData" class="array-section">
        <div class="section-header">
          <h3>{{ arrayTitle }}</h3>
          <button v-if="!showingAllArrayData" @click="loadMoreArrayData" class="btn btn-secondary btn-small">
            Load More
          </button>
        </div>
        
        <div v-if="arrayLoading" class="loading-small">
          Loading array data...
        </div>
        
        <div v-else-if="arrayError" class="error-small">
          {{ arrayError }}
        </div>
        
        <div v-else-if="arrayData.length > 0" class="array-table-container">
          <table class="array-table">
            <thead>
              <tr>
                <th v-for="column in arrayColumns" :key="column">
                  {{ formatKey(column) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in arrayData" :key="row.id || row.gb_acc || row.id_ref">
                <td v-for="column in arrayColumns" :key="column">
                  {{ formatValue(row[column]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="empty-array">
          No array data available
        </div>
      </div>

      <!-- Series Samples (for series entity) -->
      <div v-if="entity === 'series'" class="samples-section">
        <div class="section-header">
          <h3>Associated Samples</h3>
        </div>
        
        <div v-if="samplesLoading" class="loading-small">
          Loading samples...
        </div>
        
        <div v-else-if="samplesError" class="error-small">
          {{ samplesError }}
        </div>
        
        <div v-else-if="samplesData.length > 0" class="samples-list">
          <div v-for="sample in samplesData" :key="sample.sample_ID" class="sample-item">
            <h4>{{ sample.title || sample.sample_ID }}</h4>
            <p><strong>ID:</strong> {{ sample.sample_ID }}</p>
            <p v-if="sample.organism"><strong>Organism:</strong> {{ sample.organism }}</p>
            <p v-if="sample.source_name"><strong>Source:</strong> {{ sample.source_name }}</p>
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button @click="$emit('close')" class="btn btn-secondary">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import * as api from '../api.js'

export default {
  name: 'EntityDetailView',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({})
    },
    entity: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup(props) {
    const arrayData = ref([])
    const arrayLoading = ref(false)
    const arrayError = ref('')
    const showingAllArrayData = ref(false)
    
    const samplesData = ref([])
    const samplesLoading = ref(false)
    const samplesError = ref('')

    const displayName = computed(() => {
      return props.item.title || 
             props.item.name || 
             `${props.entity.charAt(0).toUpperCase() + props.entity.slice(1)} #${getIdField()}`
    })

    const entityDisplayName = computed(() => {
      return props.entity.charAt(0).toUpperCase() + props.entity.slice(1)
    })

    const hasArrayData = computed(() => {
      return props.entity === 'platform' || props.entity === 'sample'
    })

    const arrayTitle = computed(() => {
      switch(props.entity) {
        case 'platform': return 'Platform Array Data'
        case 'sample': return 'Sample Expression Data'
        default: return 'Array Data'
      }
    })

    const arrayColumns = computed(() => {
      switch(props.entity) {
        case 'platform': return ['gb_acc', 'spot_id', 'gene_symbol', 'gene_title', 'entrez_gene_id']
        case 'sample': return ['id_ref', 'value', 'abs_call', 'detection_p_value']
        default: return []
      }
    })

    const mainFields = computed(() => {
      const excluded = ['created_at', 'updated_at']
      const filtered = {}
      
      Object.keys(props.item).forEach(key => {
        if (!excluded.includes(key)) {
          filtered[key] = props.item[key]
        }
      })
      
      return filtered
    })

    const getIdField = () => {
      switch(props.entity) {
        case 'platform': return props.item.platform_ID
        case 'sample': return props.item.sample_ID  
        case 'series': return props.item.series_ID
        default: return props.item.id
      }
    }

    const loadArrayData = async () => {
      if (!hasArrayData.value) return
      
      arrayLoading.value = true
      arrayError.value = ''
      
      try {
        let response
        const id = getIdField()
        
        if (props.entity === 'platform') {
          response = await api.getPlatformArray(id)
        } else if (props.entity === 'sample') {
          response = await api.getExpressionOfSample(id)
        }
        
        arrayData.value = (response.data || []).slice(0, 5) // Show first 5 entries
      } catch (err) {
        arrayError.value = `Failed to load array data: ${err.message}`
      } finally {
        arrayLoading.value = false
      }
    }

    const loadMoreArrayData = async () => {
      arrayLoading.value = true
      
      try {
        let response
        const id = getIdField()
        
        if (props.entity === 'platform') {
          response = await api.getPlatformArray(id)
        } else if (props.entity === 'sample') {
          response = await api.getExpressionOfSample(id)
        }
        
        arrayData.value = response.data || []
        showingAllArrayData.value = true
      } catch (err) {
        arrayError.value = `Failed to load more data: ${err.message}`
      } finally {
        arrayLoading.value = false
      }
    }

    const loadSeriesSamples = async () => {
      if (props.entity !== 'series') return
      
      samplesLoading.value = true
      samplesError.value = ''
      
      try {
        const id = getIdField()
        const response = await api.getSamplesOfSeries(id)
        samplesData.value = response.data || []
      } catch (err) {
        samplesError.value = `Failed to load samples: ${err.message}`
      } finally {
        samplesLoading.value = false
      }
    }

    const formatKey = (key) => {
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')
    }

    const formatValue = (value) => {
      if (value === null || value === undefined) {
        return 'N/A'
      }
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2)
      }
      if (typeof value === 'string' && value.length > 100) {
        return value.substring(0, 100) + '...'
      }
      return String(value)
    }

    // Watch for when modal opens to load data
    watch(() => props.show, (isVisible) => {
      if (isVisible && Object.keys(props.item).length > 0) {
        loadArrayData()
        loadSeriesSamples()
        showingAllArrayData.value = false
      }
    })

    return {
      arrayData,
      arrayLoading,
      arrayError,
      showingAllArrayData,
      samplesData,
      samplesLoading,
      samplesError,
      displayName,
      entityDisplayName,
      hasArrayData,
      arrayTitle,
      arrayColumns,
      mainFields,
      loadMoreArrayData,
      formatKey,
      formatValue
    }
  }
}
</script>

<style scoped>
.detail-modal {
  width: 95vw;
  max-width: 1000px;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f7fafc;
}

.entity-details {
  margin-bottom: 2rem;
}

.entity-details h3 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.detail-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f7fafc;
}

.detail-item strong {
  display: inline-block;
  width: 150px;
  color: #4a5568;
}

.array-section, .samples-section {
  margin: 2rem 0;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  color: #2d3748;
  margin: 0;
  font-size: 1.2rem;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.loading-small, .error-small {
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.error-small {
  color: #e53e3e;
  background: #fed7d7;
  border-radius: 4px;
}

.array-table-container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.array-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.array-table th,
.array-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.array-table th {
  background: #f7fafc;
  font-weight: 600;
  color: #2d3748;
}

.array-table tbody tr:hover {
  background: #f7fafc;
}

.empty-array {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.samples-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.sample-item {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.sample-item h4 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
}

.sample-item p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #4a5568;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .samples-list {
    grid-template-columns: 1fr;
  }
  
  .detail-item strong {
    width: 120px;
  }
}
</style>