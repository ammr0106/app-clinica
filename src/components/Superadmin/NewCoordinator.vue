<script lang="js" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { useHeadquartersStore } from "@/stores/useHeadquartersStore";

const showModalNewC = ref(false);
const userStore = useUserStore();
const headquarterStore = useHeadquartersStore();
const selectedHeadquarters = ref(null);

const props = defineProps({
  headquater: {
    type: Object,
    required: true,
  },
});

const form = ref({
  name: "",
  first_surname: "",
  second_surname: "",
  email: "",
  date: "",
  rol: "coordinator",
});

onMounted(async () => {
  await headquarterStore.loadHeadquarters();

  if (props.headquater && headquarterStore.headquarters.length > 0) {
    selectedHeadquarters.value = headquarterStore.headquarters.find(
      (h) => h.id === props.headquater.id
    );
  }

  if (!selectedHeadquarters.value) {
    selectedHeadquarters.value = headquarterStore.headquarters[0] ?? null;
  }
});

const createCoordinator = async () => {
  if (!selectedHeadquarters.value) {
    alert("Debes seleccionar una sede");
    return;
  }

  const newCoordinator = {
    name: form.value.name,
    first_surname: form.value.first_surname,
    second_surname: form.value.second_surname,
    email: form.value.email,
    date: form.value.date,
    rol: form.value.rol,
    id_headquarters: selectedHeadquarters.value.id,
  };

  const response = await userStore.createUser(newCoordinator);

    if (response && !!response.error) {
        alert("Error al crear el coordinador");
        console.error("Error de Supabase:", response.error);
    } else {
        showModalNewC.value = false;
    }

};
</script>

<template>
  <div name="containerButtonNewC">
    <button @click="showModalNewC = !showModalNewC">Crear coordinador</button>
  </div>

  <div name="containerNewCoordinator" v-if="showModalNewC">
    <form @submit.prevent="createCoordinator">
      <label>Nombre</label>
      <input type="text" v-model="form.name" required />
      <label>Primer apellido</label>
      <input type="text" v-model="form.first_surname" required />
      <label>Segundo apellido</label>
      <input type="text" v-model="form.second_surname" />
      <label>Correo</label>
      <input type="email" v-model="form.email" required />
      <label>Fecha de inicio</label>
      <input type="date" v-model="form.date" required />
      <label>Sede</label>
      <select v-model="selectedHeadquarters" required>
        <option
          v-for="headquarter in headquarterStore.headquarters"
          :key="headquarter.id"
          :value="headquarter"
        >
          {{ headquarter.name }}
        </option>
      </select>

      <button type="submit">Crear coordinador</button>
      <button type="button" @click="showModalNewC = false">Cancelar</button>
    </form>
  </div>
</template>
