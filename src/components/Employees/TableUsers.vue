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

const props = defineProps({
    search: String,
    filter: String
})

/*Función para filtrar los usuarios a mostrar según: 
    el id del usuario logueado, sin mostrar los superadmin y según la barra de búsqueda.*/
/* const users = computed(() => {
    const headquartersId = authStore.user?.id_headquarters
    return userStore.users.filter(
        user => 
        user.id_headquarters === headquartersId &&
        user.rol !== 'superadmin &&
        (!props.search || (user.[props.filtro]?.toLowerCase().includes(props.search.toLowerCase())))
        )
})*/
const users = computed(() => userStore.users)//mostrarlos sin filtro.

onMounted(() => {
    userStore.loadUsers()
})

</script>

<style scoped>
</style>