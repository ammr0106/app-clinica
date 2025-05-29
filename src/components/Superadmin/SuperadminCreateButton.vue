<script setup lang="js">
import {ref} from 'vue'
import { useHeadquartersStore } from '../../stores/useHeadquartersStore'

const showNewHeadquater = ref(false)
const newHeadquater = ref({
  name: '',
  city: '',
  address: '',
  phone: ''
})

const store = useHeadquartersStore();

const createNewHeadquater = async () => {
  const {error} = await store.createHeadquarters({...newHeadquater.value})
 
  if (error) {
    console.error('Error al crear la sede:', error)
    return
  }
  
  newHeadquater.value = {
    name: '',
    city: '',
    address: '',
    phone: ''
  }

  showNewHeadquater.value = false

}

</script>

<template>
    <div name="containerButtons">
        <div name="createButton"><button @click="showNewHeadquater = !showNewHeadquater">ABRIR PARA NUEVA sede</button></div>
    </div>

    <div v-if="showNewHeadquater" name="newHeadquater">
      <h2>Crear nueva sede</h2>
      <form @submit.prevent="createNewHeadquater">
        <input v-model="newHeadquater.name" placeholder="Nombre de la sede" required />
        <input v-model="newHeadquater.city" placeholder="Ciudad" required/>
        <input v-model="newHeadquater.address" placeholder="Dirección" required/>
        <input v-model="newHeadquater.phone" placeholder="Teléfono" required/>
        <button>Crear sede</button>
      </form>

    </div>
   
</template>