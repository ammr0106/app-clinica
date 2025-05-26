<template>
    <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <button class="close-button" @click="close">×</button>
      <h2>Crear nuevo usuario</h2>

      <AppForm @submit="submitForm">
        <AppInput v-model="nombre" label="Nombre" type="text" :required="true"/>
        <AppInput v-model="primerApd" label="Primer apellido" type="text" :required="true"/>
        <AppInput v-model="segundoApd" label="Segundo apellido" type="text" :required="true"/>
        <AppInput v-model="email" label="Email" type="email" :required="true"/>
        <AppInput v-model="password" label="Contraseña" type="password" :required="true"/>
        <AppSelect v-model="rol" :options="roles" label="Rol" type="" placeholder="Selecciona un rol" :required="true"/>
        <AppButton v-model="submit" variant="primary">Añadir</AppButton>
      </AppForm>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppButton from '../common/AppButton.vue';
import AppForm from '../common/AppForm.vue';
import AppInput from '../common/AppInput.vue';
import AppSelect from '../common/AppSelect.vue';
import { useAuthStore } from '@/stores/useAuthStore'

const emit = defineEmits(['close','submit']);

const nombre = ref('')
const primerApd = ref('')
const segundoApd = ref('')
const email = ref('')
const password = ref('')
const rol = ref('')

//Accede al id de la sede del usuario logueado
const authStore = useAuthStore()
const id_headquarters = authStore.user?.id_headquarters

const roles = [
    {label: 'Coordinador', value:'coordinator'},
    {label: 'Trabajador', value:'employee'}
]

const close = () => emit('close')

const submitForm = async () => {
  try{
    const response = await fetch('https://bvpcgsajyrjjzsrutgtv.supabase.co/functions/v1/create_user_with_profile',{
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        name: nombre.value,
        first_surname: primerApd.value,
        second_surname: segundoApd.value,
        rol: rol.value,
        id_headquarters
      })
    });
    const data = await response.json();
    if (!response.ok){
      alert('Error al crear usuario: '+ (data.error?.message || JSON.stringify(data.error)));
      return;
    }
    emit('submit')
    close()
  } catch (err) {
    alert('Error inesperado: '+ err.message)
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  position: relative;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s ease-out;
}

.close-button {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}
</style>