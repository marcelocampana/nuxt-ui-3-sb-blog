/**
 * Composable para extraer enlaces de H2 con anchors desde contenido de Storyblok
 */
export const useExtractH2Links = () => {
  
  /**
   * Extrae el ID del anchor de un array de contenido
   * @param {Array} content - Array de contenido del heading
   * @returns {string|null} - ID del anchor o null si no existe
   */
  const extractAnchorFromContent = (content) => {
    if (!content || !Array.isArray(content)) return null;
    
    for (const item of content) {
      if (item.marks && Array.isArray(item.marks)) {
        const anchorMark = item.marks.find(mark => mark.type === 'anchor');
        if (anchorMark && anchorMark.attrs && anchorMark.attrs.id) {
          return anchorMark.attrs.id;
        }
      }
    }
    return null;
  };

  /**
   * Extrae el texto de un array de contenido
   * @param {Array} content - Array de contenido del heading
   * @returns {string} - Texto extraído
   */
  const extractTextFromContent = (content) => {
    if (!content || !Array.isArray(content)) return '';
    
    return content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('')
      .trim();
  };

  /**
   * Extrae headings H2 que tienen anchors definidos desde contenido de Storyblok
   * @param {Object} content - Contenido de Storyblok
   * @returns {Array} - Array de objetos con id, text, depth y children
   */
  const extractH2WithAnchors = (content) => {
    if (!content || !content.content) return [];
    
    const headings = [];
    
    const extractHeadings = (nodes) => {
      nodes.forEach(node => {
        // Solo procesar headings de nivel 2 (H2) que tengan anchor
        if (node.type === 'heading' && node.attrs && node.attrs.level === 2 && node.content) {
          const text = extractTextFromContent(node.content);
          const anchorId = extractAnchorFromContent(node.content);
          
          if (text && anchorId) {
            headings.push({
              id: anchorId,
              text: text,
              depth: node.attrs.level,
              children: []
            });
          }
        }
        
        // Procesar contenido anidado si existe
        if (node.content) {
          extractHeadings(node.content);
        }
      });
    };
    
    extractHeadings(content.content);
    return headings;
  };

  /**
   * Genera TOC desde contenido de Storyblok
   * @param {Object} content - Contenido de Storyblok
   * @returns {Array} - Array de enlaces para UContentToc
   */
  const generateTocFromContent = (content) => {
    const headings = extractH2WithAnchors(content);
    
    console.log('=== DEBUG TOC GENERATION ===');
    console.log('Contenido original:', content);
    console.log('Headings extraídos:', headings);
    
    // Estructura exacta que espera UContentToc
    const tocLinks = headings.map(heading => ({
      id: heading.id,
      text: heading.text,
      depth: heading.depth,
      children: heading.children || []
    }));
    
    console.log('Enlaces TOC finales:', tocLinks);
    console.log('=== FIN DEBUG ===');
    
    return tocLinks;
  };

  return {
    extractAnchorFromContent,
    extractTextFromContent,
    extractH2WithAnchors,
    generateTocFromContent
  };
};
