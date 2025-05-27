<template>
  <AppForm @submit="handleSubmit">
    <div class="form-grid">
      <AppInput
        v-model="pet.name"
        label="Nombre"
        placeholder="Ingrese el nombre"
        id="name"
        required
      />
      <AppInput
        v-model="pet.kind"
        label="Tipo"
        placeholder="Ingrese el tipo"
        id="kind"
        required
      />
      <AppInput
        v-model="pet.breed"
        label="Raza"
        placeholder="Ingrese la raza"
        id="breed"
      />
      <AppInput
        v-model="pet.birthdate"
        label="Fecha de Nacimiento"
        type="date"
        id="birthdate"
      />
      <AppInput
        v-model="pet.chip_number"
        label="Número de Chip"
        placeholder="Ingrese el número de chip"
        id="chip_number"
      />
      <AppInput
        v-model="pet.observations"
        label="Observaciones"
        placeholder="Ingrese las observaciones"
        id="observations"
      />
    </div>

    <div class="buttons">
      <AppButton type="submit" variant="green">Guardar</AppButton>
      <AppButton @click="close">Cancelar</AppButton>
    </div>
  </AppForm>
</template>

<script setup>
import AppForm from "@/components/common/AppForm.vue";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  pet: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["submit", "close"]);

// Define pet as a ref
const pet = ref({ ...props.pet });

// Watch for changes in the pet prop and update the local pet
watch(
  () => props.pet,
  (newPet) => {
    // Convertir chip_number a string si es un número
    if (typeof newPet.chip_number === 'number') {
      newPet.chip_number = String(newPet.chip_number);
    }
    pet.value = { ...newPet };
  },
  { deep: true, immediate: true }
);

const handleSubmit = () => {
  emit("submit", { ...pet.value });
};

const close = () => {
  emit("close");
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
  margin-top: 1rem;
  gap: 1rem;
}
</style>