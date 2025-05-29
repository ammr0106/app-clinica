<template>
  <div class="citas-container">
    <!-- Título con la fecha -->
    <h3>
      Citas para <span class="fecha">{{ fecha }}</span
      >:
    </h3>

    <!-- Lista de citas con animación al añadir/quitar -->
    <transition-group name="fade" tag="ul" class="citas-list">
      <table>
        <thead>
          <tr class="cita-encabezado">
            <!-- Encabezados de la tabla -->
            <th>Nombre</th>
            <th>Hora</th>
            <th>Razón</th>
            <th>Especialidad</th>
            <th>Trabajador</th>
            <th>Estado</th>
            <th>Nota</th>
            <th>Mascota</th>
          </tr>
        </thead>
        <tbody>
          <!-- Iteramos sobre el array citas, mostrando cada cita -->
            <tr :id="cita.id"
            v-for="(cita, i) in citas"
            :key="i"
            class="cita-card cita-info"
            @click="openOptions(cita, i)"
            >
              <td class="cita-nombre">{{ cita.client_name }}</td>
              <td class="cita-hora">{{ cita.time }}</td>
              <td class="cita-razon">{{ cita.reason }}</td>
              <td class="cita-especialidad">{{ cita.specialty_name }}</td>
              <td class="cita-trabajador">{{ cita.employee_name }}</td>
              <td
                class="cita-estado"
                :class="{
                  'estado-pendiente': cita.status === 'Pendiente',
                  'estado-confirmada': cita.status === 'Confirmada',
                  'estado-cancelada': cita.status === 'Cancelada',
                  'estado-realizada': cita.status === 'Realizada',
                }"
              >
                {{ cita.status }}
              </td>
              <td class="cita-nota">{{ cita.note }}</td>
              <td class="cita-mascota">{{ cita.pet_name }}</td>
            </tr>

          <!-- Si no hay citas, mostramos un mensaje -->
          <tr v-if="citas.length === 0" key="no-citas" class="cita-vacia">
            No hay citas para este día.
          </tr>
        </tbody>
      </table>
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
  padding: 1rem;
  margin-left: 1rem;
  flex-grow: 1;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.25);
  font-family: "Segoe UI", sans-serif;
  flex-direction: column;
  justify-content: flex-start;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.fecha {
  text-decoration: underline;
  color: #b4e8ff;
}

.citas-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

table {
  border-collapse: collapse;
}
thead th {
  margin: 0.2rem 0.2rem;
}


.cita-encabezado {
  text-align: left;
  color: #263238;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  border-radius: 12px;
}

tbody {
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
}
tbody tr:first-child {
  padding-top: 1rem;
}
.cita-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  backdrop-filter: blur(4px);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  width: 99.5%;
}
.cita-card:first-child {
  margin-top: 1rem;
}
.cita-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.cita-info,
.cita-encabezado {
  display: grid;
  grid-template-columns:
    minmax(90px, 1.5fr)   /* Nombre */
    minmax(60px, 0.2fr)    /* Hora */
    minmax(100px, 2fr)   /* Razón */
    minmax(70px, 0.8fr)    /* Especialidad */
    minmax(90px, 1.5fr)   /* Trabajador */
    minmax(80px, 1fr)   /* Estado */
    minmax(100px, 2fr)   /* Nota */
    minmax(70px, 0.75fr);  /* Mascota */
  gap: 0.7rem;
  width: 100%;
}
.cita-mascota,
.cita-nombre {
  font-weight: bold;
  color: #ffffff;
}

.cita-hora {
  font-size: 0.9rem;
  color: #cbe9f3;
}
.cita-estado {
  display: flex;
  align-items: center;
  border: 0px solid;
  padding: 0.2rem 0.4rem;
  font-weight: bold;
  justify-content: center;
  text-align: center;
  height: 100%;
  max-width: 100px;
  min-width: auto;
}
.cita-estado.estado-pendiente {
  background: #ffffff;
  color: #263238;
}

.cita-estado.estado-confirmada {
  background: #43a047;
  color: #263238;
}

.cita-estado.estado-cancelada {
  background: #ef5350;
  color: #263238;
}

.cita-estado.estado-realizada {
  background: #999999;
  color: #263238;
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
.cita-estado,
.citas-container,
.cita-card,
thead,
table {
  border-radius: 12px;
}

.citas-list,
table,
thead,
.cita-encabezado,
tbody,
.cita-info {
  width: 100%;
}
thead,
.cita-encabezado,
.cita-card,
.cita-info {
  justify-content: space-between;
}
thead,
.cita-estado,
.cita-card {
  align-items: center;
}
.cita-info > td,
.cita-encabezado > th {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  font-size: clamp(0.8rem, 1.2vw, 1.1rem); /* Tamaño responsivo */
  padding: 0.5rem 0.2rem;
  border: none;
}
.cita-encabezado > th {
  border-radius: 12px;
}
.cita-encabezado > th:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
.cita-encabezado > th:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>
