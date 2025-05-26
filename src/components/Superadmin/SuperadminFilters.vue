<script lang="js" setup>
import {computed, watchEffect, ref} from 'vue'
import { useHeadquartersStore } from '../../stores/useHeadquartersStore'


const store = useHeadquartersStore()
const selectCity = ref('');
const selectName = ref('');
const filterHeadquarters = ref('');

// NO DIFERENCIAR ENTRE ACENTOS Y MAYUSCULAS
const normalizeText = (text) =>
     text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  
// FILTRO DE BUSQUEDA DE INPUTS

const filterHeadquartersComputed = computed(() => {
  const textFilter = normalizeText(filterHeadquarters.value.trim());
  const city = selectCity.value;
  const name = selectName.value;

  return store.headquarters.filter((hq) => {
     const matchText = (
      normalizeText(hq.name || '').includes(textFilter) ||
      normalizeText(hq.city || '').includes(textFilter) ||
      normalizeText(hq.address || '').includes(textFilter) ||
      normalizeText(hq.phone || '').includes(textFilter)
    );

    const matchCity = city === '' || hq.city === city;
    const matchName = name === '' || hq.name === name;
    
    return matchText && matchCity && matchName;
  });
})

// OBTENER LISTAS DE CIUDADES Y NOMBRES
const cities = computed(() => {
  const setCity = new Set();
  store.headquarters.forEach(hq => hq.city && setCity.add(hq.city));
  return Array.from(setCity);
});

const names = computed(() => {
  const setName = new Set();
  store.headquarters.forEach(hq => hq.name && setName.add(hq.name));
  return Array.from(setName);
});

// OBTENER LISTA FILTRADA
const emit = defineEmits(['update:filters']);

watchEffect(() => {
    emit('update:filters', filterHeadquartersComputed.value )
})
</script>

<template>
    <div name="containerFilters">
        <input
          v-model="filterHeadquarters"
          type="text"
          placeholder="Buscar por su nombre, ciudad, dirección..."
          class="filterInputHeadquarters"
        >
    <div name="containerFilertsSelect" >
      <details>
        <summary>Imagen de carpetiña</summary>
            <select
              v-model="selectCity"
              class="selectCity">
                  <option value="">Todas las ciudades</option>
                  <option v-for="(city, index) in cities" :key="index" :value="city">{{ city }}</option>
            </select>

            <select
              v-model="selectName"
              class="selectName">
                <option value="">Todas las nombres de las sedes</option>
                <option v-for="(name, index) in names" :key="index" :value="name">{{ name }}</option>
            </select>
      </details>
    </div>
    </div>
</template>