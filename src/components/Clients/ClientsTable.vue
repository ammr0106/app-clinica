<template>
  <div class="clients-table-container">
    <table class="clients-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Primer Apellido</th>
          <th>Segundo Apellido</th>
          <th>DNI</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Dirección</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients" :key="client.id" @click="selectClient(client)" class="client-row">
          <td>{{ client.name }}</td>
          <td>{{ client.first_surname }}</td>
          <td>{{ client.second_surname }}</td>
          <td>{{ client.DNI }}</td>
          <td>{{ client.phone }}</td>
          <td>{{ client.email }}</td>
          <td>{{ client.address }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  clients: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['select-client']);

const selectClient = (client) => {
  emit('select-client', client);
};
</script>

<style scoped>
.clients-table-container {
  width: 95%;
  overflow-x: auto; /* Para hacer la tabla responsive horizontalmente */
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.clients-table th,
.clients-table td {
  padding: 0.8rem 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.clients-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #333;
}

.clients-table tbody tr:hover {
  background-color: #f0f7ff;
  cursor: pointer;
}

/* Estilo para las filas de la tabla */
.client-row {
  transition: background-color 0.2s ease; /* Transición suave para el hover */
}

.client-row:hover {
    background-color: #e3f2fd; /* Color de fondo al pasar el ratón */
}

/* Media query para hacer la tabla responsive en pantallas pequeñas */
@media (max-width: 768px) {
  .clients-table {
    font-size: 0.9rem;
  }

  .clients-table th,
  .clients-table td {
    padding: 0.6rem 0.7rem;
  }
}
</style>