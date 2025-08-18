<!-- components/EntityItem.vue -->
<template>
  <div class="list-item">
    <div class="item-content">
      <h3>{{ displayName }}</h3>
      <p v-if="item.organism" class="organism">{{ item.organism }}</p>
      <p v-if="item.technology" class="technology">Tech: {{ item.technology }}</p>
      <p v-if="item.source_name" class="source">Source: {{ item.source_name }}</p>
      <p v-if="item.summary" class="summary">{{ truncateText(item.summary, 100) }}</p>
      <p v-if="item.descript" class="description">{{ truncateText(item.descript, 100) }}</p>
      <p class="item-id">ID: {{ getIdField() }}</p>
    </div>
    <div class="item-actions">
      <button @click="$emit('view', item)" class="btn btn-info">View</button>
      <button @click="$emit('edit', item)" class="btn btn-warning">Edit</button>
      <button @click="$emit('delete', item)" class="btn btn-danger">Delete</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'EntityItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    entity: {
      type: String,
      required: true
    }
  },
  emits: ['view', 'edit', 'delete'],
  setup(props) {
    const displayName = computed(() => {
      return props.item.title || 
             props.item.name || 
             `${props.entity.charAt(0).toUpperCase() + props.entity.slice(1)} #${getIdField()}`
    })

    const getIdField = () => {
      switch(props.entity) {
        case 'platform': return props.item.platform_ID
        case 'sample': return props.item.sample_ID
        case 'series': return props.item.series_ID
        default: return props.item.id
      }
    }

    const truncateText = (text, maxLength) => {
      if (!text || text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }

    return {
      displayName,
      getIdField,
      truncateText
    }
  }
}
</script>

<style scoped>
.list-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.list-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.item-content {
  flex: 1;
}

.item-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
}

.item-content p {
  margin: 0.25rem 0;
  color: #666;
}

.item-id {
  font-size: 0.9rem;
  color: #999;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .list-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .item-actions {
    justify-content: center;
  }
}
</style>
