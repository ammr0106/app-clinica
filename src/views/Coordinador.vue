<template>
  <div class="coordinador-container">
    <Header />

    <main class="main-content">
      <div class="acciones">
        <AppButton @click="showModal = true">Crear cita</AppButton>
      </div>

      <div class="layout">
        <div class="calendario">
          <Calendar
            :selectedDay="selectedDay"
            :selectedMonth="selectedMonth"
            :selectedYear="selectedYear"
            @selectDay="handleDaySelected"
            @changeMonth="handleChangeMonth"
            @changeYear="handleChangeYear"
          />
        </div>
        <div class="contenido">
          <Dates :fecha="fecha" :citas="citasDelDia" />
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

      <Modal @close="showModal = false" v-if="showModal" title="Crear cita">
        <MakeDateForm
          :selectedDate="fechaFormateada"
          :authData = "authStore"
          @close="showModal = false"
          @save="handleSave"
        />
      </Modal>
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
import { useAppointmentStore } from "@/stores/useAppointmentStore";
import { useCalendar } from "@/Composables/useCalendar";
import AppButton from "@/components/common/AppButton.vue";
import Modal from "@/components/common/Modal.vue";
import MakeDateForm from "@/components/Coordinador/MakeDateForm.vue";
import { useAuthStore } from "@/stores/useAuthStore";

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
} = useCalendar();

// Inicializamos el store
const appointmentStore = useAppointmentStore();
const authStore = useAuthStore();

// Provee el día seleccionado a componentes hijos
provide("selectedDay", selectedDay);

//Modal
const showModal = ref(false);

// Cargamos las citas si el array está vacío
onMounted(async () => {
  if (!authStore.user || !authStore.profile) {
    await authStore.fetchUser()
  }
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
  margin: 0px 0 20px 0;
  width: 8%;
  min-width: 100px;
}

.layout {
  display: flex;
  gap: 2rem;
  flex: 1 1 0;
  min-height: 0;
  height: 100%;
}

.contenido {
  flex: 2 1 0;
  display: grid;
  flex-direction: column;
  flex: auto;
  width: 700px;
  min-width: 600px;
  max-width: 100%;
  gap: 1rem;
}

.calendario {
  flex: 1 1 320px;
  min-width: 350px;
  max-width: 450px;
  height: 350px;
  aspect-ratio: 1 / 1;
  background-color: #2e3b4e;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  box-sizing: border-box;
  align-self: flex-start;
}
</style>
