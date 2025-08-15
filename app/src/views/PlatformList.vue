<script setup lang="ts">
import EntityTable from '../components/EntityTable.vue';

</script>

<template>
    <div>
        <h1>Platforms</h1>
        <EntityTable
            :headers="headers"
            :items="platforms"
            @view="goToDetail"
            @delete="removePlatform"
        />
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import { fetchAll, deleteOne} from '@api/api';
import EntityTable from '@components/EntityTable.vue';
import {useRouter} from 'vue-router';

const router = useRouter();
const platforms = ref([]);
const headers = ['id', 'name'];

async fucntion loadPlatforms(){
    const { data } = await fetchAll('platform');
    platforms.value =  data;
}

function goToDetail(){
    router.push(`platforms/${id}`);
}

async function removePlatform(){
    await deleteOne('platform', 'id');
    await loadPlatforms();
}

onMounted(loadPlatforms);
</script>