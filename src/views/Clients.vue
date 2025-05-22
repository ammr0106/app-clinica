<template>
  <div class="clients-container">
    <Header />

    <main class="main-content">
      <div class="search-and-buttons">
        <Searchbar v-model="searchTerm" class="searchbar"/>
        <div class="buttons">
          <AppButton @click="openCreateClientForm">Agregar Cliente</AppButton>
          <AppButton @click="openEditClientForm" :disabled="!selectedClient">Editar Cliente</AppButton>
        </div>
      </div>

      <ClientsTable :clients="filteredClients" @select-client="selectClient" />

      <ClientsForm
        v-if="showClientForm"
        :client="selectedClient"
        @close="closeClientForm"
        @submit="handleClientSubmit"
      />
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import { ref, onMounted, computed } from 'vue';
import Searchbar from '@/components/Searchbar.vue';
import ClientsTable from '@/components/Clients/ClientsTable.vue';
import ClientsForm from '@/components/Clients/ClientsForm.vue';
import AppButton from '@/components/common/AppButton.vue';
import { fetchClients } from '@/services/ClientService'; 

// Datos del nuevo cliente
const nuevoCliente = ref({
  name: '',
  first_surname: '',
  second_surname: '',
  DNI: '',
  phone: '',
  email: '',
  address: '',
  id_headquarters: null
});

// Lista de clientes
const clientes = ref([]);
const searchTerm = ref('');
const showClientForm = ref(false);
const selectedClient = ref(null);

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
      address: '',
      id_headquarters: null
    }
    getClientes()
    alert('Cliente creado correctamente!')
  }
}

// Función para obtener la lista de clientes
const getClientes = async () => {
  try {
    const data = await fetchClients();
    clientes.value = data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
  }
};

// Obtener la lista de clientes al montar el componente
onMounted(() => {
  getClientes()
})

const filteredClients = computed(() => {
  return clientes.value.filter(client => {
    return client.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
           client.first_surname.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
           client.second_surname.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
           client.DNI.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
});

const openCreateClientForm = () => {
  selectedClient.value = null;
  showClientForm.value = true;
};

const openEditClientForm = () => {
  showClientForm.value = true;
};

const closeClientForm = () => {
  showClientForm.value = false;
  selectedClient.value = null;
};

const selectClient = (client) => {
  selectedClient.value = client;
};

const handleClientSubmit = () => {
  getClientes();
  closeClientForm();
};
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
  flex-direction: column;
  align-items: center; /* Centra horizontalmente */
}

.search-and-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%; /* Ajusta el ancho */
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

/* Estilos existentes */
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

.searchbar {
  width: 70%; /* Ajusta el ancho de la barra de búsqueda */
}
</style>