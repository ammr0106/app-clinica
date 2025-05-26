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
import CardUser from './CardUser.vue';

const userStore =useUserStore()

onMounted(() => {
    userStore.loadUsers()
})

const users = computed(() => userStore.users)

</script>

<style scoped>
</style>