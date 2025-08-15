<template>
    <div v-if="platform">
        <h2>Platform #{{ platform.id }}</h2>
        <pre>{{ platform }}</pre>
        <button @click="router.push('/platforms')">Back</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {fetchOne} from '@/api/api';
import {useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const platform = ref(null);

onMounted(async () => {
    const { data } = await fetchOne('platform', route.params.id);
    platform.value = data;
});
</script>