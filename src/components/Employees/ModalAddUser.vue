<template>
    <Modal title="Añadir un nuevo usuario" @close="emit('close')">

      <AppForm :onSubmit="submitForm">
        <AppInput v-model="nombre" label="Nombre" type="text" :required="true"/>
        <AppInput v-model="primerApd" label="Primer apellido" type="text" :required="true"/>
        <AppInput v-model="segundoApd" label="Segundo apellido" type="text" :required="true"/>
        <AppInput v-model="email" label="Email" type="email" :required="true"/>
        <AppInput v-model="password" label="Contraseña" type="password" :required="true"/>
        <AppSelect v-model="rol" :options="roles" label="Rol" type="" placeholder="Selecciona un rol" :required="true"/>
        <AppButton type="submit" variant="primary">Añadir</AppButton>
      </AppForm>

    </Modal>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../common/Modal.vue'
import AppButton from '../common/AppButton.vue';
import AppForm from '../common/AppForm.vue';
import AppInput from '../common/AppInput.vue';
import AppSelect from '../common/AppSelect.vue';
import { useAuthStore } from '@/stores/useAuthStore'
import { useUserStore } from '@/stores/useUserStore'

const emit = defineEmits(['close','submit']);

const nombre = ref('')
const primerApd = ref('')
const segundoApd = ref('')
const email = ref('')
const password = ref('')
const rol = ref('')
const userStore = useUserStore()

//Accede al id de la sede del usuario logueado
const authStore = useAuthStore()
const id_headquarters = authStore.user?.id_headquarters

//Establece los roles aceptados para mostrar en el formulario.
const roles = [
    {label: 'Coordinador', value:'coordinator'},
    {label: 'Trabajador', value:'worker'}
]

//Función para manejar el submit del formulario.
const submitForm = async () => {
  try{
    const error = await userStore.createUser({
      name: nombre.value,
      first_surname: primerApd.value,
      second_surname: segundoApd.value,
      email: email.value,
      rol: rol.value,
      date: new Date().toISOString(),
      id_headquarters
    })
    if (error){
      alert('Error al crear usuario: '+ error.message);
      return;
    }
    emit('submit')
    emit('close')
  } catch (err) {
    alert('Error inesperado: '+ err.message)
  }
}
</script>

