<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})

const surround = ref([
  {
    title: 'Estudios clínicos oncológicos: Guía para el paciente',
    description: 'Guía para pacientes sobre estudios clínicos oncológicos, incluyendo qué esperar y cómo participar.',
    path: '/components/content-search-button',

  
  },
  {
    title: 'Nuevos tratamientos contra el cáncer',
    description: 'Exploración de los últimos avances en tratamientos contra el cáncer, incluyendo terapias dirigidas e inmunoterapia.',
    path: '/components/content-toc',
    stem: '3.components/content-toc',
 
  }
])

console.log('blok', props.blok);

const items = computed(() => {
  return [
    { label: 'Inicio', to: '/' },
    { label: 'Blog', to: '/blog' },
    // { label: props.blok.title, to: `/blog/${props.blok.slug}` }
  ];
});

// Usar composables
const { renderTable } = useRichTextTable();
const { generateTocFromContent } = useExtractH2Links();

// Verificar si el contenido es válido para renderizar
const isValidContent = computed(() => {
    console.log(props.blok.content);
  return props.blok && 
         props.blok.content && 
         typeof props.blok.content === 'object';
});

// Generar TOC desde el contenido usando el composable
const tocLinks = computed(() => {
  if (!isValidContent.value) return [];
  return generateTocFromContent(props.blok.content);
});

console.log(tocLinks.value);



// Función personalizada para renderizar rich text manteniendo anchors existentes
const renderRichTextWithIds = (content) => {
  if (!content) return '';
  
  // No necesitamos modificar el contenido porque los anchors ya están en Storyblok
  // Solo renderizamos el contenido tal como viene
  if (content.type === 'doc' && 
      content.content && 
      content.content.some(node => node.type === 'table')) {
    return renderTable(content);
  } else {
    return renderRichText(content);
  }
};

const renderedRichText = computed(() => {
  if (!isValidContent.value) return '';
  
  try {

    
    // Renderizar con anchors existentes
    return renderRichTextWithIds(props.blok.content);
  } catch (error) {
    console.error('Error al renderizar Rich Text:', error);
    return '<p>Error al procesar el contenido</p>';
  }
});
</script>

<template>
  <UContainer v-if="blok">
    <!-- Breadcrumb fuera del UPageHeader para que aparezca arriba de todo -->


    <UPageHeader
      :title="blok.title"
      :description="blok.excerpt"
    >
      <template #headline>
        <UBreadcrumb :items="items">
        <template #separator>
          <span class="mx-2 text-muted">/</span>
        </template>
      </UBreadcrumb>
   
      </template>
      <div class="flex items-center gap-2 mt-5">
        <UBadge
          v-if="blok.category"
          variant="soft">{{ blok.category }}</UBadge>

        
     <UBadge
          variant="soft">{{ blok.badge }}</UBadge>

        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ new Date(blok.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
        </div>
      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton
          v-for="(author, index) in blok.authors"
          :key="index"
          :to="author.to"
          color="neutral"
          variant="soft"
          target="_blank"
          size="sm"
        >
          <UAvatar
            v-bind="author.avatar"
            alt="Author avatar"
            size="2xs"
          />

          Editorial
        </UButton>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
          <div class="richtext-content-wrapper">
            <div class="richtext-content prose prose-lg max-w-none mx-auto">
         <div v-if="blok && isValidContent" v-html="renderedRichText"></div>



        <UContentSurround :surround="surround" :ui="{root:'mt-12', link: 'no-underline pb-1', linkTitle:'underline decoration-gray-50', linkDescription:'underline decoration-gray-50 -mt-4'}" class="underline"/>
        </div>
        </div>
      </UPageBody>

      <template
        v-if="tocLinks?.length"
        #right
      >
        <UContentToc 
          :links="tocLinks" 
          title="Tabla de Contenidos"
         
        />
      </template>
    </UPage>
  </UContainer>

</template>

¡