<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-red-500 border border-gray-200 rounded-lg p-6 my-8">
    <h3 class="text-xl font-bold text-gray-900 mb-4">
      Sobre el Autor
    </h3>
    
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          <UAvatar
            v-if="blok.avatar?.filename"
            :src="blok.avatar.filename"
            :alt="`Foto de ${blok.name}`"
            size="lg"
          />
          <UAvatar
            v-else
            :alt="blok.name"
            size="lg"
          />
        </div>
      </div>
      
      <!-- Información del autor -->
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-gray-900 mb-1">
          {{ blok.name }}
        </h4>
        
        <p class="text-sm text-gray-600 mb-3 italic">
          {{ blok.role }}
        </p>
        
        <p class="text-sm text-gray-700 leading-relaxed">
          {{ blok.quote }}
        </p>
      </div>
    </div>
  </div>
</template>


