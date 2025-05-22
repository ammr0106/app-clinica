<template>
  <div class="citas-container">
    <h3>Citas para <span class="fecha">{{ fecha }}</span>:</h3>

    <transition-group name="fade" tag="ul" class="citas-list">
      <li
        v-for="(cita, i) in citas"
        :key="i"
        class="cita-card"
      >
        <div class="cita-info">
          <span class="cita-nombre">{{ cita.nombre }}</span>
          <span class="cita-hora">{{ cita.hora }}</span>
        </div>
      </li>
      <li v-if="citas.length === 0" key="no-citas" class="cita-vacia">
        No hay citas para este día.
      </li>
    </transition-group>
  </div>
</template>

<script setup>
defineProps({
  fecha: {
    type: String,
    required: true,
  },
  citas: {
    type: Array,
    default: () => [],
  },
})
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
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(4px);
  transition: transform 0.2s, box-shadow 0.2s;
}

.cita-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.cita-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.cita-nombre {
  font-weight: bold;
  color: #ffffff;
}

.cita-hora {
  font-size: 0.9rem;
  color: #cbe9f3;
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
  transform: translateY(5px);
}
</style>
