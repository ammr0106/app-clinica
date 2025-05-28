<script lang="js" setup>
import { ref, onMounted } from "vue";
import SuperadminFilters from "../Superadmin/SuperadminFilters.vue";
import SuperadminCreateButton from "../Superadmin/SuperadminCreateButton.vue";
import SuperadminButton from "../Superadmin/SuperadminButton.vue";
import { useHeadquartersStore } from "../../stores/useHeadquartersStore";

const store = useHeadquartersStore();

const filteredList = ref(store.headquarters);
const selectId = ref(null);

// OBTENER DATOS DE LA SEDE (solo necesito el nombre)
onMounted(async () => {
  await store.loadHeadquarters();
});

const selectHeadquater = (id) => {
  selectId.value = selectId.value === id ? null : id;
};
</script>

<template>
  <main>
    <div name="containerComplete">
      <SuperadminFilters @update:filters="filteredList = $event" />
      <SuperadminCreateButton />

      <div name="headquartesData">
        <div v-if="store.loading">Cargando datos de las sedes...</div>
        <div v-else-if="store.error">{{ store.error }}</div>
        <div v-else></div>
        <div v-if="filteredList.length === 0">No existen resultados</div>
        <div v-else>
          <div v-for="(headquater, index) in filteredList" :key="index">
            <button @click="selectHeadquater(headquater.id)">{{ headquater.name }}</button>
            <SuperadminButton v-if="selectId === headquater.id" :headquater="headquater"/>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
