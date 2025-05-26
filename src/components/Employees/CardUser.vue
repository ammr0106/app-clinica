<template>
    <div class="card-user">
        <div class="user-info">
            <p><strong>Nombre:</strong> {{ user.full_name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Rol:</strong> {{ user.rol }}</p>
        </div>
        <!--Botones para la gestión de usuarios-->
        <div class="action">
        <AppButton variant="primary" @click="$emit('edit',user)">Editar</AppButton>
        <AppButton variant="primary" @click="$emit('delete',user)">Eliminar</AppButton>
        </div>
    </div>
</template>

<script setup>
import AppButton from '../common/AppButton.vue'

defineProps({
    user: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
.card-user {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.user-info p {
  margin: 0 0 4px 0;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>