<template>
  <!-- Contenedor principal del coordinador -->
  <div class="coordinador-container">
    <!-- Componente de encabezado -->
    <Header />

    <!-- Contenido principal -->
    <main class="main-content">
      <!-- Sección de acciones -->
      <div class="acciones">
        <!-- Componente para crear nuevas citas -->
        <MakeDateBtn
          :selectedDay="selectedDay"
          @create-date="handleCreateDate"
        />
      </div>

      <!-- Sección de contenido principal -->
      <div class="contenido">
        <!-- Contenedor del calendario -->
        <div class="calendario">
          <!-- Componente de calendario -->
          <Calendar
            :selectedDay="selectedDay"
            :selectedMonth="selectedMonth"
            :selectedYear="selectedYear"
            @selectDay="handleDaySelected"
            @changeMonth="handleChangeMonth"
            @changeYear="handleChangeYear"
          />
        </div>

        <!-- Componente que muestra las citas -->
        <Dates
          :fecha="fecha"
          :citas="citasDelDia"
          @update-cita="handleUpdateCita"
          @delete-cita="handleDeleteCita"
        />
        <!-- Componente que muestra las citas -->
        <DatesToday
        :fecha="new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })"
        :citas="citasHoy"
        @update-cita="handleUpdateCita"
        @delete-cita="handleDeleteCita"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
// Importaciones de Vue
import { ref, provide, computed, watch, onMounted } from "vue";
// Importaciones de componentes
import Header from "@/components/common/Header.vue";
import Dates from "@/components/Coordinador/Dates.vue";
import DatesToday from "@/components/Coordinador/DatesToday.vue";
import Calendar from "@/components/Coordinador/Calendar.vue";
import MakeDateBtn from "@/components/Coordinador/MakeDateBtn.vue";
// Importamos el store de citas
import { useAppointmentStore } from "@/stores/useAppointmentStore";

// Inicializamos el store
const appointmentStore = useAppointmentStore();
// Estado reactivo para el día seleccionado (inicialmente null)
const selectedDay = ref(null);
// Estado reactivo para el mes seleccionado (mes actual por defecto)
const selectedMonth = ref(new Date().getMonth());
// Estado reactivo para el año seleccionado (año actual por defecto)
const selectedYear = ref(new Date().getFullYear());
// Computed property que filtra las citas del día actual
const citasHoy = computed(() => {
  const hoy = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const fechaHoy = `${hoy.getFullYear()}-${pad(hoy.getMonth() + 1)}-${pad(hoy.getDate())}`;
  return citas.value.filter((c) => c.date === fechaHoy);
});

// Provee el día seleccionado a componentes hijos
provide("selectedDay", selectedDay);

// Estado reactivo para almacenar todas las citas
const citas = ref([]);
// Cargamos las citas si el array está vacío
onMounted(async () => {
  if (!appointmentStore.appointments.length) {
    console.log("📥 Cargando citas desde store...");
    await appointmentStore.loadAppointments();
    citas.value = appointmentStore.appointments;
    console.log("Citas cargadas:", citas.value);
  }
});


// Watcher que observa cambios en las citas
watch(
  citas,
  (newCitas) => {
    // Guarda las citas en localStorage cuando cambian
    localStorage.setItem("citas", JSON.stringify(newCitas));
  },
  { deep: true }
); // Observa cambios profundos en el array

// Función que maneja la selección de día desde el calendario
function handleDaySelected(day) {
  // Actualiza el día seleccionado
  selectedDay.value = day;
}

// Función que maneja la creación de nuevas citas
function handleCreateDate(dateInfo) {
  const pad = (n) => n.toString().padStart(2, '0');
  const date = `${selectedYear.value}-${pad(selectedMonth.value + 1)}-${pad(dateInfo.day)}`;
  citas.value.push({
    id: Date.now(), // ID único basado en timestamp
    date, // <-- ¡Clave para el filtrado!
    nombre: dateInfo.patient, // Nombre del paciente
    hora: dateInfo.time, // Hora de la cita
    descripcion: dateInfo.description, // Descripción
    // Puedes añadir otros campos si los necesitas
  });
}

// Computed property que formatea la fecha seleccionada
const fecha = computed(() => {
  // Si no hay día seleccionado, retorna string vacío
  if (!selectedDay.value) return "";
  // Crea objeto Date con los valores seleccionados
  const dateObj = new Date(
    selectedYear.value,
    selectedMonth.value,
    selectedDay.value
  );
  // Retorna fecha formateada
  return dateObj.toLocaleDateString(undefined, {
    weekday: "long", // Nombre completo del día
    year: "numeric", // Año numérico
    month: "long", // Nombre completo del mes
    day: "numeric", // Día numérico
  });
});

// Computed property que filtra las citas del día seleccionado
const citasDelDia = computed(() => {
  if (!selectedDay.value) return [];
  // Construye la fecha seleccionada en formato YYYY-MM-DD sin problemas de zona horaria
  const pad = (n) => n.toString().padStart(2, '0');
  const selectedDate = `${selectedYear.value}-${pad(selectedMonth.value + 1)}-${pad(selectedDay.value)}`;
  return citas.value.filter((c) => c.date === selectedDate);
  console.log("Dia seleccionado:", selectedDay.value);
});

function handleChangeMonth(newMonth) {
  selectedMonth.value = newMonth;
  selectedDay.value = null; // Resetea el día seleccionado
}
function handleChangeYear(newYear) {
  selectedYear.value = newYear;
  selectedDay.value = null; // Resetea el día seleccionado
}

// Función que maneja la actualización de citas existentes
function handleUpdateCita({ editedCita, index }) {
  // Reemplaza la cita en el índice especificado
  citas.value[index] = editedCita;
}

// Función que maneja la eliminación de citas
function handleDeleteCita(id) {
  // Filtra el array para eliminar la cita con el ID especificado
  citas.value = citas.value.filter((cita) => cita.id !== id);
  // Actualiza localStorage con el nuevo array
  localStorage.setItem("citas", JSON.stringify(citas.value));
}
</script>

<style scoped>
.coordinador-container {
  background-color: #f0fdfc;
  height: 100vh;
}

.main-content {
  padding: 1rem;
}

.acciones {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
}

.btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.contenido {
  display: flex;
  gap: 1rem;
}

.calendario {
  flex: 1;
  background-color: #2e3b4e;
  color: white;
  padding: 1rem;
  border-radius: 10px;
}
</style>
