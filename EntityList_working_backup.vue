<template>
  <div class="entity-list">
    <div v-if="error" class="error">Error: {{ error }}</div>

    <div v-if="loading" class="loading">Loading…</div>

    <div v-else>
      <div class="meta">Showing {{ items.length }} of {{ total }} — page {{ page + 1 }} / {{ totalPages }}</div>

      <ul v-if="items.length" class="items">
        <li v-for="item in items" :key="getKey(item)">
          <!-- render item — keep your existing markup here if needed -->
          <slot name="item" :item="item">{{ item }}</slot>
        </li>
      </ul>

      <div v-else class="no-items">No items found</div>

      <div class="pagination" style="margin-top:12px; display:flex; gap:8px; align-items:center">
        <button @click="prevPage" :disabled="page === 0">Prev</button>
        <button @click="nextPage" :disabled="(page + 1) >= totalPages">Next</button>

        <label style="margin-left:12px">
          Page
          <input type="number" v-model.number="goto" min="1" :max="totalPages" style="width:60px; margin:0 6px"/>
          <button @click="goToInput">Go</button>
        </label>

        <label style="margin-left:auto">
          Per page:
          <select v-model.number="limit">
            <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { fetchAll } from '../api.js'; // adjust path if needed

// Props remain compatible with typical EntityList usage
const props = defineProps({
  entity: { type: String, required: true },
  initialLimit: { type: Number, default: 10 }
});

// Reactive state
const items = ref([]);
const total = ref(0);
const limit = ref(props.initialLimit);
const page = ref(0); // zero-based page index
const loading = ref(false);
const error = ref(null);
const goto = ref(1);

// currentOffset computed from page & limit
const currentOffset = computed(() => page.value * limit.value);

const totalPages = computed(() => {
  if (!limit.value) return 1;
  return Math.max(1, Math.ceil((Number(total.value) || 0) / limit.value));
});

function getKey(item) {
  return item.sample_ID || item.platform_ID || item.series_ID || item.id || JSON.stringify(item);
}

async function loadPage(p = page.value) {
  loading.value = true;
  error.value = null;
  try {
    // clamp page
    if (p < 0) p = 0;
    if (p >= totalPages.value) p = Math.max(0, totalPages.value - 1);
    page.value = p;
    goto.value = page.value + 1;

    const params = { limit: limit.value, offset: currentOffset.value };

    const res = await fetchAll(props.entity, params);

    // Support shape: { total, limit, offset, data } (preferred)
    if (res && res.data && typeof res.data === 'object' && Array.isArray(res.data.data)) {
      items.value = res.data.data;
      total.value = Number(res.data.total) || items.value.length;
      // sync server-returned paging if provided
      if (res.data.limit) limit.value = Number(res.data.limit);
      if (res.data.offset !== undefined) page.value = Math.floor(Number(res.data.offset || 0) / limit.value);
    } else if (res && Array.isArray(res.data)) {
      // backward compatibility: server returns raw array
      items.value = res.data;
      total.value = res.data.length;
    } else {
      items.value = [];
      total.value = 0;
    }
  } catch (err) {
    console.error('Failed to load data:', err);
    error.value = err?.response?.data?.error || err.message || String(err);
  } finally {
    loading.value = false;
  }
}

function nextPage() {
  if ((page.value + 1) < totalPages.value) loadPage(page.value + 1);
}
function prevPage() {
  if (page.value > 0) loadPage(page.value - 1);
}
function goToInput() {
  const target = Math.min(Math.max(1, Number(goto.value || 1)), totalPages.value);
  loadPage(target - 1);
}

watch(limit, () => loadPage(0));

onMounted(() => loadPage(0));
</script>

<style scoped>
.entity-list { font-family: system-ui, sans-serif; }
.items { list-style:none; padding:0; }
.meta { margin-bottom:8px; color:#444 }
.loading { color:#666 }
.error { color:crimson }
</style>