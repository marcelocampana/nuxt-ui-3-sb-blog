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

// Variables para debugging visual
const debugInfo = ref({
  renderizado: false,
  resolverEjecutado: false,
  placeholdersGenerados: 0,
  componentesEncontrados: 0,
  placeholdersEnDOM: 0,
  htmlContienePlaceholders: false,
  errores: []
});

const componentDataMap = new Map();

// NUEVA ESTRATEGIA: Separar contenido normal de nodos blok
const separateContentAndBloks = (content) => {
  if (!content?.content) return { normalContent: content, blokNodes: [] };
  
  const blokNodes = [];
  const normalContent = {
    ...content,
    content: content.content.filter(node => {
      if (node.type === 'blok') {
        blokNodes.push(node);
        return false; // Remover del contenido normal
      }
      return true; // Mantener en el contenido normal
    })
  };
  
  return { normalContent, blokNodes };
};

// CORREGIR: Renderizado sin mutaciones reactivas
const renderRichTextWithIds = (content) => {
  if (!content) return '';
  
  try {
    if (!content.content) return '';
    
    let html = '';
    let placeholdersCount = 0;
    let hasBlokNodes = false;
    
    // Procesar cada nodo individualmente manteniendo el orden
    content.content.forEach(node => {
      if (node.type === 'blok') {
        // Este es un componente anidado - crear placeholder
        hasBlokNodes = true;
        placeholdersCount++;
        
        if (node.attrs && node.attrs.body && node.attrs.body[0]) {
          const componentData = node.attrs.body[0];
          const uid = componentData._uid;
          const component = componentData.component;
          
          html += `<div class="storyblok-component" data-component="${component}" data-uid="${uid}">⚡ PLACEHOLDER: ${component}</div>`;
        }
      } else {
        // Este es contenido normal - renderizar individualmente
        const singleNodeContent = {
          type: 'doc',
          content: [node]
        };
        
        try {
          if (node.type === 'table') {
            html += renderTable(singleNodeContent);
          } else {
            html += renderRichText(singleNodeContent);
          }
        } catch (nodeError) {
          console.warn('Error renderizando nodo:', node.type, nodeError);
        }
      }
    });
    
    // Solo agregar IDs en el cliente después del primer renderizado
    if (import.meta.client && tocLinks.value.length > 0) {
      html = addIdsToH2s(html, tocLinks.value);
    }
    
    return html;
  } catch (error) {
    console.error('Error en renderRichTextWithIds:', error);
    try {
      return renderRichText(content);
    } catch (fallbackError) {
      console.error('Error en fallback:', fallbackError);
      return '<p>Error al procesar el contenido</p>';
    }
  }
};

// NUEVO: Variable reactiva para componentes anidados
const nestedComponents = ref([]);

// CORREGIR: Extraer componentes y mantenerlos en variable reactiva
const extractComponentData = (content) => {
  if (!content?.content) return;
  
  // Limpiar datos anteriores
  componentDataMap.clear();
  nestedComponents.value = [];
  debugInfo.value.componentesEncontrados = 0;
  
  // Buscar directamente en el contenido principal
  content.content.forEach((node, index) => {
    if (node.type === 'blok' && node.attrs && node.attrs.body) {
      const componentData = node.attrs.body[0];
      if (componentData && componentData._uid) {
        componentDataMap.set(componentData._uid, componentData);
        
        // Agregar a la lista de componentes anidados
        nestedComponents.value.push({
          ...componentData,
          position: index // Para mantener el orden
        });
        
        debugInfo.value.componentesEncontrados++;
      }
    }
  });
};

// CORREGIR: Usar ClientOnly para asegurar que el teleport funcione
const showNestedComponents = ref(false);

// SIMPLIFICAR: Solo crear placeholders, los componentes se renderizan en template
const replaceComponentPlaceholders = async () => {
  if (!import.meta.client) return;
  
  await nextTick();
  
  const placeholders = document.querySelectorAll('.storyblok-component');
  debugInfo.value.placeholdersEnDOM = placeholders.length;
  
  placeholders.forEach(async (placeholder) => {
    const component = placeholder.dataset.component;
    const uid = placeholder.dataset.uid;
    
    // Reemplazar placeholder con div identificador para el componente Vue
    placeholder.outerHTML = `<div id="nested-component-${uid}" class="nested-component-container"></div>`;
  });
  
  // Activar el renderizado de componentes después de crear los targets
  await nextTick();
  showNestedComponents.value = true;
};

// Verificar que los elementos H2 existan en el DOM después del render
onMounted(() => {
  // Extraer componentes inmediatamente
  extractComponentData(props.blok.content);
  
  // Actualizar debug info una sola vez
  updateDebugInfo();
  
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
    
    // AGREGAR: Reemplazar componentes después del montaje
    setTimeout(() => {
      replaceComponentPlaceholders();
    }, 500); // Aumentar el tiempo para asegurar que el DOM esté listo
  });
});

// AGREGAR: Función para actualizar debug info sin causar loops
const updateDebugInfo = () => {
  if (!import.meta.client) return;
  
  debugInfo.value.renderizado = true;
  debugInfo.value.resolverEjecutado = true;
  debugInfo.value.placeholdersGenerados = 1; // Sabemos que hay 1
  
  nextTick(() => {
    const placeholders = document.querySelectorAll('.storyblok-component');
    debugInfo.value.placeholdersEnDOM = placeholders.length;
    debugInfo.value.htmlContienePlaceholders = placeholders.length > 0;
  });
};

// AGREGAR: El computed que faltaba
const renderedRichText = computed(() => {
  if (!isValidContent.value) return '';
  
  try {
    return renderRichTextWithIds(props.blok.content);
  } catch (error) {
    console.error('Error al renderizar Rich Text:', error);
    return '<p>Error al procesar el contenido</p>';
  }
});


console.log(props.blok.content);
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
            
            <!-- MANTENER: Renderizado que incluye placeholders -->
            <div v-if="blok && isValidContent" v-html="renderedRichText"></div>
            
            <!-- CORREGIR: Usar ClientOnly y condición para renderizar componentes -->
            <ClientOnly>
              <template v-if="showNestedComponents">
                <template v-for="nestedComponent in nestedComponents" :key="nestedComponent._uid">
                  <Teleport :to="`#nested-component-${nestedComponent._uid}`">
                    <component 
                      :is="nestedComponent.component" 
                      :blok="nestedComponent"
                    />
                  </Teleport>
                </template>
              </template>
            </ClientOnly>
            
            <!-- MANTENER: Todo lo existente -->
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

      <!-- MANTENER: TOC existente -->
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