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
                <th v-for="col in arrayColumns" :key="col">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in arrayData" :key="row.id || row[0]">
                <td v-for="col in arrayColumns" :key="col">{{ row[col] }}</td>
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
          </div>
        </div>
        
        <div v-else class="empty-array">
          No samples available
        </div>
      </div>

      <!-- Dataset profiles -->
      <div v-if="entity === 'dataset'" class="profiles-section">
        <div class="section-header">
          <h3>Dataset Profiles</h3>
        </div>

        <div v-if="profilesLoading" class="loading-small">
          Loading profiles...
        </div>

        <div v-else-if="profilesError" class="error-small">
          {{ profilesError }}
        </div>

        <div v-else-if="profilesData.length > 0" class="profiles-list">
          <div v-for="profile in profilesData" :key="profile.profile_ID" class="profile-item">
            <h4>{{ profile.title || profile.profile_ID }}</h4>
            <p><strong>ID:</strong> {{ profile.profile_ID }}</p>
            <p v-if="profile.organism"><strong>Organism:</strong> {{ profile.organism }}</p>
          </div>
        </div>
        
        <div v-else class="empty-array">
          No profiles available
        </div>
      </div>

      <!-- Platform samples -->
      <div v-if="entity === 'platform'" class="platforms-section">
        <div class="section-header">
          <h3>Platform Samples</h3>
        </div>

        <div v-if="platformsamplesLoading" class="loading-small">
          Loading samples...
        </div>

        <div v-else-if="platformsamplesError" class="error-small">
          {{ platformsamplesError }}
        </div>

        <div v-else-if="platformsamplesData.length > 0" class="platforms-list">
          <div v-for="platformsample in platformsamplesData" :key="platformsample.sample_ID" class="platform-item">
            <h4>{{ platformsample.title || platformsample.sample_ID }}</h4>
            <p><strong>ID:</strong> {{ platformsample.sample_ID }}</p>
            <p v-if="platformsample.organism"><strong>Organism:</strong> {{ platformsample.organism }}</p>
          </div>
        </div>
        
        <div v-else class="empty-array">
          No samples available
        </div>
      </div>

      <!-- Series of Sample -->
      <div v-if="entity === 'sample'" class="samples-section">
        <div class="section-header">
          <h3>Series associated with Sample</h3>
        </div>

        <div v-if="sampleseriesLoading" class="loading-small">
          Loading samples...
        </div>

        <div v-else-if="sampleseriesError" class="error-small">
          {{ sampleseriesError }}
        </div>

        <div v-else-if="sampleseriesData.length > 0" class="samples-list">
          <div v-for="sampleseries in sampleseriesData" :key="sampleseries.series_ID" class="sample-item">
            <h4>{{ sampleseries.title || sampleseries.series_ID }}</h4>
            <p><strong>ID:</strong> {{ sampleseries.series_ID }}</p>
            <p v-if="sampleseries.organism"><strong>Organism:</strong> {{ sampleseries.organism }}</p>
          </div>
        </div>
        
        <div v-else class="empty-array">
          No series available
        </div>
      </div>
      
      <div class="modal-actions">
        <button @click="$emit('close')" class="btn btn-secondary">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
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
    
    const samplesData = ref([])
    const samplesLoading = ref(false)
    const samplesError = ref('')

    const profilesData = ref([])
    const profilesLoading = ref(false)
    const profilesError = ref('')

    const platformsamplesData = ref([])
    const platformsamplesLoading = ref(false)
    const platformsamplesError = ref('')

    const sampleseriesData = ref([])
    const sampleseriesLoading = ref(false)
    const sampleseriesError = ref('')

    // --- Additional: series published (not stored on dataset) ---
    const seriesPublishedRaw = ref(null)

    const loadSeriesCreatedAt = async () => {
      if (props.entity !== 'dataset') return
      const seriesId = props.item.reference_series
      if (!seriesId) {
        seriesPublishedRaw.value = null
        return
      }
      try {
        const response = await api.fetchOne('series', seriesId)
        const data = (response && response.data) ? response.data : response
        const created = data && (data.created_at || data.createdAt)
        seriesPublishedRaw.value = created ?? null
      } catch (err) {
        seriesPublishedRaw.value = null
      }
    }

    const displayName = computed(() => {
      return props.item.title || 
             props.item.name || 
             `${props.entity.charAt(0).toUpperCase() + props.entity.slice(1)} #${getIdField()}`
    })

    const entityDisplayName = computed(() => {
      return props.entity.charAt(0).toUpperCase() + props.entity.slice(1)
    })

    const hasArrayData = computed(() => {
      return props.entity === 'platform' || props.entity === 'sample' || props.entity === 'profile'
    })

    const arrayTitle = computed(() => {
      switch(props.entity) {
        case 'platform': return 'Platform Array Data'
        case 'sample': return 'Sample Expression Data'
        case 'profile': return 'Profile Expression Data'
        default: return 'Array Data'
      }
    })

    const arrayColumns = computed(() => {
      switch(props.entity) {
        case 'platform': return ['id', 'gb_acc', 'spot_id', 'species_scientific_name', 'annotation_data', 'sequence_type', 'target_description', 'representative_public_id', 'gene_title', 'gene_symbol', 'entrez_gene_id', 'refseq_transcript_id', 'gene_ontology_biological_process', 'gene_ontology_cellular_component', 'gene_ontology_molecular_function']
        case 'sample': return ['id_ref', 'value', 'abs_call', 'detection_p_value']
        case 'profile': return ['profile_array_ID', 'sample_ID', 'title', 'value_number', 'ranking']
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
      
      if (props.entity === 'dataset') {
        filtered['series_published'] = seriesPublishedRaw.value ? String(seriesPublishedRaw.value) : 'not published'
      }

      return filtered
    })

    const getIdField = () => {
      switch(props.entity) {
        case 'platform': return props.item.platform_ID
        case 'sample': return props.item.sample_ID  
        case 'series': return props.item.series_ID
        case 'dataset': return props.item.dataset_ID
        case 'profile': return props.item.profile_ID
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
        } else if (props.entity === 'profile') {
          response = await api.getProfileArraysOfProfile(id)
        }
        
        arrayData.value = response?.data || []
      } catch (err) {
        arrayError.value = `Failed to load array data: ${err.message}`
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
        samplesData.value = response?.data || []
      } catch (err) {
        samplesError.value = `Failed to load samples: ${err.message}`
      } finally {
        samplesLoading.value = false
      }
    }

    const loadDatasetProfiles = async () => {
      if (props.entity !== 'dataset') return
      
      profilesLoading.value = true
      profilesError.value = ''
      
      try {
        const id = getIdField()
        const response = await api.getProfilesOfDataset(id)
        profilesData.value = response?.data || []
      } catch (err) {
        profilesError.value = `Failed to load profiles: ${err.message}`
      } finally {
        profilesLoading.value = false
      }
    }

    const loadPlatformSamples = async () => {
      if (props.entity !== 'platform') return
      
      platformsamplesLoading.value = true
      platformsamplesError.value = ''
      
      try {
        const id = getIdField()
        const response = await api.getSamplesOfPlatform(id)
        platformsamplesData.value = response?.data || []
      } catch (err) {
        platformsamplesError.value = `Failed to load profiles: ${err.message}`
      } finally {
        platformsamplesLoading.value = false
      }
    }

    const loadSampleSeries = async () => {
      if (props.entity !== 'sample') return
      
      sampleseriesLoading.value = true
      sampleseriesError.value = ''
      
      try {
        const id = getIdField()
        const response = await api.getSeriesOfSample(id)
        sampleseriesData.value = response?.data || []
      } catch (err) {
        sampleseriesError.value = `Failed to load profiles: ${err.message}`
      } finally {
        sampleseriesLoading.value = false
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

    // Load all data when modal opens
    const loadAllData = () => {
      if (props.show && Object.keys(props.item).length > 0) {
        // Reset all data
        arrayData.value = []
        samplesData.value = []
        profilesData.value = []
        platformsamplesData.value = []
        sampleseriesData.value = []
        arrayError.value = ''
        samplesError.value = ''
        profilesError.value = ''
        platformsamplesError.value = ''
        sampleseriesError.value = ''
        
        // Load all relevant data
        loadArrayData()
        loadSeriesSamples()
        loadDatasetProfiles()
        loadSeriesCreatedAt()
        loadPlatformSamples()
        loadSampleSeries()
      }
    }

    // Watch for when modal opens or item/entity changes
    watch(() => props.show, (isVisible) => {
      if (isVisible) {
        loadAllData()
      }
    })

    // Also watch for item changes in case it updates while modal is open
    watch(() => props.item, () => {
      if (props.show) {
        loadAllData()
      }
    }, { deep: true })

    // Also watch for entity changes
    watch(() => props.entity, () => {
      if (props.show) {
        loadAllData()
      }
    })

    // Load data immediately if modal is already open
    onMounted(() => {
      if (props.show) {
        loadAllData()
      }
    })

    return {
      arrayData,
      arrayLoading,
      arrayError,
      samplesData,
      samplesLoading,
      samplesError,
      profilesData,
      profilesLoading,
      profilesError,
      platformsamplesData,
      platformsamplesLoading,
      platformsamplesError,
      sampleseriesData,
      sampleseriesLoading,
      sampleseriesError,
      displayName,
      entityDisplayName,
      hasArrayData,
      arrayTitle,
      arrayColumns,
      mainFields,
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

.detail-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.modal-overlay {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
}

.close-btn:hover {
  opacity: 0.7;
}

.entity-details {
  margin: 1rem 0;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem 1rem;
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

.array-section, .samples-section, .profiles-section {
  margin: 2rem 0;
  border-top: 1px solid #edf2f7;
  padding-top: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
  color: #2d3748;
}

.array-table-container {
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.array-table {
  width: 100%;
  border-collapse: collapse;
}

.array-table thead {
  background: #f7fafc;
  position: sticky;
  top: 0;
  z-index: 1;
}

.array-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
  background: #f7fafc;
}

.array-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.array-table tbody tr:hover {
  background: #f7fafc;
}

.samples-list, .profiles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.profile-item, .sample-item {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.profile-item:hover, .sample-item:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.profile-item h4, .sample-item h4 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.profile-item p, .sample-item p {
  margin: 0.25rem 0;
  color: #4a5568;
  font-size: 0.9rem;
}

.loading-small, .error-small, .empty-array {
  padding: 2rem;
  text-align: center;
  color: #718096;
}

.error-small {
  color: #e53e3e;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 4px;
}

.modal-actions {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 700px) {
  .section-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .samples-list, .profiles-list {
    grid-template-columns: 1fr;
  }
  
  .detail-item strong {
    width: 120px;
    font-size: 0.9rem;
  }
  
  .array-table {
    font-size: 0.85rem;
  }
  
  .array-table th, .array-table td {
    padding: 0.5rem;
  }
}
</style>