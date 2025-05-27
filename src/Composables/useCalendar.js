import { ref, computed, watch } from "vue";

// Estado reactivo para el día, mes y año seleccionados
export function useCalendar(appointmentsSource = []) {
  const selectedDay = ref(null);
  const selectedMonth = ref(new Date().getMonth());
  const selectedYear = ref(new Date().getFullYear());
  const citas = ref([...appointmentsSource]);

  // Formatea un número a dos dígitos
  const pad = (n) => n.toString().padStart(2, "0");

  // Fecha seleccionada en formato YYYY-MM-DD
  const selectedDate = computed(() =>
    selectedDay.value
      ? `${selectedYear.value}-${pad(selectedMonth.value + 1)}-${pad(selectedDay.value)}`
      : ""
  );

  // Citas del día seleccionado
  const citasDelDia = computed(() => {
    if (!selectedDay.value) return [];
    return citas.value.filter((c) => c.date === selectedDate.value);
  });

  // Citas de hoy
  const citasHoy = computed(() => {
    const hoy = new Date();
    const fechaHoy = `${hoy.getFullYear()}-${pad(hoy.getMonth() + 1)}-${pad(hoy.getDate())}`;
    return citas.value.filter((c) => c.date === fechaHoy);
  });

  // Fecha seleccionada formateada para mostrar
  const fechaFormateada = computed(() => {
    if (!selectedDay.value) return "";
    const dateObj = new Date(selectedYear.value, selectedMonth.value, selectedDay.value);
    return dateObj.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Cambiar dia, mes y año
  function handleDaySelected(day) {
    selectedDay.value = day;
  }
  function handleChangeMonth(newMonth) {
    selectedMonth.value = newMonth;
    selectedDay.value = null;
  }
  function handleChangeYear(newYear) {
    selectedYear.value = newYear;
    selectedDay.value = null;
  }


  // Crear nueva cita
  function handleCreateDate(dateInfo) {
    const date = `${selectedYear.value}-${pad(selectedMonth.value + 1)}-${pad(dateInfo.day)}`;
    citas.value.push({
      id: Date.now(),
      date,
      nombre: dateInfo.patient,
      hora: dateInfo.time,
      descripcion: dateInfo.description,
      // ...otros campos
    });
  }

  // Actualizar cita
  function handleUpdateCita({ editedCita, index }) {
    citas.value[index] = editedCita;
  }

  // Eliminar cita
  function handleDeleteCita(id) {
    citas.value = citas.value.filter((cita) => cita.id !== id);
  }

  // Sincronizar con localStorage si lo necesitas
  watch(
    citas,
    (newCitas) => {
      localStorage.setItem("citas", JSON.stringify(newCitas));
    },
    { deep: true }
  );

  return {
    selectedDay,
    selectedMonth,
    selectedYear,
    citas,
    citasDelDia,
    citasHoy,
    fechaFormateada,
    selectedDate,
    handleChangeMonth,
    handleChangeYear,
    handleDaySelected,
    handleCreateDate,
    handleUpdateCita,
    handleDeleteCita,
  };
}