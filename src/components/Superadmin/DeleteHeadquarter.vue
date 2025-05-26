<script lang="js" setup>
import {ref} from 'vue'
import { useHeadquartersStore } from '@/stores/useHeadquartersStore'

const store = useHeadquartersStore();
const showMessageDelete = ref(false)

const props = defineProps({
  headquater: {
    type: Object,
    required: true
  }
})

const deteleHeadquarter = async () => {
 const id = props.headquater.id

if(!id){
    console.error('No se ha encontrado la sede')
    return
}

const {error} = await store.removeHeadquarters(id)
if (error) {
    console.error('Error al eliminar la sede:', error)
    return
}
showMessageDelete.value = false
  
}


</script>

<template>
  <div name="containerDeleteButton">
    <button @click="showMessageDelete = !showMessageDelete">Eliminar sede</button>
  </div>

  <div v-if="showMessageDelete" name="deleteHeadquarter">
    <p>¿Estás seguro de que deseas eliminar esta sede?</p>
    <button @click="deteleHeadquarter">Eliminar</button>
    <button @click="showMessageDelete = false">Cancelar</button>
  </div>
</template>