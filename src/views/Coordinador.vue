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
            @selectDay="handleDaySelected"       
            @changeMonth="(newMonth) => selectedMonth.value = newMonth"  
            @changeYear="(newYear) => selectedYear.value = newYear"      
          />
        </div>

        <!-- Componente que muestra las citas -->
        <Dates
          :fecha="fecha"                          
          :citas="citasDelDia"                    
          @update-cita="handleUpdateCita"          
          @delete-cita="handleDeleteCita"          
        />
      </div>
    </main>
  </div>
</template>

<script setup>
// Importaciones de Vue
import { ref, provide, computed, watch } from 'vue'
// Importaciones de componentes
import Header from '@/components/Header.vue'
import Dates from '@/components/Coordinador/Dates.vue'
import Calendar from '@/components/Coordinador/Calendar.vue'
import MakeDateBtn from '@/components/Coordinador/MakeDateBtn.vue'

// Estado reactivo para el día seleccionado (inicialmente null)
const selectedDay = ref(null)
// Estado reactivo para el mes seleccionado (mes actual por defecto)
const selectedMonth = ref(new Date().getMonth())
// Estado reactivo para el año seleccionado (año actual por defecto)
const selectedYear = ref(new Date().getFullYear())

// Provee el día seleccionado a componentes hijos
provide('selectedDay', selectedDay)

// Estado reactivo para almacenar todas las citas
const citas = ref([])

// Intenta cargar citas desde localStorage
const storedCitas = localStorage.getItem('citas')
// Si hay citas almacenadas
if (storedCitas) {
  try {
    // Parsea las citas desde JSON
    citas.value = JSON.parse(storedCitas)
  } catch (e) {
    // Maneja errores de parsing
    console.error('Error parsing citas from localStorage', e)
  }
}

// Watcher que observa cambios en las citas
watch(citas, (newCitas) => {
  // Guarda las citas en localStorage cuando cambian
  localStorage.setItem('citas', JSON.stringify(newCitas))
}, { deep: true }) // Observa cambios profundos en el array

// Función que maneja la selección de día desde el calendario
function handleDaySelected(day) {
  // Actualiza el día seleccionado
  selectedDay.value = day
}

// Función que maneja la creación de nuevas citas
function handleCreateDate(dateInfo) {
  // Añade nueva cita al array
  citas.value.push({
    id: Date.now(), // ID único basado en timestamp
    day: dateInfo.day, // Día de la cita
    month: selectedMonth.value, // Mes actual
    year: selectedYear.value, // Año actual
    nombre: dateInfo.patient, // Nombre del paciente
    hora: dateInfo.time, // Hora de la cita
    descripcion: dateInfo.description, // Descripción
  })
}

// Computed property que formatea la fecha seleccionada
const fecha = computed(() => {
  // Si no hay día seleccionado, retorna string vacío
  if (!selectedDay.value) return ''
  // Crea objeto Date con los valores seleccionados
  const dateObj = new Date(selectedYear.value, selectedMonth.value, selectedDay.value)
  // Retorna fecha formateada
  return dateObj.toLocaleDateString(undefined, {
    weekday: 'long',   // Nombre completo del día
    year: 'numeric',   // Año numérico
    month: 'long',     // Nombre completo del mes
    day: 'numeric',    // Día numérico
  })
})

// Computed property que filtra las citas del día seleccionado
const citasDelDia = computed(() => {
  // Si no hay día seleccionado, retorna array vacío
  if (!selectedDay.value) return []
  // Filtra citas que coincidan con día, mes y año seleccionados
  return citas.value.filter(
    c =>
      c.day === selectedDay.value &&
      c.month === selectedMonth.value &&
      c.year === selectedYear.value
  )
})

// Función que maneja la actualización de citas existentes
function handleUpdateCita({ editedCita, index }) {
  // Reemplaza la cita en el índice especificado
  citas.value[index] = editedCita
}

// Función que maneja la eliminación de citas
function handleDeleteCita(id) {
  // Filtra el array para eliminar la cita con el ID especificado
  citas.value = citas.value.filter(cita => cita.id !== id)
  // Actualiza localStorage con el nuevo array
  localStorage.setItem('citas', JSON.stringify(citas.value))
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
