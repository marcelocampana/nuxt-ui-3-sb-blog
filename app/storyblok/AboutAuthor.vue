<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <UCard class="my-8">
    <template #header>
      <h3 class="text-xl font-semibold">
        Sobre el Autor
      </h3>
    </template>

    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Avatar -->
      <div class="flex-shrink-0">
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
      
      <!-- Información del autor -->
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-gray-900 mb-1">
          {{ blok.name }}
        </h4>
        
        <UBadge v-if="blok.role" variant="subtle" class="mb-3">
          {{ blok.role }}
        </UBadge>
        
        <p class="text-sm text-gray-700 leading-relaxed">
          {{ blok.quote }}
        </p>
      </div>
    </div>
  </UCard>
</template>


