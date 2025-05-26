<template>
  <!-- Botón que al hacer clic llama a confirmDelete -->
  <button class="delete-btn" @click="confirmDelete">
    Eliminar cita
  </button>
</template>

<script setup>
// Definimos que este componente emitirá un evento llamado 'delete'
const emit = defineEmits(['delete'])

// Función que muestra un confirm modal al usuario antes de eliminar
function confirmDelete() {
  // Si el usuario confirma que quiere eliminar la cita
  if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
    // Emitimos el evento 'delete' para que el componente padre actúe
    emit('delete')
  }
}
</script>

<style scoped>
.delete-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.delete-btn:hover {
  background-color: #b71c1c;
  scale: 1.05;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: 0.3s ease;
}
</style>
