<template>
  <div class="citas-container">
    <!-- Título con la fecha -->
    <h3>
      Citas para <span class="fecha">{{ fecha }}</span
      >:
    </h3>

    <!-- Lista de citas con animación al añadir/quitar -->
    <transition-group name="fade" tag="ul" class="citas-list">
      <span>nombre</span>
      <span>hora</span>
      <span>razon</span>
      <span>especialidad</span>
      <span>trabajador</span>
      <span>estado</span>
      <span>trabajador</span>
      <span>trabajador</span>
      <!-- Iteramos sobre el array citas, mostrando cada cita -->
      <li
        v-for="(cita, i) in citas"
        :key="i"
        class="cita-card"
        @click="openOptions(cita, i)"
      >
        <div class="cita-info">
          <span class="cita-nombre">{{ cita.client_name }}</span>
          <span class="cita-hora">{{ cita.time }}</span>
          <span class="cita-razon">{{ cita.reason }}</span>
          <span class="cita-especialidad">{{ cita.specialty_name }}</span>
          <span class="cita-trabajador">{{ cita.employee_name }}</span>
          <span
            class="cita-estado"
            :class="{
              'estado-pendiente': cita.status === 'Pendiente',
              'estado-confirmada': cita.status === 'Confirmado',
              'estado-cancelada': cita.status === 'Cancelado',
            }"
          >
            {{ cita.status }}
          </span>

          <span class="cita-nota">{{ cita.note }}</span>
          <span class="cita-mascota">{{ cita.pet_name }} </span>
        </div>
      </li>

      <!-- Si no hay citas, mostramos un mensaje -->
      <li v-if="citas.length === 0" key="no-citas" class="cita-vacia">
        No hay citas para este día.
      </li>
    </transition-group>

    <!-- Modal para editar cita -->
    <EditDateModal
      v-if="showEditModal"
      :cita="selectedCita"
      @save="handleSaveEdit"
      @delete="handleDeleteCita"
      @close="closeModals"
    />

    <!-- Modal para confirmar eliminación -->
    <DeleteDateModal
      v-if="showDeleteModal"
      :cita="selectedCita"
      @confirm="handleDelete"
      @close="closeModals"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import EditDateModal from "./EditDateModal.vue";
import DeleteDateModal from "./DeleteDateModal.vue";

const props = defineProps({
  fecha: String,
  citas: Array,
});

const emit = defineEmits(["update-cita", "delete-cita"]);

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedCita = ref(null);
const selectedIndex = ref(null);

function openOptions(cita, index) {
  selectedCita.value = { ...cita };
  selectedIndex.value = index;
  showEditModal.value = true;
}

function closeModals() {
  showEditModal.value = false;
  showDeleteModal.value = false;
  selectedCita.value = null;
  selectedIndex.value = null;
}

function handleSaveEdit(editedCita) {
  emit("update-cita", { editedCita, index: selectedIndex.value });
  closeModals();
}

function handleDeleteCita(id) {
  emit("delete-cita", id);
  closeModals();
}
</script>

<style scoped>
.citas-container {
  background: linear-gradient(to bottom right, #177ca9, #15587b);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-left: 1rem;
  flex-grow: 1;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.25);
  font-family: "Segoe UI", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: hidden;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.fecha {
  text-decoration: underline;
  color: #b4e8ff;
}

.citas-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  overflow-y: auto;
}

.cita-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(4px);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  width: 100%;
}

.cita-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.cita-info {
  display: grid;
  grid-template-columns:
    1.5fr /* Nombre */
    0.5fr /* Hora */
    2.5fr /* Razón */
    0.75fr /* Especialidad */
    1.5fr /* Trabajador */
    0.75fr /* Estado */
    2.5fr /* Nota */
    0.75fr; /* Mascota */
  gap: 1.5rem;
  justify-content: space-between;
  width: 100%;
}
.cita-info span {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.cita-nombre {
  font-weight: bold;
  color: #ffffff;
}

.cita-hora {
  font-size: 0.9rem;
  color: #cbe9f3;
  max-width: 20px;
}
.cita-estado {
  border: 0px solid;
  border-radius: 16px;
  padding: 0.2rem 4rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}
.cita-estado.estado-pendiente {
  background: #ffffff;
  color: #263238;
  max-width: 100px;
  min-width: auto;
}

.cita-estado.estado-confirmada {
  background: #43a047;
  color: #263238;
  max-width: 100px;
  min-width: auto;
}

.cita-estado.estado-cancelada {
  background: #ef5350;
  color: #263238;
  max-width: 100px;
  min-width: auto;
}

.cita-vacia {
  text-align: center;
  font-style: italic;
  color: #dbeffc;
  margin-top: 2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
