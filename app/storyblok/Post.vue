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

console.log('TOC Links generados:', tocLinks.value);

// Función para agregar IDs a los H2s en el HTML renderizado
const addIdsToH2s = (html, tocLinks) => {
  if (!html || !tocLinks.length) return html;
  
  // Solo ejecutar la manipulación del DOM en el cliente
  if (!process.client) {
    return html; // En el servidor, devolver el HTML sin modificar
  }
  
  try {
    // Crear un mapa de texto a ID para hacer el matching
    const textToIdMap = new Map();
    tocLinks.forEach(link => {
      const normalizedText = link.text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
        .replace(/[^\w\s]/g, '') // Quitar puntuación
        .replace(/\s+/g, ' ')
        .trim();
      textToIdMap.set(normalizedText, link.id);
    });
    
    // Usar DOMParser para modificar el HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const h2Elements = doc.querySelectorAll('h2');
    
    h2Elements.forEach((h2, index) => {
      if (!h2.id) { // Solo procesar H2s sin ID
        const h2Text = h2.textContent
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        const matchingId = textToIdMap.get(h2Text);
        if (matchingId) {
          h2.id = matchingId;
        } else if (tocLinks[index]) {
          // Fallback: usar el índice del TOC si coincide
          h2.id = tocLinks[index].id;
        }
      }
    });
    
    return doc.body.innerHTML;
  } catch (error) {
    console.error('Error en addIdsToH2s:', error);
    return html; // Devolver HTML original si hay error
  }
};

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
    // Renderizar con anchors existentes
    return renderRichTextWithIds(props.blok.content);
  } catch (error) {
    console.error('Error al renderizar Rich Text:', error);
    return '<p>Error al procesar el contenido</p>';
  }
});

// Función para agregar IDs después del montaje
const addIdsPostMount = () => {
  if (!process.client || !tocLinks.value.length) return;
  
  setTimeout(() => {
    const allH2s = document.querySelectorAll('.richtext-content h2');
    console.log(`Encontrados ${allH2s.length} H2s post-mount`);
    
    // Crear mapa de texto a ID
    const textToIdMap = new Map();
    tocLinks.value.forEach(link => {
      const normalizedText = link.text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      textToIdMap.set(normalizedText, link.id);
    });
    
    allH2s.forEach((h2, index) => {
      if (!h2.id) {
        const h2Text = h2.textContent
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        const matchingId = textToIdMap.get(h2Text);
        if (matchingId) {
          h2.id = matchingId;
          console.log(`✅ ID post-mount asignado: ${matchingId} a "${h2.textContent?.trim()}"`);
        } else if (tocLinks.value[index]) {
          h2.id = tocLinks.value[index].id;
          console.log(`🔄 ID fallback post-mount: ${tocLinks.value[index].id}`);
        }
      }
    });
  }, 100);
};

// Verificar que los elementos H2 existan en el DOM después del render
onMounted(() => {
  if (process.client) {
    nextTick(() => {
      // Agregar IDs inmediatamente después del montaje
      addIdsPostMount();
      
      // Verificación después de un tiempo
      setTimeout(() => {
        console.log('=== VERIFICACIÓN POST-RENDER ===');
        
        const allH2s = document.querySelectorAll('h2');
        console.log(`Total de H2s en el DOM: ${allH2s.length}`);
        allH2s.forEach((h2, index) => {
          console.log(`H2 ${index + 1}: ID="${h2.id}", Texto="${h2.textContent?.trim()}"`);
        });
        
        // Verificar que cada enlace del TOC tenga su elemento correspondiente
        tocLinks.value.forEach(link => {
          const element = document.getElementById(link.id);
          console.log(`- ${link.id}:`, element ? 'ENCONTRADO ✅' : 'NO ENCONTRADO ❌');
        });
        
        console.log('=== FIN VERIFICACIÓN ===');
      }, 1500);
    });
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
          highlight 
          highlight-color="primary"
        />
      </template>
    </UPage>
  </UContainer>

</template>