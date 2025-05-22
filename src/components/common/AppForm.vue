<template>
  <form @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script setup>
import { ref, provide } from "vue";
const emit = defineEmits(["submit"]);

const loading = ref(false);
provide("formLoading", loading);

const handleSubmit = async () => {
  loading.value = true;
  try {
    emit("submit");
  } finally {
    loading.value = false;
  }
};
</script>
