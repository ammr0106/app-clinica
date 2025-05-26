<template>
  <AppForm @submit="handleSubmit">
    <div class="form-grid">
      <AppInput
        v-model="localPet.name"
        label="Nombre de la Mascota"
        placeholder="Ingrese el nombre de la mascota"
        id="petName"
        required
      />
      <AppInput
        v-model="localPet.kind"
        label="Tipo de Mascota"
        placeholder="Ingrese el tipo de mascota"
        id="petKind"
        required
      />
      <AppInput
        v-model="localPet.breed"
        label="Raza"
        placeholder="Ingrese la raza"
        id="petBreed"
      />
      <AppInput
        v-model="localPet.birthdate"
        label="Fecha de Nacimiento"
        type="date"
        id="petBirthdate"
      />
      <AppInput
        v-model="localPet.chip_number"
        label="Número de Chip"
        placeholder="Ingrese el número de chip"
        id="petChipNumber"
      />
      <AppInput
        v-model="localPet.observations"
        label="Observaciones"
        placeholder="Ingrese observaciones"
        id="petObservations"
      />
    </div>

    <div class="buttons">
      <AppButton type="submit">Guardar Mascota</AppButton>
      <AppButton @click="close">Cancelar</AppButton>
    </div>
  </AppForm>
</template>

<script setup>
import AppForm from "@/components/common/AppForm.vue";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";
import { defineProps, defineEmits, ref } from "vue";

const emit = defineEmits(["submit", "close"]);

const localPet = ref({
  name: "",
  kind: "",
  birthdate: "",
  chip_number: "",
  observations: "",
  breed: "",
});

const handleSubmit = () => {
  emit("submit", localPet.value);
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
}
</style>