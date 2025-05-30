/**
 * Utilidades para manejar Table of Contents (TOC) y asignación de IDs a elementos H2
 */

/**
 * Normaliza texto para hacer matching consistente
 * @param {string} text - Texto a normalizar
 * @returns {string} - Texto normalizado
 */
export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[^\w\s]/g, '') // Quitar puntuación
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Crea un mapa de texto normalizado a ID para hacer matching
 * @param {Array} tocLinks - Array de enlaces del TOC
 * @returns {Map} - Mapa de texto normalizado a ID
 */
export const createTextToIdMap = (tocLinks) => {
  const textToIdMap = new Map();
  
  tocLinks.forEach(link => {
    const normalizedText = normalizeText(link.text);
    textToIdMap.set(normalizedText, link.id);
  });
  
  return textToIdMap;
};

/**
 * Agrega IDs a los elementos H2 en el HTML renderizado (solo cliente)
 * @param {string} html - HTML renderizado
 * @param {Array} tocLinks - Array de enlaces del TOC
 * @returns {string} - HTML con IDs asignados
 */
export const addIdsToH2s = (html, tocLinks) => {
  if (!html || !tocLinks.length) return html;
  
  // Solo ejecutar la manipulación del DOM en el cliente
  if (!process.client) {
    return html; // En el servidor, devolver el HTML sin modificar
  }
  
  try {
    const textToIdMap = createTextToIdMap(tocLinks);
    
    // Usar DOMParser para modificar el HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const h2Elements = doc.querySelectorAll('h2');
    
    h2Elements.forEach((h2, index) => {
      if (!h2.id) { // Solo procesar H2s sin ID
        const h2Text = normalizeText(h2.textContent);
        
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

/**
 * Agrega IDs a elementos H2 después del montaje del componente
 * @param {Array} tocLinks - Array de enlaces del TOC
 * @param {string} selector - Selector CSS para encontrar los H2s (default: '.richtext-content h2')
 * @param {number} delay - Delay en ms antes de ejecutar (default: 100)
 */
export const addIdsPostMount = (tocLinks, selector = '.richtext-content h2', delay = 100) => {
  if (!process.client || !tocLinks.length) return;
  
  setTimeout(() => {
    const allH2s = document.querySelectorAll(selector);
    console.log(`Encontrados ${allH2s.length} H2s post-mount`);
    
    const textToIdMap = createTextToIdMap(tocLinks);
    
    allH2s.forEach((h2, index) => {
      if (!h2.id) {
        const h2Text = normalizeText(h2.textContent);
        
        const matchingId = textToIdMap.get(h2Text);
        if (matchingId) {
          h2.id = matchingId;
          console.log(`✅ ID post-mount asignado: ${matchingId} a "${h2.textContent?.trim()}"`);
        } else if (tocLinks[index]) {
          h2.id = tocLinks[index].id;
          console.log(`🔄 ID fallback post-mount: ${tocLinks[index].id}`);
        }
      }
    });
  }, delay);
};

/**
 * Verifica que los elementos H2 existan en el DOM y tengan IDs correctos
 * @param {Array} tocLinks - Array de enlaces del TOC
 * @param {number} delay - Delay en ms antes de verificar (default: 1500)
 */
export const verifyH2Elements = (tocLinks, delay = 1500) => {
  if (!process.client) return;
  
  setTimeout(() => {
    console.log('=== VERIFICACIÓN POST-RENDER ===');
    
    const allH2s = document.querySelectorAll('h2');
    console.log(`Total de H2s en el DOM: ${allH2s.length}`);
    allH2s.forEach((h2, index) => {
      console.log(`H2 ${index + 1}: ID="${h2.id}", Texto="${h2.textContent?.trim()}"`);
    });
    
    // Verificar que cada enlace del TOC tenga su elemento correspondiente
    tocLinks.forEach(link => {
      const element = document.getElementById(link.id);
      console.log(`- ${link.id}:`, element ? 'ENCONTRADO ✅' : 'NO ENCONTRADO ❌');
    });
    
    console.log('=== FIN VERIFICACIÓN ===');
  }, delay);
};

/**
 * Obtiene la altura del header para calcular el offset de scroll
 * @returns {number} - Altura del header en pixels
 */
export const getHeaderHeight = () => {
  if (!process.client) return 0;
  
  // Buscar diferentes posibles selectores del header
  const headerSelectors = [
    'header',
    '[data-header]',
    '.header',
    'nav[role="banner"]',
    // Selectores específicos de Nuxt UI
    '[data-nuxt-ui-header]',
    '.nuxt-ui-header'
  ];
  
  for (const selector of headerSelectors) {
    const header = document.querySelector(selector);
    if (header) {
      const height = header.getBoundingClientRect().height;
      console.log(`Header encontrado con selector "${selector}": ${height}px`);
      return height;
    }
  }
  
  // Fallback más alto para asegurar que se vea bien
  console.log('Header no encontrado, usando fallback: 80px');
  return 80; // <-- Cambia este valor si es necesario
};

/**
 * Hace scroll suave a un elemento con offset para el header
 * @param {string} elementId - ID del elemento al que hacer scroll
 * @param {number} additionalOffset - Offset adicional en pixels (será calculado dinámicamente)
 */
export const scrollToElementWithOffset = (elementId, additionalOffset = null) => {
  if (!process.client) return;
  
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Elemento con ID "${elementId}" no encontrado`);
    return;
  }
  
  // Si no se proporciona offset, calcularlo según el tamaño de pantalla
  if (additionalOffset === null) {
    const isMobile = window.innerWidth < 768;
    additionalOffset = isMobile ? -10 : -25; // Mismos valores que en Post.vue
  }
  
  const headerHeight = getHeaderHeight();
  const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetTop = elementTop - headerHeight - additionalOffset;
  
  console.log(`Scrolling to ${elementId}:`, {
    headerHeight,
    elementTop,
    finalOffset: offsetTop,
    additionalOffset,
    isMobile: window.innerWidth < 768
  });
  
  window.scrollTo({
    top: Math.max(0, offsetTop),
    behavior: 'smooth'
  });
};

/**
 * Agrega CSS scroll-padding-top al documento para compensar el header fijo
 * @param {number} additionalPadding - Padding adicional en pixels (default: 40)
 */
export const addScrollPadding = (additionalPadding = 40) => {
  if (!process.client) return;
  
  const headerHeight = getHeaderHeight();
  const totalPadding = headerHeight + additionalPadding;
  
  console.log(`Agregando scroll-padding-top: ${totalPadding}px`);
  
  // Agregar scroll-padding-top al html
  document.documentElement.style.scrollPaddingTop = `${totalPadding}px`;
  
  // También agregar scroll-margin-top a los headings específicamente
  const style = document.createElement('style');
  style.textContent = `
    .richtext-content h2 {
      scroll-margin-top: ${totalPadding}px;
    }
    .richtext-content h1,
    .richtext-content h3,
    .richtext-content h4,
    .richtext-content h5,
    .richtext-content h6 {
      scroll-margin-top: ${totalPadding}px;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Intercepta clics en enlaces del TOC para hacer scroll personalizado
 * @param {Array} tocLinks - Array de enlaces del TOC
 */
export const interceptTocClicks = (tocLinks) => {
  if (!process.client || !tocLinks.length) return;
  
  // Esperar un poco para que el TOC esté renderizado
  setTimeout(() => {
    // Buscar todos los enlaces del TOC
    const tocContainer = document.querySelector('[data-toc]') || document.querySelector('.toc');
    if (!tocContainer) return;
    
    const tocLinkElements = tocContainer.querySelectorAll('a[href^="#"]');
    
    tocLinkElements.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const elementId = href.substring(1);
          scrollToElementWithOffset(elementId);
          
          // Actualizar la URL sin hacer scroll
          history.pushState(null, null, href);
        }
      });
    });
    
    console.log(`✅ Interceptados ${tocLinkElements.length} enlaces del TOC`);
  }, 500);
};
