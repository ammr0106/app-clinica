<template>
  <div class="coordinador-container">
    <Header />

    <main class="main-content">
      <div class="acciones">
        <button class="btn">Crear cita</button>
        <button class="btn">Modificar cita</button>
      </div>

      <div class="contenido">
        <!-- Calendario -->
        <div class="calendario">
          <!-- Aquí puedes usar tu componente de calendario -->
          <Calendar />
        </div>

        <!-- Citas del día -->
        <Dates />
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Dates from '@/components/Coordinador/Dates.vue'
import Calendar from '@/components/Coordinador/Calendar.vue' 
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
