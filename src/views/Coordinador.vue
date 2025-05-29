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

      <div class="layout">
        <!-- Calendario a la izquierda -->
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
        <!-- Citas a la derecha -->
        <div class="contenido">
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
              new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(
                undefined,
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )
            "
            :citas="citasTomorrow"
            @update-cita="handleUpdateCita"
            @delete-cita="handleDeleteCita"
          />
        </div>
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
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: calc((100vh - 64px) - 2rem); /* Ajusta según la altura del header */
}

.acciones {
  padding: 1rem 0;
}

.layout {
  display: flex;
  gap: 2rem;
  flex: 1 1 0;
  min-height: 0;
  height: 100%;
}

.contenido {
  flex: 1 1 0;
  min-width: 0;
  max-width: 75%;
  gap: 1rem;
  display: flex;
  flex-direction: column;
}

.calendario {
  flex: 0 0 20%;
  min-width: 0;
  max-width: 20%;
  height: auto;
  aspect-ratio: 1 / 1;
  background-color: #2e3b4e;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  box-sizing: border-box;
  align-self: flex-start;
}
</style>
