<template>
  <div class="citas-container">
    <!-- Título con la fecha -->
    <h3>
      Citas para mañana, <span class="fecha">{{ fecha }}</span
      >:
    </h3>

    <!-- Lista de citas con animación al añadir/quitar -->
    <transition-group name="fade" tag="ul" class="citas-list">
      <!-- Iteramos sobre el array citas, mostrando cada cita -->
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
          <div
            v-for="(cita, i) in citas"
            :key="i"
            class="cita-card"
            @click="openOptions(cita, i)"
          >
            <tr class="cita-info">
              <th class="cita-nombre">{{ cita.client_name }}</th>
              <th class="cita-hora">{{ cita.time }}</th>
              <th class="cita-razon">{{ cita.reason }}</th>
              <th class="cita-especialidad">{{ cita.specialty_name }}</th>
              <th class="cita-trabajador">{{ cita.employee_name }}</th>
              <th
                class="cita-estado"
                :class="{
                  'estado-pendiente': cita.status === 'Pendiente',
                  'estado-confirmada': cita.status === 'Confirmado',
                  'estado-cancelada': cita.status === 'Cancelado',
                }"
              >
                {{ cita.status }}
              </th>
              <th class="cita-nota">{{ cita.note }}</th>
              <th class="cita-mascota">{{ cita.pet_name }}</th>
            </tr>
          </div>
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
  fecha: {
    type: String,
    required: true,
  },
  citas: {
    type: Array,
    default: () => [],
  },
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

thead {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  backdrop-filter: blur(4px);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.cita-encabezado {
  text-align: left;
  color: #263238;
}

tbody {
  display: block;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
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

.cita-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.cita-info,
.cita-encabezado {
  display: grid;
  grid-template-columns:
    minmax(100px, 1.5fr)   /* Nombre */
    minmax(60px, 0.2fr)    /* Hora */
    minmax(120px, 2.5fr)   /* Razón */
    minmax(80px, 0.8fr)    /* Especialidad */
    minmax(100px, 1.5fr)   /* Trabajador */
    minmax(80px, 0.75fr)   /* Estado */
    minmax(120px, 2.5fr)   /* Nota */
    minmax(80px, 0.75fr);  /* Mascota */
  gap: 1rem;
}
.cita-mascota,
.cita-nombre {
  font-weight: bold;
  color: #ffffff;
  min-width: 20px;
}

.cita-hora {
  font-size: 0.9rem;
  color: #cbe9f3;
  min-width: 40px;
}
.cita-estado {
  border: 0px solid;
  padding: 0.2rem 1rem;
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
thead {
  border-radius: 12px;
}
.cita-estado,
.citas-container thead {
  display: flex;
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
.cita-info th,
.cita-encabezado th {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.cita-razon,
.cita-nota{
  min-width: 40px;
}

.cita-especialidad,
.cita-trabajador,
.cita-estado {
  min-width: 80px;
}

</style>
