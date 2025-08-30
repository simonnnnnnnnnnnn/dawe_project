<script>
import { computed } from 'vue';
export default{
    name: 'EntityView',
    props:{
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
    setup(props){
        const displayName = computed(() => {
            return props.item.name || props.item.title || `${props.entity.charAt(0).toUpperCase() + props.entity.slice(1)} #${props.item.id}`
        })
        const otherProperties = computed(() => {
            const excluded = ['id', 'name', 'title'];
            const filtered  ={}

            Object.keys(props.item).forEach(key => {
                if (!excluded.includes(key)) {
                    filtered[key] = props.item[key];
                }
            })
            return filtered
        })

        const formatKey = (key) => {
            return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z]))/g, ' $1')
        }

        const formatValue = (value) => {
            if (value === null || value === undefined) {
                return 'N/A';
            }
            if (typeof value === 'object') {
                return JSON.stringify(value, null, 2);
            }
            return String(value);
        }

        return{
            displayName,
            otherProperties,
            formatKey,
            formatValue
        }
    }
}
</script>

<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <h2>{{ displayName }}</h2>
            <div class="item-details">
                <p><strong>ID:</strong> {{ item.id }}</p>
                <p v-if="item.description"><strong>Description:</strong> {{ item.description }}</p>
                <div v-for="(value, key) in otherProperties" :key="key">
                    <p><strong>{{ formatKey(key) }}:</strong> {{ formatValue(value) }}</p>
                </div>
            </div>
            <div class="modal-actions">
                <button @click="$emit('close')" class="btn btn-secondary">Close</button>
            </div>
        </div>
    </div>"
</template>


<style scoped>
.item-details{
    margin: 1rem 0;
}

.item-details p{
    margin: 0.5rem 0;
    color: #4a5568
}
.modal-actions{
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}
</style>