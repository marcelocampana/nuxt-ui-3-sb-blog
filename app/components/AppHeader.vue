<script setup lang="ts">
const route = useRoute()

const selectedLanguage = ref('ESP')
const languages = [{
  label: 'ESP',
  value: 'ESP'
}, {
  label: 'ENG', 
  value: 'ENG'
}]

const items = computed(() => [{
  label: 'Nosotros',
  to: '/nosotros',
  children: [{
    label: 'Bradford Hill Norte',
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
      <div class="hidden sm:flex items-center gap-1 rounded-md p-1">
        <UButton
          label="ESP"
          :variant="selectedLanguage === 'ESP' ? 'solid' : 'ghost'"
          size="xs"
          @click="selectedLanguage = 'ESP'"
          class="text-xs"
        />
        <UButton
          label="ENG"
          :variant="selectedLanguage === 'ENG' ? 'solid' : 'ghost'"
          size="xs"
          @click="selectedLanguage = 'ENG'"
          class="text-xs"
        />
      </div>

      <UButton
        label="Te evaluamos"
        to="/login"
        class="bg-red text-white"
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
