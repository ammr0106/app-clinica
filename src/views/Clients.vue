<template>
  <div class="clients-container">
    <Header />

    <main class="main-content">
      
      <!-- Panel para crear clientes -->
      <div class="crear-cliente-panel">
        <h2>Crear Nuevo Cliente</h2>
        <form @submit.prevent="crearCliente">
          <div class="form-group">
            <label for="name">Nombre:</label>
            <input type="text" id="name" v-model="nuevoCliente.name" required>
          </div>
          <div class="form-group">
            <label for="first_surname">Primer Apellido:</label>
            <input type="text" id="first_surname" v-model="nuevoCliente.first_surname" required>
          </div>
          <div class="form-group">
            <label for="second_surname">Segundo Apellido:</label>
            <input type="text" id="second_surname" v-model="nuevoCliente.second_surname" required>
          </div>
          <div class="form-group">
            <label for="DNI">DNI:</label>
            <input type="text" id="DNI" v-model="nuevoCliente.DNI" required>
          </div>
           <div class="form-group">
            <label for="phone">Teléfono:</label>
            <input type="tel" id="phone" v-model="nuevoCliente.phone" required>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="nuevoCliente.email" required>
          </div>
           <div class="form-group">
            <label for="address">Dirección:</label>
            <input type="text" id="address" v-model="nuevoCliente.address" required>
          </div>
          <button type="submit" class="btn">Guardar Cliente</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import { ref, onMounted } from 'vue';

// Datos del nuevo cliente
const nuevoCliente = ref({
  name: '',
  first_surname: '',
  second_surname: '',
  DNI: '',
  phone: '',
  email: '',
  address:'',
  id_headquarters: null
})

// Lista de clientes
const clientes = ref([])

// Función para crear el cliente
const crearCliente = async () => {
  const coordinadorId = 123 // Reemplaza con la lógica para obtener el ID del coordinador

  nuevoCliente.value.id_headquarters = coordinadorId

  const { data, error } = await supabase
    .from('client')
    .insert([nuevoCliente.value])
    .select()

  if (error) {
    console.error('Error al crear cliente:', error)
    alert('Error al crear cliente: ' + error.message)
  } else {
    console.log('Cliente creado:', data)
    nuevoCliente.value = {
      name: '',
      first_surname: '',
      second_surname: '',
      DNI: '',
      phone: '',
      email: '',
      address:'',
      id_headquarters: null
    }
    getClientes()
    alert('Cliente creado correctamente!')
  }
}

// Función para obtener la lista de clientes
const getClientes = async () => {
  const { data, error } = await supabase
    .from('client')
    .select('*')

  if (error) {
    console.error('Error al obtener clientes:', error)
  } else {
    clientes.value = data
  }
}

// Obtener la lista de clientes al montar el componente
onMounted(() => {
  getClientes()
})
</script>

<style scoped>
.clients-container {
  background-color: #f0fdfc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding: 1rem;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center; /* Centra el panel del formulario */
}

.crear-cliente-panel {
  background-color: #fff;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 50%;
  margin-top: 2rem;
}

.crear-cliente-panel h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 0.8rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}
</style>