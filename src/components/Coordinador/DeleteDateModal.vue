<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h3>Eliminar cita</h3>
      <p>¿Estás seguro de que quieres eliminar la cita de <strong>{{ cita.nombre }}</strong> a las {{ cita.hora }}?</p>
      <div class="buttons">
        <button @click="confirmDelete">Eliminar</button>
        <button @click="close">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cita: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['confirm', 'close'])

function confirmDelete() {
  emit('confirm')
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}
.buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
