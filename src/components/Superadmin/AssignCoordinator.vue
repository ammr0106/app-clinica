<script lang="js" setup>
import {onMounted, ref, computed} from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import CoordinatorModify from './CoordinatorModify.vue';
import NewCoordinator from './NewCoordinator.vue';

const store = useUserStore();
const showCoordinatorModal = ref(false);

const props = defineProps({
    headquater: {
        type: Object,
        required: true
    }
})

onMounted(async () =>{
    if(store.users.length === 0){
        await store.loadUsers();
    }
})

const coordinators = computed(() =>{
    return store.users.filter(
        user => 
        user.headquarters_id === props.headquater.id && 
        user.rol.toLowerCase() === 'coordinator',
    );
})



</script>

<template>
    <div name="containerCoordinators">
        <button @click="showCoordinatorModal = !showCoordinatorModal">Asignar coordinador</button>
    </div>

    <div v-if="showCoordinatorModal">
        <div v-if="coordinators.length > 0">  
            <ul>
                <li v-for="(coordinator, index) in coordinators" :key="index">
                    <p>Nombre y apellidos: {{coordinator.full_name}}</p>
                    <p>Correo: {{ coordinator.email }}</p>
                    <CoordinatorModify :coordinatorId="coordinator.id" />
                    <NewCoordinator :headquater="headquater"/>
                </li>
            </ul>
        </div>
        <div v-else>
        <NewCoordinator :headquater="headquater"/>
        </div>
    </div>
</template>