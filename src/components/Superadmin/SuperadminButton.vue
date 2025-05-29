<script lang="js" setup>
import {ref, onMounted, computed} from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import DeleteHeadquarter from './DeleteHeadquarter.vue';
import ModifyHeadquarter from './ModifyHeadquarter.vue';
import AssignCoordinator from './AssignCoordinator.vue';

const props = defineProps({
    headquater: {
        type: Object,
        required: true
    }
})


const userStore = useUserStore();

onMounted(async () => {
    if(userStore.users.length === 0){
       await userStore.loadUsers();
    }
})

const coordinators = computed(() => {
    return  userStore.users.filter(
        user => 
        user.headquarters_id === props.headquater.id && 
        user.rol.toLowerCase() === 'coordinator');
});

</script>

<template>
    <div name="containerModalHeadquarterComplete">
        <div name="containerInformation">
            <div name="containerHeadquarterName">{{headquater.name}}</div>
            <DeleteHeadquarter :headquater="headquater" />
            <ModifyHeadquarter :headquater="headquater" />
            <AssignCoordinator :headquater="headquater" />
            <div name="containerHeadquarter">
                <p>Ciudad: {{ headquater.city }}</p>
                <p>Dirección: {{ headquater.address }}</p>
                <p>Teléfono: {{ headquater.phone }}</p>    
            </div>
            <div name="containterUser" v-if="coordinators.length > 0">
                <p>Coordinador/es</p>
                <ul>
                    <li v-for="(coordinator, index) in coordinators" :key="index">
                        <p>Nombre y apellidos: {{coordinator.full_name}}</p>
                        <p>Correo: {{ coordinator.email }}</p>
                    </li>
                </ul>
            </div>
            <div v-else> 
                No existen coordinadores para {{headquater.name}}
            </div>
        </div>
    </div>
      
</template>