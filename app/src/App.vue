<script>
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import Home from './components/Home.vue';
import EntityList from './components/EntityList.vue';
import Impressum from './components/Impressum.vue';

export default {
    name: 'App',
    components:{
        AppHeader, Home, EntityList, Impressum
    },
    setup(){
        const currentView = ref('home');
        const currentEntity = ref('');
        const showImpressum = ref(false);
        const goHome = () => {
            currentView.value = 'home';
            currrentEntity.value = '';
        }
        const loadData = (entity) => {
            currentEntity.value = entity;
            currentView.value = 'list';
        }
        return {
            currentView,
            currentEntity,
            showImpressum,
            goHome,
            loadData
        }
    }
}
</script>

<!--ok now the template part, so the html structure of the whole thing-->
<template>
    <div id="app">
        <AppHeader
            :current-view="currentView"
            @show-impressum="showImpressum = !showImpressum"
            @go-home="goHome"
        />
        <main class="main-content">
            <div class="container">
                <Impressum
                    :show="showImpressum"
                    @close="showImpressum = false"
                />
                <Home
                    v-if="currentView === 'home'"
                    @load-data="loadData"
                />
                <EntityList
                    v-if="currentView === 'list'"
                    :entity="currentEntity"
                    @go-home="goHome"
                />
            </div>"
        </main>"
    </div>
</template>

<!--with this alone the website looks rather bleak, so i need some styling here-->
<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
#app {
    font-family: 'Seqoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.main-content {
    padding: 2rem;
}

/*as i have some buttons, just define a global button stlye here so i dont repeat myself over and over*/
.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: #667eea;
    color: white;
}
.btn-primary:hover {
    background-color: #5a67d8;
}
.btn-secondary {
    background-color: #e2e;
    color: #4a5568;
}
.btn-secondary:hover {
    background-color: #cbd5e0;
}

.btn-info{
    background-color: #3182ce;
    color: white;
}
.btn-warining{
    background-color: #d69e2e;
    color: white;
}
.btn-danger{
    background-color: #e53e3e;
    color: white;
}
.btn-info:hover, .btn-warining:hover, .btn-danger:hover {
    opacity: 0.8;
}


/* now the same for modal styles, better once defined here than repreated across the board*/
.modal-overlay{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content{
    background: white;
    border-radius: 20px;
    padding: 2rem;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
}
</style>