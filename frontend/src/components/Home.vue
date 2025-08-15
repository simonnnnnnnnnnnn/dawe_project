<script>
export default{
    name: 'Home',
    emits: ['load-data'],
}
</script>

<template>
    <div class="home-view">
        <h2>Welcome to the GEO RipOff</h2>
        <p>Feel free to explore the gene expression database</p>
        <div class="button_grid">
            <button @click="$emit('load-data', 'platform')" class="main-btn platform-btn">
                <span class="btn-icon">🖥️</span>
                <span class="btn-text">Platforms</span>
            </button>
            <button @click="$emit('load-data', 'sample')" class="main-btn sample-btn">
                <span class="btn-icon">🧪</span>
                <span class="btn-text">Samples</span>
            </button>
            <button @click="$emit('load-data', 'experiment')" class="main-btn series-btn">
                <span class="btn-icon">📊</span>
                <span class="btn-text">Experiments</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.home-view {
    text-align: center;
    color: 'white';
}
.home-view h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 300;
}
.home-view p {
    font-size: 1.2rem;
    margin-bottom: 3rem;
    opacity: 0.9;
}
.button_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
}
.main-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 3rem 2rem;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.main-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
}
.btn-icon {
    font-size: 3rem;
}
.btn-text {
    font-size: 1.5rem;
    font-weight: 500;
}
@media (max-width: 768px) {
    .button_grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    .main-btn {
        padding: 2rem 1rem;
    }
}
</style>