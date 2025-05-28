<template>
  <div class="progress-bar" :style="{ width: progress + '%' }"></div>
  <AppForm :onSubmit="submit">
    <AppInput label="DNI" v-model="form.dni" required autofocus />

    <transition name="fade">
      <AppInput
        v-show="form.dni"
        label="Nombre del paciente"
        v-model="form.patient"
        required
      />
    </transition>

    <transition name="fade">
      <AppSelect
        v-show="form.patient"
        label="Especialidad"
        v-model="form.specialty"
        required
      >
        <option value="" disabled selected>Selecciona una especialidad</option>
        <option>Análisis</option>
        <option>Nutrición</option>
        <option>Rayos</option>
        <option>Fisioterapia</option>
      </AppSelect>
    </transition>

    <transition name="fade">
      <AppInput
        v-show="form.specialty"
        label="Hora"
        v-model="form.time"
        type="time"
      />
    </transition>

    <transition name="fade">
      <div class="form-group" v-show="form.time">
        <label for="description">Descripción</label>
        <textarea id="description" v-model="form.description" rows="3" />
      </div>
    </transition>

    <transition name="fade">
      <div class="checkbox-group" v-if="form.time">
        <label class="custom-checkbox">
          <input type="checkbox" v-model="form.confirmed" />
          <span class="checkmark"></span>
          Confirmada
        </label>
        <label class="custom-checkbox">
          <input type="checkbox" v-model="form.pet" />
          <span class="checkmark"></span>
          Mascota
        </label>
      </div>
    </transition>

    <transition name="fade">
      <div class="modal-actions" v-show="form.time">
        <button type="submit">Guardar</button>
        <button type="button" @click="close" class="cancel">Cancelar</button>
        <DeleteDateBtn @deleteClick="close" />
      </div>
    </transition>
  </AppForm>
</template>

<script setup>
// Importamos funciones de Vue necesarias para reactividad y propiedades computadas
import { reactive, computed } from "vue";

// Importamos el botón de eliminación de citas
import DeleteDateBtn from "@/components/Coordinador/DeleteDateBtn.vue";
import AppForm from "../common/AppForm.vue";
import AppInput from "../common/AppInput.vue";
import AppSelect from "../common/AppSelect.vue";

// Definimos las propiedades que este componente espera recibir
const props = defineProps({
  selectedDay: { type: Number, required: true }, // Día seleccionado, obligatorio
});

// Definimos los eventos que el componente puede emitir
const emit = defineEmits(["close", "save"]);

// Objeto reactivo que representa el formulario de la cita
const form = reactive({
  dni: "", // DNI del paciente
  patient: "", // Nombre del paciente
  specialty: "", // Especialidad médica
  time: "", // Hora de la cita
  description: "", // Descripción adicional (opcional)
  confirmed: false, // Si la cita está confirmada
  pet: false, // Si se trata de una mascota
});

// Computed que calcula el progreso del formulario basado en campos obligatorios
const progress = computed(() => {
  const keys = ["dni", "patient", "specialty", "time"]; // Campos obligatorios
  const filled = keys.filter((k) => form[k]?.trim()).length; // Cuántos están llenos
  return (filled / keys.length) * 100; // Porcentaje de progreso
});

// Función que se ejecuta al enviar el formulario
async function submit() {
  // Creamos el objeto cita con los datos del formulario
  const nuevaCita = {
    dni: parseInt(form.dni), // DNI convertido a número
    nombre: form.patient, // Nombre del paciente
    especialidad: form.specialty, // Especialidad
    hora: form.time, // Hora
    descripcion: form.description || "", // Descripción o cadena vacía
    confirmada: form.confirmed, // Confirmación
    mascota: form.pet, // Mascota
    day: props.selectedDay, // Día recibido como prop
  };

  emit("save", nuevaCita); // Emitimos el evento 'save' con la nueva cita
  close(); // Cerramos el modal
}

// Función para emitir el cierre del modal
function close() {
  emit("close");
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

:root {
  --primary: var(--azul-profesional);
  --danger: #e53935;
  --bg: #ffffff;
  --shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  --transition: 0.3s ease;
  --radius: 12px;
}

/* Barra de progreso */
.progress-bar {
  height: 6px;
  background: var(--primary);
  transition: width 0.4s ease;
  border-radius: 20px;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border-radius: 8px;
  border: 1.5px solid #ccc;
  font-size: 1rem;
  transition: border-color var(--transition), box-shadow var(--azul-profesional);
  font-family: "Inter", sans-serif;
}
input:focus,
select:focus,
textarea:focus {
  border-color: var(--azul-profesional);
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
  outline: none;
}

.custom-checkbox {
  position: relative;
  padding-left: 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  user-select: none;
  display: flex;
  align-items: center;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 1.2rem;
  width: 1.2rem;
  background-color: #f0f0f0;
  border: 2px solid #ccc;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.custom-checkbox:hover input ~ .checkmark {
  background-color: #e6e6e6;
  border-color: var(--primary);
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: var(--primary);
  border-color: var(--primary);
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark::after {
  display: block;
}

.custom-checkbox .checkmark::after {
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

button {
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

button[type="submit"] {
  background-color: var(--primary);
  color: white;
}

button[type="submit"]:hover {
  background-color: #388e3c;
  transform: translateY(-1px);
}

.cancel {
  background-color: var(--danger);
  color: white;
}

.cancel:hover {
  background-color: #c62828;
  transform: translateY(-1px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
</style>
