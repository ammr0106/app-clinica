<template>
  <div class="citas-container">
    <h3>Citas para <span class="fecha">{{ fecha }}</span>:</h3>

    <transition-group name="fade" tag="ul" class="citas-list">
      <li
  v-for="(cita, i) in citas"
  :key="cita.id || i"
  class="cita-card"
  @click="openOptions(cita, i)"
>
  <div class="cita-info">
    <p><strong>Nombre:</strong> {{ cita.nombre }}</p>
    <p><strong>DNI:</strong> {{ cita.dni }}</p>
    <p><strong>Hora:</strong> {{ cita.hora }}</p>
  </div>
</li>
    </transition-group>

    <div v-if="citas.length === 0" class="cita-vacia">
      No hay citas para este día.
    </div>

    <EditDateModal
      v-if="showEditModal"
      :cita="selectedCita"
      @save="handleSaveEdit"
      @delete="handleDeleteCita"
      @close="closeModals"
    />

    <DeleteDateModal
      v-if="showDeleteModal"
      :cita="selectedCita"
      @confirm="handleDelete"
      @close="closeModals"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import EditDateModal from './EditDateModal.vue'
import DeleteDateModal from './DeleteDateModal.vue'
import { supabase } from '@/services/DatabaseConnection'

const props = defineProps({
  fecha: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-cita', 'delete-cita'])

const citas = ref([])
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedCita = ref(null)
const selectedIndex = ref(null)

watch(() => props.fecha, fetchCitas, { immediate: true })

function extraerFecha(fechaString) {
  const regex = /(?:\w+,\s*)?(\d{1,2}) de (\w+) de (\d{4})/
  const match = fechaString?.match(regex)

  if (!match) {
    throw new Error('Formato de fecha no válido')
  }

  const dia = parseInt(match[1])
  const mesTexto = match[2]?.toLowerCase()
  const anio = parseInt(match[3])

  const meses = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  }

  const mes = meses[mesTexto]
  if (isNaN(dia) || !mes || isNaN(anio)) {
    throw new Error('Valores de fecha inválidos')
  }

  return { dia, mes, anio }
}

async function fetchCitas() {
  citas.value = []

  try {
    console.log('Fecha recibida:', props.fecha)

    if (!props.fecha || typeof props.fecha !== 'string' || props.fecha.trim() === '') {
      console.warn('La fecha está vacía o mal definida:', props.fecha)
      return
    }

    const { dia, mes, anio } = extraerFecha(props.fecha)
    console.log('Fecha parseada:', { dia, mes, anio })

    const { data, error } = await supabase
      .from('Dates')
      .select('id, Nombre, DNI, Hora') // Solo los campos que vas a usar brodeeeerrrrrrrrrrrrrrr
      .eq('Dia', dia)
      .eq('Mes', mes)
      .eq('Anio', anio)
      .order('Hora', { ascending: true })

    if (error) {
      console.error('Error de Supabase:', error)
      throw error
    }

    console.log('Citas recuperadas:', data)

    // Mapear campos con nombres esperados por el template
    citas.value = (data || []).map(item => ({
      id: item.id,
      nombre: item.Nombre,
      dni: item.DNI,
      hora: item.Hora
    }))
    
    console.log('Citas procesadas:', citas.value)

  } catch (error) {
    console.error('Error al cargar las citas:', error.message || error)
    citas.value = []
  }
}


function openOptions(cita, index) {
  console.log('Cita seleccionada:', cita)
  selectedCita.value = { ...cita }
  selectedIndex.value = index
  showEditModal.value = true
}

function closeModals() {
  showEditModal.value = false
  showDeleteModal.value = false
  selectedCita.value = null
  selectedIndex.value = null
}

function handleSaveEdit(editedCita) {
  console.log('Guardando cita editada:', editedCita)
  emit('update-cita', { editedCita, index: selectedIndex.value })
  closeModals()
}

function handleDeleteCita(id) {
  console.log('Cita eliminada con ID:', id)
  emit('delete-cita', id)
  closeModals()
}
</script>



<style scoped>
.citas-container {
  background: linear-gradient(to bottom right, #177ca9, #15587b);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-left: 1rem;
  flex-grow: 1;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  font-family: 'Segoe UI', sans-serif;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
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

.cita-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.cita-card:hover {
  transform: scale(1.015);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.cita-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.cita-info p {
  margin: 0;
  font-size: 1rem;
  color: #e9f8ff;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.cita-info p strong {
  color: #ffffff;
  min-width: 65px;
  display: inline-block;
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
  transform: translateY(10px);
}
</style>

