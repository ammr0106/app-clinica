<template>
  <!-- Overlay del modal, al hacer clic fuera del contenido se cierra -->
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Crear nueva cita</h2>

      <!-- Formulario para crear la cita -->
      <form @submit.prevent="submit">
        <!-- Campo para nombre del paciente -->
        <div class="form-group">
          <label for="patient">Paciente</label>
          <input id="patient" v-model="form.patient" required />
        </div>

        <!-- Campo para seleccionar la hora -->
        <div class="form-group">
          <label for="time">Hora</label>
          <input id="time" type="time" v-model="form.time" required />
        </div>

        <!-- Campo para descripción opcional -->
        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea id="description" v-model="form.description" rows="3" />
        </div>

        <!-- Checkbox para marcar si la cita está confirmada -->
        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="form.confirmed" />
            Cita confirmada
          </label>
        </div>

        <!-- Checkbox para marcar si la cita es para una mascota -->
        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="form.pet" />
            Mascota
          </label>
        </div>

        <!-- Botones para guardar o cancelar -->
        <div class="modal-actions">
          <button type="submit">Guardar</button>
          <button type="button" @click="close" class="cancel">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

// Propiedad que recibe el día seleccionado para la cita
const props = defineProps({
  selectedDay: {
    type: Number,
    required: true,
  },
})

// Eventos emitidos al padre para comunicar acciones (guardar o cerrar)
const emit = defineEmits(['close', 'save'])

// Estado reactivo para manejar los campos del formulario
const form = reactive({
  patient: '',     // Nombre del paciente
  time: '',        // Hora de la cita
  description: '', // Descripción opcional
  confirmed: false,  // Booleano que indica si la cita está confirmada
  pet: false,        // Booleano que indica si la cita es para una mascota
})

// Función que se ejecuta al enviar el formulario
function submit() {
  // Creamos el objeto con la info completa, incluyendo el día
  const dateData = {
    day: props.selectedDay,
    ...form,
  }

  // Emitimos el evento 'save' con la info para que el padre lo guarde
  emit('save', dateData)
  
  // Cerramos el modal
  close()
}

// Función para emitir el evento de cierre del modal
function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: auto;
  transition: all 0.3s ease;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.checkbox-group label {
  font-weight: normal;
  cursor: pointer;
  user-select: none;
}
/* Contenedor label para checkbox con espacio y alineación */
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-left: 28px; /* espacio para el checkbox personalizado */
}

/* Ocultamos el checkbox original */
input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Creamos el checkbox personalizado */
.checkbox-group label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #43A047;
  border-radius: 6px;
  background-color: white;
  box-sizing: border-box;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Cuando el checkbox está marcado, mostramos un check */
.checkbox-group label:has(input[type='checkbox']:checked)::before {
  background-color: #43A047;
  border-color: #388E3C;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 12 10' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='none' stroke='%23fff' stroke-width='2' d='M1 5l3 3 7-7'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 12px 10px;
}

/* Cambios visuales al hacer hover sobre el label */
.checkbox-group label:hover::before {
  border-color: #388E3C;
}

/* Focus accesible con outline */
.checkbox-group input[type='checkbox']:focus + label::before {
  outline: 2px solid #80C683;
  outline-offset: 2px;
}

/* Ajuste para que el texto quede alineado verticalmente */
.checkbox-group label {
  line-height: 1.2;
}


label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

input[type='checkbox'] {
  width: auto;
  margin-right: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

button[type='submit'] {
  background-color: #43A047;
  color: white;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

button[type='submit']:hover {
  background-color: #388E3C; /* verde más oscuro */
  box-shadow: 0 8px 20px rgba(67, 160, 71, 0.6); /* sombra intensa */
}
.cancel {
  background-color: #e64444;
  color: rgb(255, 255, 255);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.cancel:hover {
  background-color: #c62828; /* rojo más oscuro */
  box-shadow: 0 8px 20px rgba(198, 40, 40, 0.6); /* sombra intensa */
}
</style>
