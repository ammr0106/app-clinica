<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h3>Modificar cita</h3>
      <form @submit.prevent="save">
        <label>
          Nombre:
          <!-- Input enlazado bidireccionalmente con editedCita.nombre -->
          <input v-model="editedCita.nombre" required />
        </label>
        <label>
          Hora:
          <!-- Input tipo time enlazado con editedCita.hora -->
          <input v-model="editedCita.hora" type="time" required />
        </label>
        <label>
          Descripción:
          <!-- Textarea enlazado con editedCita.descripcion -->
          <textarea v-model="editedCita.descripcion"></textarea>
        </label>
        <div class="buttons">
          <!-- Botón para guardar los cambios -->
          <button type="submit">Guardar</button>

          <!-- Botón para eliminar la cita, llama a handleDelete -->
          <DeleteDateBtn
            :citaId="editedCita.id"
            @delete="eliminarCita"
            @close="emit('close')"
/>



          <!-- Botón para cerrar el modal sin guardar -->
          <button type="button" @click="close">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import DeleteDateBtn from './DeleteDateBtn.vue'
import { supabase } from '@/services/DatabaseConnection.js'

// Definimos los eventos que este componente puede emitir
const emit = defineEmits(['close', 'save', 'delete'])

// Definimos la prop 'cita' que es un objeto obligatorio
const props = defineProps({
  cita: {
    type: Object,
    required: true
  }
})

// Creamos un objeto reactivo para editar la cita,
// inicializado con una copia de la prop 'cita'
const editedCita = reactive({ ...props.cita })

// Usamos watch para actualizar editedCita si cambia la prop cita
watch(() => props.cita, (newCita) => {
  Object.assign(editedCita, newCita)
})

// Función que se ejecuta al guardar el formulario
function save() {
  // Emitimos el evento 'save' pasando la cita editada
  emit('save', { ...editedCita })
}

// Función para cerrar el modal
function close() {
  emit('close')
}

// Función para manejar la eliminación de la cita
async function eliminarCita(id) {
  try {
    const { error } = await supabase
      .from('Dates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar la cita:', error.message)
      return
    }

    console.log('Cita eliminada con éxito')

    // Actualiza la lista después de eliminar
    await fetchCitas()

  } catch (err) {
    console.error('Error inesperado al eliminar la cita:', err.message || err)
  }
}
</script>



<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.modal-content {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  opacity: 1;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-overlay:not(.active) .modal-content {
  transform: translateY(-20px);
  opacity: 0;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;
}

h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #1565C0, #43A047);
  border-radius: 3px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
  color: #34495e;
}

input, textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.8);
}

input:focus, textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.buttons {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

button[type="submit"] {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

button[type="submit"]:hover {
 scale: 1.05;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: 0.3s ease;
}

/*Cancelar */
button[type="button"] {
  background: #3498db;
  color: #ffffff;
}

button[type="button"]:hover {
   scale: 1.05;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: 0.3s ease;
}

/* Efecto de aparición */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  animation: modalFadeIn 0.4s ease-out forwards;
}

/* Responsive */
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }
  
  .buttons {
    flex-direction: column;
  }
  
  button {
    width: 100%;
  }
}
</style>