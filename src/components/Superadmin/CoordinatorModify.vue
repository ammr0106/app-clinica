<script lang="js" setup>
import {ref, onMounted} from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useHeadquartersStore } from '@/stores/useHeadquartersStore';

const showModalCoordinator = ref(false);
const store = useUserStore();
const headquarterStore = useHeadquartersStore();


const props = defineProps({
    coordinatorId: {
        type: String,
        required: true
    }
});

const coordinator =ref(null);
const selectedHeadquarters = ref(null);
const form = ref({
    name: '',
    first_surname: '',
    second_surname: '',
    email: '',
    date: '',
    rol: '',
}) 

onMounted(async() =>{
    await store.loadUsers();
    await headquarterStore.loadHeadquarters();

    coordinator.value = store.users.find(user => user.id === props.coordinatorId);

    selectedHeadquarters.value = headquarterStore.headquarters.find(
        headquarter => headquarter.id === coordinator.value.headquarters_id
    );
    
    if(coordinator.value){
        form.value = {
            name: coordinator.value.name || '',
            first_surname: coordinator.value.first_surname || '',
            second_surname: coordinator.value.second_surname || '',
            email: coordinator.value.email || '',
            date: coordinator.value.date || '',
            rol: coordinator.value.rol || ''
        }
    }
})




const modifyCoordinator = async() =>{
    if(!selectedHeadquarters.value){
       alert('Debes seleccionar una sede para el coordinador')
        return
    }


    const updateCoordinator = {
        ...form.value,
        id_headquarters: selectedHeadquarters.value.id,
        rol: 'coordinator'
    }
    

    const {error} = await store.editUser(coordinator.value.id, updateCoordinator);

    if(!error){ 
        showModalCoordinator.value = false;
    }else{
        alert('Error al modificar el coordinador')
        console.error(error)
    }
};

</script>

<template>
    <div name="containerModifyButton">
        <button @click="showModalCoordinator = !showModalCoordinator">Modificar coordinador</button>
    </div>

    <div name="containerModalCoordinator" v-if="showModalCoordinator">
        <form @submit.prevent="modifyCoordinator">
            <label>Nombre</label>
            <input type="text" v-model="form.name" required>
            <label>Primer apellido</label>
            <input type="text" v-model="form.first_surname" required>
            <label>Segundo apellido</label>
            <input type="text" v-model="form.second_surname">
            <label>Correo</label>
            <input type="email" v-model="form.email" required>
            <label>Fecha de inicio</label>
            <input type="date" v-model="form.date" required>
            <label>Sede</label>
            <select v-model="selectedHeadquarters" required>
                <option v-for="headquarter in headquarterStore.headquarters" :key="headquarter.id" :value="headquarter">
                    {{ headquarter.name }}
                </option>
            </select>
            <button type="submit">Modificar</button>
            <button type="button" @click="showModalCoordinator = false">Cancelar</button>
        </form>

    </div>
</template>