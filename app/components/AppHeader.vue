<script setup lang="ts">
const route = useRoute()

const items = computed(() => [{
  label: 'Nosotros',
  to: '/nosotros',
  children: [{
    label: 'BHN',
    to: '/bhn'
  }]
}, {
  label: 'Estudios Clínicos',
  to: '/estudios-clinicos'
}, {
  label: 'Publicaciones',
  to: '/publicaciones'
}, {
  label: 'Comité de Ética',
  to: '/comite-etica'
}, {
  label: 'Comunicaciones',
  children: [{label: 'Preguntas Frecuentes', to: '/faqs', description: 'Preguntas Frecuentes sobre Estudios Clínicos'}, {
    label: 'Blog',
    to: '/blog',
    description: 'Articulos de investigación, innovación y esperanza en el tratamiento del cáncer'
  }, {
    label: 'Prensa',
    to: '/prensa',
    description: 'Noticias y comunicados de prensa'
  }],

}, {
  label: 'Contacto',
  to: '/contacto'
}])
</script>

<template>
  <UHeader>
    <template #left>
    
        <LogoPro/>
    
    
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      content-orientation="vertical"
      :ui="{link: 'text-sm font-semibold text-gray-900 dark:text-neutral-100 hover:text-red'}"
    />

    <template #right>


      <!-- <UButton
        icon="i-lucide-log-in"
        color="neutral"
        variant="ghost"
        to="/login"
        class="lg:hidden"
      /> -->

      <UButton
        label="Te evaluamos"
       
        
        to="/login"
        class="hidden lg:inline-flex bg-red text-white"
      />

   
    </template>

    <template #body>
      <!-- <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      /> -->

      <USeparator class="my-6" />

      <!-- <UButton
        label="Sign in"
        color="neutral"
        variant="subtle"
        to="/login"
        block
        class="mb-3"
      />
      <UButton
        label="Sign up"
        color="neutral"
        to="/signup"
        block
      /> -->
    </template>
  </UHeader>
</template>
