<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})

console.log('blok', props.blok);

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

// Debug para ver la estructura del contenido
const contentDebug = ref('');

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
  if (!isValidContent.value) return 'nada';
  
  try {
    console.log('aqui estoy rich');
    // Guardar contenido para depuración
    contentDebug.value = JSON.stringify(props.blok.content, null, 2);
    
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
    <UPageHeader
      :title="blok.title"
      :description="blok.excerpt"
    >
      <template #headline>
        <UBadge
          variant="subtle">{{ blok.badge }}</UBadge>

        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ new Date(blok.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton
          v-for="(author, index) in blok.authors"
          :key="index"
          :to="author.to"
          color="neutral"
          variant="subtle"
          target="_blank"
          size="sm"
        >
          <UAvatar
            v-bind="author.avatar"
            alt="Author avatar"
            size="2xs"
          />

          {{ author.name }}
        </UButton>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
          <div class="richtext-content-wrapper">
            <div class="richtext-content prose prose-lg max-w-none mx-auto">
         <div v-if="blok && isValidContent" v-html="renderedRichText"></div>

        <!-- <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" /> -->
        </div>
        </div>
      </UPageBody>

      <template
        v-if="tocLinks?.length"
        #right
      >
        <UContentToc :links="tocLinks" title="Tabla de Contenidos" color="primary"/>
      </template>
    </UPage>
  </UContainer>
</template>
