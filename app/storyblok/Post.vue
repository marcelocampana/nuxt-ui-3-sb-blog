<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})

console.log(props.blok);

// Usar el composable para el renderizado de tablas
const { renderTable } = useRichTextTable();

// Verificar si el contenido es válido para renderizar
const isValidContent = computed(() => {
    console.log(props.blok.content);
  return props.blok && 
         props.blok.content && 
         typeof props.blok.content === 'object';
});

// Debug para ver la estructura del contenido
const contentDebug = ref('');

const renderedRichText = computed(() => {
  if (!isValidContent.value) return 'nada';
  
  try {
    console.log('aqui estoy rich');
    // Guardar contenido para depuración
    contentDebug.value = JSON.stringify(props.blok.content, null, 2);
    
    // Identificar si hay tablas en el contenido
    const contenidoFinal = props.blok.content;
    
    if (contenidoFinal.type === 'doc' && 
        contenidoFinal.content && 
        contenidoFinal.content.some(node => node.type === 'table')) {
      
      // Si hay tablas, renderizar usando el composable
      return renderTable(contenidoFinal);
    } else {
      // Si no hay tablas, usar renderRichText normal
      return renderRichText(contenidoFinal);
    }
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
        v-if="blok?.body?.toc?.links?.length"
        #right
      >
        <UContentToc :links="blok.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
