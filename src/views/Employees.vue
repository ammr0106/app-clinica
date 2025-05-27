<template>
    <Header :menu-items="menuItems"/>
    <main class="content">
        <div class="top-bar">
            <AppSearchbar v-model="search" v-model:filter="filter"
                :filtros="[
                    { label: 'Nombre', value: name },
                    { label: 'Rol', value: rol }
                ]"
            /> 
            <AppButton variant="primary" @click="showModalAddUser = true" class="addBtn">Añadir usuario</AppButton>
        </div>
        <!--Modal para añadir usuario-->
        <ModalAddUser v-if="showModalAddUser" @close="showModalAddUser = false"/>
        <div>
            <TableUsers :search="search" :filter="filter"/>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/common/Header.vue'
import AppSearchbar from '@/components/common/AppSearchbar.vue'
import AppButton from '@/components/common/AppButton.vue'
import ModalAddUser from '@/components/Employees/ModalAddUser.vue'
import TableUsers from '@/components/Employees/TableUsers.vue'

const search = ref('')
const filter = ref('nombre')
const showModalAddUser = ref(false)

//Creación de las opciones del sidebar.
const menuItems =[
    { label: 'Inicio', path: '/coordinador'},
    { label: 'Empleados', path:'/employees'}
]   

</script>

<style scoped>
.top-bar{
    display: flex;
}
.addBtn{
    width: 30%;
}
</style>
