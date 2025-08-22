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

          <!-- Platform Array Data Section -->
          <div class="array-section">
            <div class="section-header">
              <h3>Platform Array Data</h3>
              <button type="button" @click="addArrayEntry" class="btn btn-secondary btn-small">
                Add Entry
              </button>
            </div>
            
            <div v-if="localArrayData.length > 0" class="array-entries">
              <div v-for="(entry, index) in localArrayData" :key="index" class="array-entry">
                <div class="array-entry-header">
                  <h4>Entry {{ index + 1 }}</h4>
                  <button type="button" @click="removeArrayEntry(index)" class="btn btn-danger btn-small">
                    Remove
                  </button>
                </div>
                
                <div class="array-fields">
                  <div class="form-group">
                    <label>ID:</label>
                    <input v-model="entry.id" type="text" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label>GB Acc:</label>
                    <input v-model="entry.gb_acc" type="text" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label>Spot ID:</label>
                    <input v-model="entry.spot_id" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Species Scientific Name:</label>
                    <input v-model="entry.species_scientific_name" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Annotation Data:</label>
                    <input v-model="entry.annotation_data" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Sequence Type:</label>
                    <input v-model="entry.sequence_type" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Target Description:</label>
                    <textarea v-model="entry.target_description" class="form-input" rows="2"></textarea>
                  </div>
                  <div class="form-group">
                    <label>Representative Public ID:</label>
                    <input v-model="entry.representative_public_id" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Gene Title:</label>
                    <input v-model="entry.gene_title" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Gene Symbol:</label>
                    <input v-model="entry.gene_symbol" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Entrez Gene ID:</label>
                    <input v-model="entry.entrez_gene_id" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>RefSeq Transcript ID:</label>
                    <input v-model="entry.refseq_transcript_id" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>GO Biological Process:</label>
                    <textarea v-model="entry.gene_ontology_biological_process" class="form-input" rows="2"></textarea>
                  </div>
                  <div class="form-group">
                    <label>GO Cellular Component:</label>
                    <textarea v-model="entry.gene_ontology_cellular_component" class="form-input" rows="2"></textarea>
                  </div>
                  <div class="form-group">
                    <label>GO Molecular Function:</label>
                    <textarea v-model="entry.gene_ontology_molecular_function" class="form-input" rows="2"></textarea>
                  </div>
                </div>
              </div>
            </div>
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

          <!-- Sample Array Data Section -->
          <div class="array-section">
            <div class="section-header">
              <h3>Sample Expression Data</h3>
              <button type="button" @click="addArrayEntry" class="btn btn-secondary btn-small">
                Add Entry
              </button>
            </div>
            
            <div v-if="localArrayData.length > 0" class="array-entries">
              <div v-for="(entry, index) in localArrayData" :key="index" class="array-entry">
                <div class="array-entry-header">
                  <h4>Entry {{ index + 1 }}</h4>
                  <button type="button" @click="removeArrayEntry(index)" class="btn btn-danger btn-small">
                    Remove
                  </button>
                </div>
                
                <div class="array-fields">
                  <div class="form-group">
                    <label>ID Ref:</label>
                    <input v-model="entry.id_ref" type="text" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label>Value:</label>
                    <input v-model.number="entry.value" type="number" step="any" class="form-input">
                  </div>
                  <div class="form-group">
                    <label>Abs Call:</label>
                    <select v-model="entry.abs_call" class="form-input">
                      <option value="">Select...</option>
                      <option value="P">Present (P)</option>
                      <option value="A">Absent (A)</option>
                      <option value="M">Marginal (M)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Detection P Value:</label>
                    <input v-model.number="entry.detection_p_value" type="number" step="any" class="form-input">
                  </div>
                </div>
              </div>
            </div>
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
import { createOne, updateOne, syncPlatformArrayEntries, syncSampleArrayEntries } from '@/api'
import { computed, reactive, ref, watch } from 'vue'

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
    },
    arrayData: {
      type: Array,
      default: () => []
    }
  },
  emits: ['submit', 'success', 'error', 'cancel'],
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

    const localArrayData = ref([])

    const entityDisplayName = computed(() => {
        return props.entity.charAt(0).toUpperCase() + props.entity.slice(1)
    })

    const createEmptyPlatformArrayEntry = () => ({
      id: '',
      gb_acc: '',
      spot_id: '',
      species_scientific_name: '',
      annotation_data: '',
      sequence_type: '',
      target_description: '',
      representative_public_id: '',
      gene_title: '',
      gene_symbol: '',
      entrez_gene_id: '',
      refseq_transcript_id: '',
      gene_ontology_biological_process: '',
      gene_ontology_cellular_component: '',
      gene_ontology_molecular_function: ''
    })

    const createEmptySampleArrayEntry = () => ({
      id_ref: '',
      value: null,
      abs_call: '',
      detection_p_value: null
    })

    const addArrayEntry = () => {
      if (props.entity === 'platform') {
        localArrayData.value.push(createEmptyPlatformArrayEntry())
      } else if (props.entity === 'sample') {
        localArrayData.value.push(createEmptySampleArrayEntry())
      }
    }

    const removeArrayEntry = (index) => {
      localArrayData.value.splice(index, 1)
    }

    // Watch for changes in formData prop and update local form data
    watch(() => props.formData, (newData) => {
        if (newData && typeof newData === 'object') {
          Object.keys(localFormData).forEach(key => {
            localFormData[key] = newData[key] || ''
          })
        }
    }, { deep: true, immediate: true })

    // Watch for changes in arrayData prop and update local array data
    watch(() => props.arrayData, (newArrayData) => {
        if (newArrayData && Array.isArray(newArrayData)) {
          localArrayData.value = [...newArrayData]
        }
    }, { deep: true, immediate: true })

    // Reset form when modal is closed
    watch(() => props.show, (isVisible) => {
        if (!isVisible) {
            Object.keys(localFormData).forEach(key => {
                localFormData[key] = ''
            })
            localArrayData.value = []
        }
    })

    /*
    const handleSubmit = () => {
      // Create clean data object, removing empty fields for updates
      const submitData = {}
      Object.keys(localFormData).forEach(key => {
        const value = localFormData[key]
        if (value !== '' && value !== null && value !== undefined) {
          submitData[key] = value
        }
      })

      // Process array data
      const cleanArrayData = localArrayData.value.map(entry => {
        const cleanEntry = {}
        Object.keys(entry).forEach(key => {
          const value = entry[key]
          if (value !== '' && value !== null && value !== undefined) {
            cleanEntry[key] = value
          }
        })
        
        // Auto-fill the foreign key
        if (props.entity === 'platform' && submitData.platform_ID) {
          cleanEntry.platform_ID = submitData.platform_ID
        } else if (props.entity === 'sample' && submitData.sample_ID) {
          cleanEntry.sample_ID = submitData.sample_ID
        }
        
        return cleanEntry
      }).filter(entry => Object.keys(entry).length > 1) // Remove empty entries
      
      const completeData = {
        mainData: submitData,
        arrayData: cleanArrayData
      }
      
      console.log('Form submission data:', completeData)
      emit('submit', completeData)
    }
    /*
    const handleSubmit = async () => {
      console.log('handleSubmit was called');
      const completeData = {
        mainData: submitData,
        arrayData: cleanArrayData
      };

      // decide target id and which endpoint to call
      try{
        if (props.entity === 'platform'){
          await updateOne('platform', submitData.value.platform_ID, submitData.value);
          await updatePlatformArray(submitData.value.platform_ID, cleanArrayData);
        } else if (props.entity === 'sample'){
          await updateOne('sample', submitData.value.sample_ID, submitData.value);
          await updateSamplesArray(submitData.value.sample_ID, cleanArrayData);
        } else {
          // this hopefully wont get triggereed
          const id = submitData[`${props.entity}_ID`] || submitData.value.id;
          console.log('error: could not get valid platform, failure at handleSubmit in EntityForm.vue');
          await updateOne(props.entity, id, submitData.value);
        }
        emit('saved', {entity: props.entity});
      }catch (err){
        console.error('Error during form submission:', err);
        emit('error', err);
      }
    };

    const handleSubmit = async () => {
      try{
        const submitData = {}
        Object.keys(localFormData).forEach(key => {
          const value = localFormData[key]
          if (value !== '' && value !== null && value !== undefined){
            submitData[key] = value
          }
        })

        // nw handle the array data
        const cleanArrayData = localArrayData.value.map(entry => {
          const cleanEntry = {}
          Object.keys(entry).forEach(key => {
            const value = entry[key]
            if (value !== '' && value !== null && value !== undefined) {
              cleanEntry[key] = value
            }
          })

          // fill in the foreign key --> already there from the main table
          if (props.entity === 'platform' && submitData.platform_ID) {
            cleanEntry.platform_ID = submitData.platform_ID
          } else if (props.entity === 'sample' && submitData.sample_ID) {
            cleanEntry.sample_ID = submitData.sample_ID
          }
          return cleanEntry
        }).filter(entry => Object.keys(entry).length > 1) // Remove empty entries

        if (props.entity === 'platform') {
          if (props.isEdit){
            await updateOne('platform', submitData.platform_ID, submitData);
          }else{
            await createOne('platform', submitData);
          }

          //update platform array if there is one
          if (cleanArrayData.length > 0 || props.isEdit) {
            await syncPlatformArrayEntries(submitData.platform_ID, cleanArrayData);
          }
        }else if (props.entity === 'sample') {
          if (props.isEdit){
            await updateOne('sample', submitData.sample_ID, submitData);
          }else{
            await createOne('sample', submitData);
          }

          if (cleanArrayData.length > 0 || props.isEdit) {
            await syncSampleArrayEntries(submitData.sample_ID, cleanArrayData);
          }
        }
        emit('success', {entity: props.entity});
      } catch (error) {
        console.error('Error during form submission:', error);
        emit('error', {error, entity: props.entity});
      }
    }*/

    const handleSubmit = async () => {
      try {
        const submitData = {}
        Object.keys(localFormData).forEach(key => {
          const value = localFormData[key]
          if (value !== '' && value !== null && value !== undefined){
            submitData[key] = value
          }
        })

        // Handle array data for platforms and samples
        const cleanArrayData = localArrayData.value.map(entry => {
          const cleanEntry = {}
          Object.keys(entry).forEach(key => {
            const value = entry[key]
            if (value !== '' && value !== null && value !== undefined) {
              cleanEntry[key] = value
            }
          })

          // Fill in the foreign key
          if (props.entity === 'platform' && submitData.platform_ID) {
            cleanEntry.platform_ID = submitData.platform_ID
          } else if (props.entity === 'sample' && submitData.sample_ID) {
            cleanEntry.sample_ID = submitData.sample_ID
          }
          return cleanEntry
        }).filter(entry => Object.keys(entry).length > 1) // Remove empty entries

        // Handle different entity types
        if (props.entity === 'platform') {
          if (props.isEdit){
            await updateOne('platform', submitData.platform_ID, submitData)
          } else {
            await createOne('platform', submitData)
          }

          // Sync platform array data
          if (cleanArrayData.length > 0 || props.isEdit) {
            await syncPlatformArrayEntries(submitData.platform_ID, cleanArrayData)
          }
        } else if (props.entity === 'sample') {
          if (props.isEdit){
            await updateOne('sample', submitData.sample_ID, submitData)
          } else {
            await createOne('sample', submitData)
          }

          // Sync sample array data
          if (cleanArrayData.length > 0 || props.isEdit) {
            await syncSampleArrayEntries(submitData.sample_ID, cleanArrayData)
          }
        } else if (props.entity === 'series') {
          // Series doesn't have array data
          if (props.isEdit){
            await updateOne('series', submitData.series_ID, submitData)
          } else {
            await createOne('series', submitData)
          }
        }

        emit('success', {entity: props.entity})
      } catch (error) {
        console.error('Error during form submission:', error)
        emit('error', {error, entity: props.entity})
      }
    }

    return {
      localFormData,
      localArrayData,
      entityDisplayName,
      addArrayEntry,
      removeArrayEntry,
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
  max-width: 800px;
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

.array-section {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.2rem;
}

.array-entries {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.array-entry {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

.array-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.array-entry-header h4 {
  margin: 0;
  color: #4a5568;
  font-size: 1rem;
}

.array-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
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

.btn-danger {
  background: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background: #c53030;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .form-modal {
    margin: 0.5rem;
    padding: 1.5rem;
  }
  
  .array-fields {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .array-entry-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>