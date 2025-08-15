import {createRouter, createWebHistory} from 'vue-router';
import PlatformList from '@/views/PlatformList.vue';
import PlatformDetail from '@views/PlatformDetail.vue';

const routes = [
    {path: '/', redirect: 'platforms'},
    {path: '/platforms', name: 'PlatformList', component: PlatformList},
    {path: '/platforms/:id', name: 'PlatformDetail', component: PlatformDetail, props: true},
];

export default createRouter({
    history: createWebHistory(), routes
});