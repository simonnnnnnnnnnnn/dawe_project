<!-- components/EntityForm.vue -->
<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content form-modal">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Edit' : 'Create' }} {{ entityDisplayName }}</h2>
        <button class="close-btn" @click="$emit('cancel')">×</button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <!-- Platform Fields -->
        <template v-if="entity === 'platform'">
          <div class="form-group">
            <label for="platform_ID">Platform ID:</label>
            <input 
              id="platform_ID" 
              v-model="localFormData.platform_ID" 
              type="text" 
              class="form-input" 
              :disabled="isEdit"
              required
            >
          </div>
          <div class="form-group">
            <label for="title">Title:</label>
            <input 
              id="title" 
              v-model="localFormData.title" 
              type="text" 
              class="form-input" 
              required
            >
          </div>
          <div class="form-group">
            <label for="organism">Organism:</label>
            <input 
              id="organism" 
              v-model="localFormData.organism"
              type="text" 
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label for="technology">Technology:</label>
            <input
              id="technology"
              v-model="localFormData.technology"
              type="text"
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label for="descript">Description:</label>
            <textarea
              id="descript"
              v-model="localFormData.descript"
              class="form-input"
              rows="3"
            ></textarea>
          </div>
        </template>

        <!-- Sample Fields -->
        <template v-if="entity === 'sample'">
          <div class="form-group">
            <label for="sample_ID">Sample ID:</label>
            <input 
              id="sample_ID" 
              v-model="localFormData.sample_ID"
              type="text" 
              class="form-input" 
              :disabled="isEdit"
              required
            >
          </div>
          <div class="form-group">
            <label for="title">Title:</label>
            <input 
              id="title" 
              v-model="localFormData.title" 
              type="text" 
              class="form-input" 
              required
            >
          </div>
          <div class="form-group">
            <label for="source_name">Source Name:</label>
            <input 
              id="source_name" 
              v-model="localFormData.source_name"
              type="text" 
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label for="organism">Organism:</label>
            <input 
              id="organism" 
              v-model="localFormData.organism"
              type="text" 
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label for="characteristics">Characteristics (JSON):</label>
            <textarea 
              id="characteristics" 
              v-model="localFormData.characteristics"
              class="form-input"
              rows="2"
              placeholder='{"key": "value"}'
            ></textarea>
          </div>
          <div class="form-group">
            <label for="protocol">Protocol:</label>
            <textarea 
              id="protocol" 
              v-model="localFormData.protocol"
              class="form-input"
              rows="2"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="platform_ID">Platform ID:</label>
            <input 
              id="platform_ID" 
              v-model="localFormData.platform_ID"
              type="text" 
              class="form-input"
              required
            >
          </div>
        </template>

        <!-- Series Fields -->
        <template v-if="entity === 'series'">
          <div class="form-group">
            <label for="series_ID">Series ID:</label>
            <input 
              id="series_ID" 
              v-model="localFormData.series_ID"
              type="text" 
              class="form-input" 
              :disabled="isEdit"
              required
            >
          </div>
          <div class="form-group">
            <label for="title">Title:</label>
            <input 
              id="title" 
              v-model="localFormData.title"
              type="text" 
              class="form-input" 
              required
            >
          </div>
          <div class="form-group">
            <label for="summary">Summary:</label>
            <textarea 
              id="summary" 
              v-model="localFormData.summary"
              class="form-input"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="overall_design">Overall Design:</label>
            <textarea 
              id="overall_design" 
              v-model="localFormData.overall_design"
              class="form-input"
              rows="2"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="supplementary_data_link">Supplementary Data Link:</label>
            <input 
              id="supplementary_data_link" 
              v-model="localFormData.supplementary_data_link"
              type="url" 
              class="form-input"
            >
          </div>
        </template>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ isEdit ? 'Update' : 'Create' }}
          </button>
          <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue'

export default {
  name: 'EntityForm',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    entity: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const localFormData = reactive({
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

    // Watch for changes in formData prop and update local form data
    watch(() => props.formData, (newData) => {
        if (newData && typeof newData === 'object') {
          Object.keys(localFormData).forEach(key => {
            localFormData[key] = newData[key] || ''
          })
        }
    }, { deep: true, immediate: true })

    // Reset form when modal is closed
    watch(() => props.show, (isVisible) => {
        if (!isVisible) {
            Object.keys(localFormData).forEach(key => {
                localFormData[key] = ''
            })
        }
    })

    const handleSubmit = () => {
      // Create clean data object, removing empty fields for updates
      const submitData = {}
      Object.keys(localFormData).forEach(key => {
        const value = localFormData[key]
        if (value !== '' && value !== null && value !== undefined) {
          submitData[key] = value
        }
      })
      
      console.log('Form submission data:', submitData)
      emit('submit', submitData)
    }

    return {
      localFormData,
      entityDisplayName,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.form-modal {
  width: 100%;
  max-width: 500px;
  margin: 1rem;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  margin: 0;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
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

@media (max-width: 768px) {
  .form-modal {
    margin: 0.5rem;
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>