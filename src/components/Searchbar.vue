<template>
  <div class="searchbar">
    <!-- Icono lupa -->
    <span class="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </span>

    <!-- Input búsqueda -->
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="Buscar sede..."
      class="input"
    />

    <!-- Desplegable de filtros -->
    <div class="dropdown-container" @click="toggleDropdown">
      <span class="selected">{{ selectedFilter }}</span>
      <svg
        class="arrow"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
      <ul v-if="dropdownOpen" class="dropdown-menu">
        <li
          v-for="filtro in filtros"
          :key="filtro"
          @click.stop="seleccionarFiltro(filtro)"
        >
          {{ filtro }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'update:filtro'])

const selectedFilter = ref('Nombre')
const dropdownOpen = ref(false)
const filtros = ['Nombre', 'Ciudad', 'Especialidad', 'Dirección']

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function seleccionarFiltro(filtro) {
  selectedFilter.value = filtro
  dropdownOpen.value = false
  emit('update:filtro', filtro.toLowerCase())
}
</script>

<style scoped>

.searchbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  padding: 0.7rem 1rem;
  border: 2px solid #ccc;
  border-radius: 12px;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  width: 92%;
  position: relative;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.searchbar:focus-within {
  border-color: #1565c0;
  box-shadow: 0 0 0 4px rgba(21, 101, 192, 0.2);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: transform 0.2s ease;
}

.searchbar:focus-within .icon {
  transform: scale(1.2);
  color: #1565c0;
}

.icon-svg {
  width: 20px;
  height: 20px;
}

.input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #333;
  background: transparent;
}

.input::placeholder {
  color: #aaa;
  font-style: italic;
}

.dropdown-container {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.6rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  user-select: none;
}
.dropdown-container:hover {
  background-color: #e3f2fd;
}

.arrow {
  transition: transform 0.3s ease;
  color: var(--azul-profesional, #1565c0);
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: max-content;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-menu li:hover {
  background-color: #e3f2fd;
  color: #1565c0;
}
</style>
