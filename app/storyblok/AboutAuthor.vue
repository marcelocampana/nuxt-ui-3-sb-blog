<template>
  <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Sobre el Autor</h2>
    
    <div class="flex items-start gap-4">
      <div class="flex-shrink-0">
        <img 
          :src="blok.avatar?.filename || '/default-avatar.jpg'" 
          :alt="blok.name"
          class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
        />
      </div>
      
      <div class="flex-1">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ blok.name }}</h3>

                <p class="text-blue-600 font-medium mb-3">{{ blok.role }}</p>
        <p class="text-gray-600 leading-relaxed">{{ blok.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  blok: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Dr. Carlos Mendoza',
      title: 'Director de Oncología Torácica - Centro de Investigación Oncológica',
      description: 'El Dr. Carlos Mendoza es un reconocido especialista con más de 15 años de experiencia en el diagnóstico y tratamiento de cáncer de pulmón. Graduado de la Universidad Nacional de Medicina, ha publicado más de 50 artículos científicos y participado en investigaciones clínicas internacionales. Actualmente dirige el programa de detección temprana de cáncer de pulmón en el Centro de Investigación Oncológica y es miembro del consejo editorial de la Revista Latinoamericana de Oncología.',
      avatar: null
    })
  }
})
</script>
