<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})

// Importar utilidades
import { 
  addIdsToH2s, 
  addIdsPostMount, 
  verifyH2Elements,
  addScrollPadding,
  interceptTocClicks
} from '~/utils/tocUtils';

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

const items = computed(() => {
  return [
    { label: 'Inicio', to: '/' },
    { label: 'Blog', to: '/blog' },
  ];
});

// Usar composables
const { renderTable } = useRichTextTable();
const { generateTocFromContent } = useExtractH2Links();

// Verificar si el contenido es válido para renderizar
const isValidContent = computed(() => {
  return props.blok && 
         props.blok.content && 
         typeof props.blok.content === 'object';
});

// Generar TOC desde el contenido usando el composable
const tocLinks = computed(() => {
  if (!isValidContent.value) return [];
  return generateTocFromContent(props.blok.content);
});

// Función personalizada para renderizar rich text manteniendo anchors existentes
const renderRichTextWithIds = (content) => {
  if (!content) return '';
  
  try {
    let html = '';
    
    // Renderizar el contenido normalmente
    if (content.type === 'doc' && 
        content.content && 
        content.content.some(node => node.type === 'table')) {
      html = renderTable(content);
    } else {
      html = renderRichText(content);
    }
    
    // Solo agregar IDs en el cliente después del primer renderizado
    if (process.client && tocLinks.value.length > 0) {
      html = addIdsToH2s(html, tocLinks.value);
    }
    
    return html;
  } catch (error) {
    console.error('Error en renderRichTextWithIds:', error);
    // Fallback: intentar renderizado básico
    try {
      return renderRichText(content);
    } catch (fallbackError) {
      console.error('Error en fallback:', fallbackError);
      return '<p>Error al procesar el contenido</p>';
    }
  }
};

const renderedRichText = computed(() => {
  if (!isValidContent.value) return '';
  
  try {
    return renderRichTextWithIds(props.blok.content);
  } catch (error) {
    console.error('Error al renderizar Rich Text:', error);
    return '<p>Error al procesar el contenido</p>';
  }
});

// Verificar que los elementos H2 existan en el DOM después del render
onMounted(() => {
  if (process.client) {
    nextTick(() => {
      // Opción 2: Diferentes valores para móvil y desktop
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? -0 : -20; // Ajusta estos valores según necesites
      
      // También puedes usar un enfoque más granular:
      // const offset = window.innerWidth < 640 ? -5 : // móvil pequeño
      //                window.innerWidth < 768 ? -10 : // tablet
      //                -25; // desktop
      
      addScrollPadding(offset);
      
      // Agregar IDs inmediatamente después del montaje
      addIdsPostMount(tocLinks.value);
      
      // Interceptar clics del TOC para scroll personalizado
      interceptTocClicks(tocLinks.value);
      
      // Verificación después de un tiempo (opcional, para debug)
      if (process.env.NODE_ENV === 'development') {
        verifyH2Elements(tocLinks.value);
      }
    });
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
        <UBreadcrumb :items="items">
          <template #separator>
            <span class="mx-2 text-muted">/</span>
          </template>
        </UBreadcrumb>
      </template>
      
      <div class="flex items-center gap-2 mt-5">
         <div class="flex flex-wrap items-center gap-3 ">
        <UButton
      
        label="Dr.Juan Rodríguez"
          color="neutral"
          variant=""
          target="_blank"
          size="sm"
          :ui="{ base: 'text-gray-600 pr-0' }"
        >
          <UAvatar
           src="images/doc.webp"
            alt="Author avatar"
            size="xs"
     
          />
        Por Dr. Juan Rodríguez  
        </UButton>
        <span class="text-muted">&middot;</span>
      </div>

        <!-- <UBadge
          v-if="blok.category"
          variant="soft"
        >
          {{ blok.category }}
        </UBadge> -->
        <UBadge variant="soft">{{ blok.badge }}</UBadge>
        <span class="text-muted">&middot;</span>
        <time class="text-muted">
          {{ new Date(blok.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}
        </time>
      </div>
      
     
    </UPageHeader>

    <UPage>
      <UPageBody>
        <div class="richtext-content-wrapper">
          <div class="richtext-content prose prose-lg max-w-none mx-auto">
            <div v-if="blok && isValidContent" v-html="renderedRichText"></div>
            
            <UContentSurround 
              :surround="surround" 
              :ui="{
                root:'mt-12', 
                link: 'no-underline pb-1', 
                linkTitle:'underline decoration-gray-50', 
                linkDescription:'underline decoration-gray-50 -mt-4'
              }" 
              class="underline"
            />
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
          highlight 
          highlight-color="primary"
          data-toc
        />
      </template>
    </UPage>
  </UContainer>
</template>