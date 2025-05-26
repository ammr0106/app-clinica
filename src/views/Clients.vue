<template>
  <div class="clients-container">
    <Header :menuItems="menuItems" />

    <main class="main-content">
      <div class="search-and-buttons">
        <ClientSearchBar @search="handleSearch" class="client-search"/>
        <div class="buttons">
          <AppButton @click="openCreateClientForm" type="button">Agregar Cliente</AppButton>
          <AppButton @click="openEditClientForm" :disabled="!selectedClient" type="button">Editar Cliente</AppButton>
        </div>
      </div>

      <ClientsTable :clients="filteredClients" @select-client="selectClient" />

      <AppModal v-if="showClientForm" @close="closeClientForm">
        <ClientsForm
          :client="selectedClient"
          :headquartersId="headquartersId"
          :isEdit="!!selectedClient?.id"
          @close="closeClientForm"
          @submit="handleSubmitClientForm"
          @open-pets-form="openPetsForm"
        />
      </AppModal>

      <AppModal v-if="showPetsForm" @close="closePetsForm">
        <PetsForm
          :clientId="selectedClient?.id" 
          @close="closePetsForm"
          @submit="handlePetSubmit"
        />
      </AppModal>
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue';
import { ref, onMounted, computed } from 'vue';
import ClientsTable from '@/components/Clients/ClientsTable.vue';
import ClientsForm from '@/components/Clients/ClientsForm.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppModal from '@/components/Clients/AppModal.vue';
import PetsForm from '@/components/Clients/PetsForm.vue';
import ClientSearchBar from '@/components/Clients/ClientSearchBar.vue';
import { useClientStore } from "@/stores/useClientStore";
import { usePetsStore } from "@/stores/usePetStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useHeadquartersStore } from "@/stores/useHeadquartersStore";  // Importa la store de headquarters

const clientStore = useClientStore();
const petStore = usePetsStore();
const authStore = useAuthStore();
const headquartersStore = useHeadquartersStore();  // Inicializa la store de headquarters

const searchTerm = ref('');
const filterBy = ref('name');
const showClientForm = ref(false);
const selectedClient = ref(null);
const showPetsForm = ref(false);
const currentClientId = ref(null);

const menuItems = [
  { label: "Clientes", path: "/clients" },
  // Agrega aquí los demás items del menú
  // DEBERÍA CREARSE UN STORE
];

const newClient = ref({
  name: '',
  first_surname: '',
  second_surname: '',
  DNI: '',
  phone: '',
  email: '',
  address: '',
  id_headquarters: null
});

const headquartersId = computed(() => authStore.profile?.id_headquarters || null);

onMounted(async () => {
  await clientStore.loadClients();
  await headquartersStore.loadHeadquarters();  // Carga las sedes al montar el componente
})

const filteredClients = computed(() => {
  return clientStore.clients.filter(client => {
    const term = searchTerm.value.toLowerCase();
    const filter = filterBy.value;

    if (!term) {
      return true;
    }

    return String(client[filter]).toLowerCase().includes(term);
  });
});

const openCreateClientForm = () => {
  selectedClient.value = {
    name: '',
    first_surname: '',
    second_surname: '',
    DNI: '',
    phone: '',
    email: '',
    address: '',
    id_headquarters: headquartersId.value
  };
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
  selectedClient.value = { ...client };
};

const handleCreateClient = async (clientData) => {
  try {
    const isValidHeadquarters =
      !clientData.id_headquarters ||
      headquartersStore.headquarters.some(
        (hq) => hq.id === clientData.id_headquarters
      );

    if (!isValidHeadquarters) {
      console.error("Error: ID de sede inválido");
      alert("Error: ID de sede inválido");
      return;
    }

    const error = await clientStore.createClient(clientData);
    if (error) {
      console.error("Error al crear cliente:", error);
      alert("Error al crear cliente: " + error.message);
    } else {
      clientStore.loadClients();
      closeClientForm();
    }
  } catch (error) {
    console.error("Error al crear cliente:", error);
    alert("Error al crear cliente: " + error.message);
  }
};

const handleEditClient = async (clientData) => {
  try {
    // Divide el full_name en sus componentes
    const { name, first_surname, second_surname } = splitFullName(clientData);

    const isValidHeadquarters =
      !clientData.id_headquarters ||
      headquartersStore.headquarters.some(
        (hq) => hq.id === clientData.id_headquarters
      );

    if (!isValidHeadquarters) {
      console.error("Error: ID de sede inválido");
      alert("Error: ID de sede inválido");
      return;
    }

    // Crea un nuevo objeto con los datos separados
    const updatedClientData = {
      name,
      first_surname,
      second_surname,
      DNI: clientData.DNI,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      id_headquarters: clientData.id_headquarters,
    };

    const error = await clientStore.editClient(selectedClient.value.id, updatedClientData);
    if (error) {
      console.error("Error al editar cliente:", error);
      alert("Error al editar cliente: " + error.message);
    } else {
      clientStore.loadClients();
      closeClientForm();
    }
  } catch (error) {
    console.error("Error al editar cliente:", error);
    alert("Error al editar cliente: " + error.message);
  }
};

// Función auxiliar para dividir el nombre completo
const splitFullName = (clientData) => {
  const name = clientData.name || "";
  const first_surname = clientData.first_surname || "";
  const second_surname = clientData.second_surname || "";
  return { name, first_surname, second_surname };
};

const handleSubmitClientForm = async (clientData, event) => {
  event?.preventDefault?.();
  if (selectedClient.value && selectedClient.value.id) {
    await handleEditClient(clientData);
  } else {
    await handleCreateClient(clientData);
  }
};

const openPetsForm = () => {
  showPetsForm.value = true;
};

const closePetsForm = () => {
  showPetsForm.value = false;
};

const handlePetSubmit = () => {
  closePetsForm();
};

const handleSearch = (searchParams) => {
  searchTerm.value = searchParams.term;
  filterBy.value = searchParams.filter;
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

.client-search {
  width: 70%;
}
</style>