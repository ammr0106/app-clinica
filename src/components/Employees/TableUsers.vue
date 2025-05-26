<template>
    <CardUser 
    v-for="user in users"
    :key="user.id"
    :user="user"
    @edit="ModalEditUser"
    @delete="ConfirmDeleteUsr"
    />
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useAuthStore } from '@/stores/useAuthStore'
import CardUser from './CardUser.vue';

const userStore = useUserStore()
const authStore = useAuthStore()

onMounted(() => {
    userStore.loadUsers()
})
//Función para filtrar los usuarios a mostrar según el id de la sede del usuario logueado.
/* const users = computed(() => {
    const headquartersId = authStore.user?.id_headquarters
    return userStore.users.filter(user => user.id_headquarters === headquartersId)
})*/
const users = computed(() => userStore.users)//mostrarlos sin filtro.

</script>

<style scoped>
</style>