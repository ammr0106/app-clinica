<template>
  <div class="menu-burger">
    <button class="burger-btn" @click="toggleSidebar">
      <span class="burger-line"></span>
      <span class="burger-line"></span>
      <span class="burger-line"></span>
    </button>

    <!-- Transición suave para Sidebar -->
    <transition name="sidebar-slide">
      <Sidebar v-if="isOpen" @close="toggleSidebar" />
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'

const isOpen = ref(false)

function toggleSidebar() {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.menu-burger {
  display: flex;
  align-items: center;
  position: relative;
}

.burger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 26px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1;
}

.burger-line {
  width: 100%;
  height: 3px;
  background-color: var(--blanco-puro);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Animación de entrada y salida */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
