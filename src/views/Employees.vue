<template>
    <Header :menu-items="menuItems"/>
    <main class="content">
        <div class="top-bar">
            <!--Hay que cambiar la searchbar al componente + genérico cuando esté terminado-->
            <AppSearchbar v-model="search"/> 
            <AppButton variant="primary" @click="showModalAddUser = true" class="addBtn">Añadir usuario</AppButton>
        </div>
        <!--Modal para añadir usuario-->
        <ModalAddUser v-if="showModalAddUser" @close="showModalAddUser = false"/>
        <div class="table">
            <TableUsers/>
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
const showModalAddUser = ref(false)

//Creación de las opciones del sidebar.
const menuItems =[
    { label: 'Inicio', path: '/coordinador'},
    { label: 'Empleados', path:'/employees'}
]   
console.log('menuitems: ', menuItems)

</script>

<style scoped>
.top-bar{
    display: flex;
}
.addBtn{
    width: 30%;
}
</style>
