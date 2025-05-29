<template>
  <div class="coordinador-container">
    <Header :menuItems="menuItems" />

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
          :authData="authStore"
          @close="showModal = false"
          @save="showSuccess"
          :isEdit="null"
        />
      </Modal>
    </main>

    <AppNotification
      v-if="notification.show"
      :message="notification.message"
      :type="notification.type"
      :duration="5000"
      @hidden="notification.show = false"
    />
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
import AppNotification from "@/components/common/AppNotification.vue";

const notification = ref({
  show: false,
  message: "",
  type: "success",
});

function showSuccess() {
  notification.value = {
    show: true,
    message: "Cita creada correctamente.",
    type: "success",
  };
}

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
    await authStore.fetchUser();
  }
  if (!appointmentStore.appointments.length) {
    console.log("📥 Cargando citas desde store...");
    await appointmentStore.loadAppointments();
    watch(
      () => appointmentStore.appointments,
      (nuevasCitas) => {
        citas.value = nuevasCitas;
      },
      { immediate: true }
    );
    console.log("Citas cargadas:", citas.value);
  }
});
const rol = authStore.profile.rol;

const menuItems = [
  { label: "Inicio", path: "/headquarters" },
  ...(rol === "coordinator"
    ? [{ label: "Empleados", path: "/employees" }]
    : []),
  { label: "Clientes", path: "/clients" },
  { label: "Mascotas", path: "/pets" },
];
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
  height: calc((100vh - 64px) - 2rem);
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
  flex: 1 1 0;
  min-width: 0;
  max-width: 75%;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.calendario {
  flex: 0 0 25%;
  max-width: 25%;
  min-width: 220px;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  background-color: #2e3b4e;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  box-sizing: border-box;
  align-self: flex-start;
}
/* --- Responsive para tablet y móvil --- */
@media (max-width: 1024px) {
  .main-content {
    padding: 1rem;
  }
  .layout {
    flex-direction: column;
    gap: 1rem;
    height: auto;
  }
  .calendario {
    max-width: 100%;
    min-width: 0;
    width: 100%;
    aspect-ratio: unset;
    align-self: stretch;
    margin-bottom: 1rem;
  }
  .contenido {
    max-width: 100%;
    width: 100%;
  }
}
</style>
