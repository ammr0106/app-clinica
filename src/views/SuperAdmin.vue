<template>
  <div class="superadmin-container">
    <!-- Header -->
    <Header />

    <!-- Contenido principal -->
    <main class="content">
      <!-- Barra superior -->
      <div class="top-bar">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar sede..."
          class="search-input"
        />
        <button class="create-button" @click="abrirModal">Crear sede</button>
      </div>

      <!-- Grid de sedes -->
      <div class="grid">
        <div class="sede-card" v-for="n in 9" :key="n">
          Sede {{ n }}
        </div>
      </div>
    </main>

    <!-- Modal -->
    <ModalSede
      v-if="mostrarModal"
      @close="cerrarModal"
      @enviar="guardarSede"
    />
  </div>
</template>


<script setup>
import Header from '@/components/Header.vue'
import { ref } from 'vue'
import ModalSede from '../components/ModalSede.vue';
const search = ref('')
const mostrarModal = ref(false)

const abrirModal = () => {
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardarSede = (datos) => {
  console.log('Sede guardada:', datos)
  cerrarModal()
}
</script>

<style scoped>
.superadmin-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.content {
  padding: 2rem;
  flex: 1;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 240px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.2);
  border-color: #1565c0;
}

.create-button {
  background-color: var(--azul-profesional, #1565c0);
  color: white;
  padding: 0.8rem 1.4rem;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #0d47a1;
}

/* Grid ajustado a 3x3 */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.sede-card {
    max-width: 500px;
  background-color: white;
  padding: 5rem;
  margin: 50px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  font-weight: bold;
  color: var(--azul-profesional, #1565c0);
  font-size: 1.1rem;
}
</style>
