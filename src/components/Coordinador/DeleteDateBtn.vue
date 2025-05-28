<template>
  <button class="delete-btn" @click="handleDelete">
    Eliminar cita
  </button>
</template>

<script setup>
// Importamos las funciones necesarias de Vue para definir eventos y props
import { defineEmits, defineProps } from 'vue'

// Definimos los eventos que este componente puede emitir: 'delete' y 'close'
const emit = defineEmits(['delete', 'close'])

// Definimos las propiedades que este componente espera recibir
const props = defineProps({
  citaId: {
    type: Number,     // El ID de la cita que se va a eliminar
    required: true    // Es obligatorio recibir esta prop
  }
})

// Función que se ejecuta cuando se quiere eliminar la cita
function handleDelete() {
  emit('delete', props.citaId) // Emitimos el evento 'delete' pasando el ID de la cita
  emit('close')                // También emitimos el evento 'close' para cerrar el modal
}
</script>

<style scoped>
.delete-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-weight: bold;
}

.delete-btn:hover {
  background-color: #b71c1c;
}
</style>
