<script setup>
defineProps({
  blok: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="page-container">
    <UContainer v-if="blok">
      <!-- Título de la página -->
      <h1 v-if="blok.title" class="text-3xl font-bold mb-6">{{ blok.title }}</h1>
      
      <!-- Renderizar cada bloque secundario -->
      <template v-if="blok.body">
        <StoryblokComponent 
          v-for="block in blok.body" 
          :key="block._uid" 
          :blok="block" 
        />
      </template>
    </UContainer>
  </div>
</template>
