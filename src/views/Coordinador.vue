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
        <DatesTomorrow
          :fecha="
            new Date(Date.now() + 24*60*60*1000).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          "
          :citas="citasTomorrow"
          @update-cita="handleUpdateCita"
          @delete-cita="handleDeleteCita"
        />
      </div>
    </main>
  </div>
</template>

<script setup>

// Importaciones de Supabase
import { supabase } from '../services/DatabaseConnection.js'
// Importaciones de Vue
import { ref, provide, computed, watch, onMounted } from "vue";
// Importaciones de componentes
import Header from "@/components/common/Header.vue";
import Dates from "@/components/Coordinador/Dates.vue";
import DatesTomorrow from "@/components/Coordinador/DatesTomorrow.vue";
import Calendar from "@/components/Coordinador/Calendar.vue";
import MakeDateBtn from "@/components/Coordinador/MakeDateBtn.vue";
// Importamos el store de citas
import { useAppointmentStore } from "@/stores/useAppointmentStore";
import { useCalendar } from "@/Composables/useCalendar";

const {
  selectedDay,
  selectedMonth,
  selectedYear,
  citas,
  citasDelDia,
  citasTomorrow,
  fechaFormateada,
  handleChangeMonth,
  handleChangeYear,
  handleDaySelected,
  handleCreateDate,
  handleUpdateCita,
  handleDeleteCita,
} = useCalendar();

// Inicializamos el store
const appointmentStore = useAppointmentStore();

// Provee el día seleccionado a componentes hijos
provide("selectedDay", selectedDay);

// Cargamos las citas si el array está vacío
onMounted(async () => {
  if (!appointmentStore.appointments.length) {
    console.log("📥 Cargando citas desde store...");
    await appointmentStore.loadAppointments();
    citas.value = appointmentStore.appointments;
    console.log("Citas cargadas:", citas.value);
  }
});

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
