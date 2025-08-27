<script>
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import Home from './components/Home.vue';
import EntityList from './components/EntityList.vue';
import Impressum from './components/Impressum.vue';
import EntityDetailView from './components/EntityDetailView.vue';
import * as api from './api.js'

export default {
    name: 'App',
    components:{
        AppHeader, Home, EntityList, Impressum, EntityDetailView
    },
    setup(){
        const currentView = ref('home');
        const currentEntity = ref('');
        const showImpressum = ref(false);
        const searchQuery = ref('');
        const searchLoading = ref(false);
        const searchError = ref('');
        const showSearchResult = ref(false);
        const searchResultItem = ref(null);
        const searchResultEntity = ref('');
        
        const goHome = () => {
            currentView.value = 'home';
            currentEntity.value = '';
            closeSearchResult();
        }
        
        const loadData = (entity) => {
            currentEntity.value = entity;
            currentView.value = 'list';
            closeSearchResult();
        }
        
        const closeSearchResult = () => {
            showSearchResult.value = false;
            searchResultItem.value = null;
            searchResultEntity.value = '';
            searchError.value = '';
        }
        
        const performSearch = async () => {
            if (!searchQuery.value.trim()) {
                searchError.value = 'Please enter an ID to search';
                return;
            }
            
            searchLoading.value = true;
            searchError.value = '';
            closeSearchResult();
            
            const entities = ['platform', 'sample', 'series', 'dataset', 'profile'];
            const searchId = searchQuery.value.trim();
            
            try {
                // Try to fetch from each entity
                for (const entity of entities) {
                    try {
                        const response = await api.fetchOne(entity, searchId);
                        
                        // Check if we got a valid response
                        if (response && response.data) {
                            searchResultItem.value = response.data;
                            searchResultEntity.value = entity;
                            showSearchResult.value = true;
                            searchQuery.value = '';
                            searchLoading.value = false;
                            return;
                        }
                    } catch (err) {
                        // Continue to next entity if this one fails
                        continue;
                    }
                }
                
                // If we get here, no entity had a match
                searchError.value = `No entry found with ID: ${searchId}`;
            } catch (err) {
                searchError.value = 'An error occurred during search';
            } finally {
                searchLoading.value = false;
            }
        }
        
        return {
            currentView,
            currentEntity,
            showImpressum,
            searchQuery,
            searchLoading,
            searchError,
            showSearchResult,
            searchResultItem,
            searchResultEntity,
            goHome,
            loadData,
            performSearch,
            closeSearchResult
        }
    }
}
</script>

<template>
    <div id="app">
        <AppHeader
            :current-view="currentView"
            @show-impressum="showImpressum = !showImpressum"
            @go-home="goHome"
        >
            <!-- Add search bar as a slot content in the header -->
            <template #search-bar>
                <div class="search-container">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search by ID..."
                        class="search-input"
                        @keyup.enter="performSearch"
                        :disabled="searchLoading"
                    />
                    <button 
                        @click="performSearch" 
                        class="btn btn-primary search-btn"
                        :disabled="searchLoading"
                    >
                        {{ searchLoading ? 'Searching...' : 'Search' }}
                    </button>
                </div>
            </template>
        </AppHeader>
        
        <main class="main-content">
            <div class="container">
                <!-- Search error message -->
                <div v-if="searchError && !showSearchResult" class="search-message">
                    <div class="error-box">
                        {{ searchError }}
                        <button @click="searchError = ''" class="close-error">&times;</button>
                    </div>
                </div>
                
                <!-- Impressum Modal -->
                <Impressum
                    :show="showImpressum"
                    @close="showImpressum = false"
                />
                
                <!-- Search Result Modal -->
                <EntityDetailView
                    v-if="showSearchResult"
                    :show="showSearchResult"
                    :item="searchResultItem"
                    :entity="searchResultEntity"
                    @close="closeSearchResult"
                />
                
                <!-- Main Content -->
                <Home
                    v-if="currentView === 'home' && !showSearchResult"
                    @load-data="loadData"
                />
                <EntityList
                    v-if="currentView === 'list' && !showSearchResult"
                    :entity="currentEntity"
                    @go-home="goHome"
                />
            </div>
        </main>
    </div>
</template>

<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

#app {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

/* Search styles */
.search-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.search-input {
    padding: 0.5rem 1rem;
    border: 1px solid white;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 0.9rem;
    width: 200px;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.search-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid white;
    padding: 0.5rem 1rem;
    white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
}

.search-message {
    margin-bottom: 1rem;
}

.error-box {
    background: #fff;
    border-left: 4px solid #e53e3e;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.close-error {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    padding: 0;
    margin-left: 1rem;
}

.close-error:hover {
    color: #333;
}

/* Button styles */
.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background-color: #667eea;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #5a67d8;
}

.btn-secondary {
    background-color: #e2e8f0;
    color: #4a5568;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #cbd5e0;
}

.btn-info {
    background-color: #3182ce;
    color: white;
}

.btn-warning {
    background-color: #d69e2e;
    color: white;
}

.btn-danger {
    background-color: #e53e3e;
    color: white;
}

.btn-info:hover:not(:disabled), 
.btn-warning:hover:not(:disabled), 
.btn-danger:hover:not(:disabled) {
    opacity: 0.8;
}

/* Modal styles */
.modal-overlay {
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

.modal-content {
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
    
    .search-container {
        flex-direction: column;
        width: 100%;
        margin-right: 0;
        margin-bottom: 0.5rem;
    }
    
    .search-input {
        width: 100%;
    }
    
    .search-btn {
        width: 100%;
    }
}
</style>