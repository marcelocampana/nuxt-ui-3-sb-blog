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
