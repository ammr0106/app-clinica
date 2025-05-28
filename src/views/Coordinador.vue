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
    @changeMonth="handleMonthChange"  
    @changeYear="handleYearChange"    
  />
        </div>

        <!-- Componente que muestra las citas -->
        <Dates
          :fecha="fecha"                          
          :citas="citasDelDia"                    
          @update-cita="handleUpdateCita"          
          @delete="eliminarCita"          
        />
      </div>
    </main>
  </div>
</template>

<script setup>

// Importaciones de Supabase
import { supabase } from '../services/DatabaseConnection.js'
// Importaciones de Vue
import { ref, provide, computed, watch, onMounted } from 'vue'
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

function handleMonthChange(newMonth) {
  selectedMonth.value = newMonth // Asignamos directamente al .value de la ref
}

function handleYearChange(newYear) {
  selectedYear.value = newYear // Asignamos directamente al .value de la ref
}
// Estado reactivo para almacenar todas las citas
const citas = ref([])

// 👉 1. Cargar citas desde Supabase
async function cargarCitas() {
  const { data, error } = await supabase.from('Dates').select('*')
  if (error) {
    console.error('Error cargando citas:', error.message)
  } else {
    citas.value = data.map((cita) => {
      const fecha = new Date(cita.created_at)
      return {
        ...cita,
        day: fecha.getDate(),
        month: fecha.getMonth(),
        year: fecha.getFullYear(),
        hora: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    })
  }
}

// 👉 2. Insertar nueva cita en Supabase
async function handleCreateDate(dateInfo) {
  // Guarda en el estado local
  const nuevaCita = {
    id: Date.now(),
    day: dateInfo.day,
    month: selectedMonth.value,
    year: selectedYear.value,
    nombre: dateInfo.nombre,
    hora: dateInfo.hora,
    descripcion: dateInfo.descripcion,
    especialidad: dateInfo.especialidad,
    dni: dateInfo.dni,
    confirmada: dateInfo.confirmada,
    mascota: dateInfo.mascota,
  }

  citas.value.push(nuevaCita)

  // Guarda en Supabase
  const { error } = await supabase.from('Dates').insert([{
    DNI: nuevaCita.dni,
    Nombre: nuevaCita.nombre,
    Especialidad: nuevaCita.especialidad,
    Descripcion: nuevaCita.descripcion,
    Confirmada: nuevaCita.confirmada,
    Mascota: nuevaCita.mascota,
    Hora: nuevaCita.hora,
    Dia: nuevaCita.day,
    Mes: nuevaCita.month +1,
    Anio: nuevaCita.year
  }])

  if (error) {
    console.error('Error al guardar en Supabase:', error.message)
    alert('Error al guardar la cita en Supabase.')
  } else {
    console.log('Cita guardada correctamente en Supabase.')
  }
}

// 👉 3. Filtrar citas del día seleccionado
const citasDelDia = computed(() => {
  if (!selectedDay.value) return []
  return citas.value.filter(
    c =>
      c.day === selectedDay.value &&
      c.month === selectedMonth.value &&
      c.year === selectedYear.value
  )
})

// 👉 4. Formatear fecha
const fecha = computed(() => {
  if (!selectedDay.value) return ''
  const dateObj = new Date(selectedYear.value, selectedMonth.value, selectedDay.value)
  return dateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// 👉 5. Selección de día
function handleDaySelected(day) {
  // Actualiza el día seleccionado
  selectedDay.value = day
}

// 👉 6. Editar cita (a nivel local; puedes extenderlo para que actualice también en Supabase)
function handleUpdateCita({ editedCita, index }) {
  // Reemplaza la cita en el índice especificado
  citas.value[index] = editedCita
}

// 👉 7. Eliminar cita desde Supabase y actualizar estado local
async function handleDeleteCita(id) {
  // Elimina la cita en Supabase
  const { error } = await supabase.from('Dates').delete().eq('id', id)
  if (error) {
    console.error('Error eliminando cita:', error.message)
  } else {
    // Si se elimina correctamente, recarga las citas desde Supabase
    await cargarCitas()
  }
}

// 👉 8. Cargar citas al montar componente
onMounted(() => {
  cargarCitas()
})

// 👉 9. Guardar citas en localStorage cuando haya cambios
watch(citas, (newCitas) => {
  localStorage.setItem('citas', JSON.stringify(newCitas))
}, { deep: true }) // Observa cambios profundos en el array
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
