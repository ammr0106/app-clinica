<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <button class="close-button" @click="close">×</button>
      <h2>Crear nueva sede</h2>

      <AppForm @submit="submitForm">
        <AppInput v-model="nombre" label="Ciudad" type="text" :required="true" />
        <AppInput v-model="ciudad" label="Nombre" type="text" :required="true" />
        <AppInput v-model="direccion" label="Dirección" type="text" :required="true" />
        <AppInput v-model="telefono" label="Teléfono" type="text" :required="true" />
        <AppInput v-model="coordinadores" label="Coordinadores" type="text" :required="true" />
        <AppButton type="submit" variant="green">Guardar Sede</AppButton>
      </AppForm>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppForm from './common/AppForm.vue'
import AppInput from './common/AppInput.vue'
import AppButton from './common/AppButton.vue'
const emit = defineEmits(['close', 'enviar'])

const nombre = ref('')
const ciudad = ref('')
const direccion = ref('')
const telefono = ref('')
const coordinadores = ref('')

const close = () => emit('close')

const submitForm = () => {
  emit('enviar', {
    nombre: nombre.value,
    ciudad: ciudad.value,
    direccion: direccion.value,
    telefono: telefono.value,
    coordinadores: coordinadores.value,
  })
  close()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  position: relative;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s ease-out;
}

.close-button {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}

.modal h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: var(--azul-profesional, #1565c0);
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #333;
}

.form-group input {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--azul-profesional, #1565c0);
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
}

.submit-button {
  margin-top: 1rem;
  padding: 0.9rem;
  background-color: var(--verde-confianza, #43a047);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #388e3c;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
