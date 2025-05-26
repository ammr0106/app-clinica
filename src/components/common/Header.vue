<template>
  <header class="header">
    <div class="header-left"></div>

    <div class="header-center">
      <h1 class="clinic-name">
        Multispecialty<span class="accent">Clinic</span>
      </h1>
    </div>

    <div class="header-right">
      <AppSideBar :menu-items="menuItems" />
    </div>
  </header>
  <AuthModal v-if="showAuth" @close="showAuth = false" />
</template>

<script setup>
import AppSideBar from "@/components/common/AppSideBar.vue";

const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, var(--azul-profesional), #0d47a1);
  color: var(--blanco-puro);
  padding: 1.2rem 2.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-bottom: 3px solid var(--verde-confianza);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-left {
  flex: 1;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.2rem;
}

.clinic-name {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.accent {
  color: var(--verde-confianza);
  margin-left: 0.3rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(255, 255, 255, 0.08);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  transition: background 0.3s ease;
}

.user-menu:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.user-icon {
  font-size: 1.8rem;
  color: var(--blanco-puro);
  transition: transform 0.3s ease;
}

.user-menu:hover .user-icon {
  transform: scale(1.1);
}

.username {
  font-size: 1rem;
  font-weight: 500;
  font-family: "Roboto", sans-serif;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .clinic-name {
    font-size: 1.2rem;
  }

  .username {
    display: none;
  }
}
</style>
