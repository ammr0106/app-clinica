# 📘 Componente: AppForm

Componente contenedor que maneja envío de formularios con estado de carga (loading) accesible para los botones hijos.

### ✅ Uso básico

<AppForm :onSubmit="handleSubmit">
  <!-- tus inputs y botones aquí -->
</AppForm>

### Props
onSubmit (Function) — Requerido
Función que se ejecuta cuando se envía el formulario.

### Comportamiento automático
Provee el estado de carga (formLoading) a los hijos mediante provide().

Si hay un AppButton dentro con type="submit", este mostrará "Cargando..." automáticamente durante el envío.

Si onSubmit lanza un error, lo captura en consola y termina el loading.

### Ejemplo completo

<AppForm :onSubmit="guardarDatos">
  <AppInput v-model="form.nombre" label="Nombre" required />
  <AppButton type="submit" variant="green">Guardar</AppButton>
</AppForm>

<script setup>
const guardarDatos = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  alert("Guardado con éxito ✅")
}
</script>

