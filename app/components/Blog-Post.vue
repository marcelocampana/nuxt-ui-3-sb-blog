<script setup>
import { computed } from 'vue';

const props = defineProps({
  blok: {
    type: Object,
    required: true,
  },
})

// Procesamos el objeto UI de forma dinámica
const uiConfig = computed(() => {
  try {
    // Si es una cadena, intentamos convertirla a un objeto válido
    if (typeof props.blok.ui_overrides === 'string') {
      // Intentamos diferentes enfoques para convertir la cadena
      
      // 1. Intentamos evaluar la cadena como código JavaScript
      try {
        // Usamos Function para evaluar de forma segura la expresión
        // Envolvemos la cadena en paréntesis para asegurar que se evalúa como un objeto
        return Function('"use strict"; return (' + props.blok.ui_overrides + ')')();
      } catch (evalError) {
        console.log('No se pudo evaluar directamente:', evalError);
      }
      
      // 2. Intentamos limpiar la cadena y parsearla como JSON
      try {
        // Reemplazamos las comillas simples por dobles
        let jsonStr = props.blok.ui_overrides
          .replace(/'/g, '"') // Cambia comillas simples a dobles
          .replace(/(\w+):/g, '"$1":'); // Añade comillas a las claves
          
        return JSON.parse(jsonStr);
      } catch (jsonError) {
        console.log('No se pudo parsear como JSON:', jsonError);
      }
    } 
    // Si ya es un objeto, lo usamos directamente
    else if (props.blok.ui_overrides && typeof props.blok.ui_overrides === 'object') {
      return props.blok.ui_overrides;
    }
  } catch (error) {
    console.error('Error procesando UI:', error);
  }
  
  // Si no podemos procesar el valor, devolvemos un objeto vacío
  return {};
});

console.log('UI procesado:', uiConfig.value);
</script>

<template>
  <UBlogPost
    title="Introducing Nuxt Icon v1"
    description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
    :ui="uiConfig"
  />
</template>
