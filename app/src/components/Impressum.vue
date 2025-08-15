<script>
export default{
    name: 'Impressum',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close']
}
</script>

<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <h2>Impressum</h2>
            <div class="impressum-content">
                <h3>Data Warehouse Application</h3>
                <p><strong>Contact:</strong>info@maxmustermann.de</p>
                <p><strong>Address:</strong>Musterstrasse 42, 12345 Musterstadt</p>
                <p><stong>Phone:</stong>12345 678910</p>

                <h4>Responsible for Content:</h4>
                <p>Max Mustermann</p>
                <small>© 2025 GEO RipOff Data Warehouse. No rights reserved.</small>
            </div>
            <div class="modal-actions">
                <button @click="$emit('close')" class="btn btn-secondary">Close</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.impressum-content{
    margin: 1.5rem 0;
    line-height: 1.6;
}

.impressum-content h3{
    color: #2d3748;
    margin-bottom: 1rem;
}
.impressum-content h4{
    color: #4a5568;
    margin: 1.5rem 0 0.5rem 0;
    font-size: 1rem;
}

.impressum-content p{
    margin: 0.5rem;
    color: #4a5568;
}
.impressum-content small{
    display: block;
    margin-top: 2rem;
    color: #665;
    font-style: italic;
}
.modal.actions{
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}
</style>