<script>
export default {
    name: 'AppHeader',
    props: {
        currentView: {
            type: String,
            required: true
        }
    },
    emits: ['show-impressum', 'go-home'],
}
</script>

<template>
    <header class="header">
        <div class="container">
            <h1>Data Warehouse</h1>
            <nav>
                <button @click="$emit('show-impressum')" class="nav-btn">Impressum</button>
                <button v-if="currentView !== 'home'" @click="$emit('go-home')" class="nav-btn">Home</button>
            </nav>
        </div>"
    </header>"
</template>


<!--so now a scoped style, the global one is defined in App.vue-->
<style scoped>
.header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 1rem;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header .container{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header h1 {
    color: white;
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
}

.nav-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    margin-left: 0.5rem;
    transition: all 0.3s ease;
}

.nav-btn{
    background: rgba(255, 255, 255, 0.3);
}
</style>
