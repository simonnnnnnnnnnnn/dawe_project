<!-- components/EntityFormModal.vue -->
<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content form-modal">
      <h2>{{ isEdit ? 'Edit' : 'Create' }} {{ entityDisplayName }}</h2>
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
            <select 
              id="technology" 
              v-model="localFormData.technology"
              class="form-input"
            >
              <option value="">Select Technology</option>
              <option value="microarray">Microarray</option>
              <option value="sequencing">Sequencing</option>
              <option value="other">Other</option>
            </select>
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
        Object.keys(localFormData).forEach(key => {
        localFormData[key] = newData[key] || ''
        })
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
      emit('submit', { ...localFormData })
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
.form-modal {
  width: 100%;
  max-width: 500px;
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
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}
</style>