<template>
  <AppForm @submit="handleSubmit">
    <div class="form-grid">
      <AppInput
        v-model:modelValue="props.client.name"
        label="Nombre"
        placeholder="Ingrese el nombre"
        id="name"
        required
      />
      <AppInput
        v-model:modelValue="props.client.first_surname"
        label="Primer Apellido"
        placeholder="Ingrese el primer apellido"
        id="first_surname"
        required
      />
      <AppInput
        v-model:modelValue="props.client.second_surname"
        label="Segundo Apellido"
        placeholder="Ingrese el segundo apellido"
        id="second_surname"
      />
      <AppInput
        v-model:modelValue="props.client.DNI"
        label="DNI"
        placeholder="Ingrese el DNI"
        id="DNI"
        required
      />
      <AppInput
        v-model:modelValue="props.client.phone"
        label="Teléfono"
        placeholder="Ingrese el teléfono"
        id="phone"
      />
      <AppInput
        v-model:modelValue="props.client.email"
        label="Email"
        type="email"
        placeholder="Ingrese el email"
        id="email"
      />
      <AppInput
        v-model:modelValue="props.client.address"
        label="Dirección"
        placeholder="Ingrese la dirección"
        id="address"
      />
    </div>

    <div class="form-group">
      <label for="hasPet">¿Tiene Mascota?</label>
      <input type="checkbox" id="hasPet" v-model="hasPet" />
    </div>

    <AppButton v-if="hasPet" @click="openPetsForm">Añadir Mascota</AppButton>

    <div class="buttons">
      <AppButton variant="green" type="submit">Guardar</AppButton>
      <AppButton @click="close">Cancelar</AppButton>
      <AppButton v-if="props.isEdit" type="button" @click="handleDelete" variant="red">Eliminar Cliente</AppButton>
    </div>
  </AppForm>
</template>

<script setup>
import AppForm from "@/components/common/AppForm.vue";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";
import { ref, watch, defineProps } from "vue";
import { useClientStore } from "@/stores/useClientStore"; 

const props = defineProps({
  client: {
    type: Object,
    required: false,
    default: () => ({
      name: "",
      first_surname: "",
      second_surname: "",
      DNI: "",
      phone: "",
      email: "",
      address: "",
      id_headquarters: null  // Agrega id_headquarters al default
    }),
  },
  headquartersId: {
    type: [String, Number],
    required: false,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["submit", "close", "open-pets-form"]);

const clientStore = useClientStore(); // Inicializa la store
const hasPet = ref(false);

// Define client as a ref
const client = ref({ ...props.client });

// Watch for changes in the client prop and update the local client
watch(
  () => props.client,
  (newClient) => {
    client.value = { ...newClient };
  },
  { deep: true, immediate: true }
);

const handleSubmit = (event) => {
   event?.preventDefault?.(); 
  client.value.id_headquarters = props.headquartersId;
  emit("submit", { ...client.value }, event);
};

const close = () => {
  emit("close");
};

const openPetsForm = () => {
  emit("open-pets-form");
};

const handleDelete = () => {
  if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    emit("delete", props.client);
  }
};
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}
</style>