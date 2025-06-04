<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <UCard class="my-8"  variant="soft">
    <template #header>
      <h3 class="text-3xl font-extrabold">
        Sobre el Autor
      </h3>
    </template>

    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Avatar -->
      <div class="flex-shrink-0 mt-4">
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
      <div class="flex-1 border-0">
        <h4 class="text-lg font-semibold text-gray-900">
          {{ blok.name }}
        </h4>
        
        <p v-if="blok.role" variant="" class="mb-3 italic -mt-2">
          {{ blok.role }}
        </p>
        
        <p class=" text-gray-700 leading-relaxed">
          {{ blok.quote }}
        </p>
      </div>
    </div>
  </UCard>
</template>


