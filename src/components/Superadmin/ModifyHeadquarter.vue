<script lang="js" setup>
import {ref, onMounted} from 'vue'
import { useHeadquartersStore } from '@/stores/useHeadquartersStore'

const store = useHeadquartersStore();
const showModalModify = ref(false);

const props = defineProps({
    headquater: {
        type: Object,
        required: true
    }
})

const localHeadquarter = ref({
    name: '',
    city: '',
    address: '',
    phone: ''
});


const modifyHeadquarter = async () => {
    const id = props.headquater.id

    if(!id){
        console.error('No se ha encontrado la sede para poder actualizar')
        return
    }

    const result = await store.editHeadquarters(id, localHeadquarter.value)
    showModalModify.value = false
}


</script>

<template>
    <div name="containerModifyButton">
        <button @click="() => {
            localHeadquarter = {...headquater};
            showModalModify = !showModalModify}"
        >Modificar datos</button>
    </div>

    <div v-if="showModalModify" name="modifyHeadquarter">
        <form @submit.prevent="mo">
            <label>Nombre de la sede</label>
            <input type="text" v-model="localHeadquarter.name" required>
            <label>Ciudad</label>   
            <input type="text" v-model="localHeadquarter.city" required>
            <label>Dirección</label>
            <input type="text" v-model="localHeadquarter.address" required>
            <label>Teléfono</label>
            <input type="text" v-model="localHeadquarter.phone" required>

            <button type="button" @click="modifyHeadquarter">Modificar</button>
            <button type="submit" @click="showModalModify = false">Cancelar</button>
        </form>
    </div>

</template>