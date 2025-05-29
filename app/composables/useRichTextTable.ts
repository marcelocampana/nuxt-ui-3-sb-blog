import { renderRichText } from '@storyblok/vue';

/**
 * Composable que proporciona funciones para renderizar tablas en contenido Rich Text de Storyblok
 */
export function useRichTextTable() {
  /**
   * Renderiza todo el contenido, procesando especialmente las tablas
   * @param content El contenido Rich Text de Storyblok
   * @returns HTML renderizado
   */
  function renderTable(content: any) {
    if (!content || !content.content) return 'nada';
    
    let html = '';
    
    // Procesamos cada nodo del contenido
    for (let i = 0; i < content.content.length; i++) {
      const node = content.content[i];
      
      // Si es una tabla, renderizarla con nuestro método personalizado
      if (node.type === 'table') {
        html += generarTablaHTML(node);
      } else {
        // Para otros tipos de nodos, usar el renderizado estándar
        const tempContent = {
          type: 'doc',
          content: [node]
        };
        html += renderRichText(tempContent);
      }
    }
    
    return html;
  }

  /**
   * Genera el HTML para una tabla completa
   * @param nodoTabla El nodo de tabla del contenido Rich Text
   * @returns HTML de la tabla
   */
  function generarTablaHTML(nodoTabla: any) {
    if (!nodoTabla.content || nodoTabla.content.length === 0) {
      return '<p>Tabla vacía</p>';
    }

    // Construir estructura base de la tabla
    const htmlTabla = [
      '<div class="table-wrapper">',
      '<table class="richtext-table">',
      '<tbody>' // Usaremos solo tbody para todas las filas
    ];
    
    // Procesar cada fila
    nodoTabla.content.forEach((fila: any) => {
      if (fila.type !== 'tableRow' || !fila.content) return;
      
      // Iniciar la fila
      htmlTabla.push('<tr>');
      
      // Procesar cada celda en la fila
      fila.content.forEach((celda: any) => {
        // Verificar tipo de celda
        if (celda.type !== 'tableCell' && celda.type !== 'tableHeader') return;
        
        // Determinar si es encabezado basado en el tipo de nodo
        const esEncabezado = celda.type === 'tableHeader';
        const tagCelda = esEncabezado ? 'th' : 'td';
        
        // Atributos de la celda
        const colSpan = celda.attrs?.colspan ? ` colspan="${celda.attrs.colspan}"` : '';
        const rowSpan = celda.attrs?.rowspan ? ` rowspan="${celda.attrs.rowspan}"` : '';
        const bgColor = celda.attrs?.backgroundColor ? 
                      ` style="background-color: ${celda.attrs.backgroundColor};"` : '';
        
        // Clase específica para encabezados
        const clase = esEncabezado ? ' class="cell-header"' : '';
        
        // Abrir celda con atributos
        htmlTabla.push(`<${tagCelda}${colSpan}${rowSpan}${bgColor}${clase}>`);
        
        // Contenido de la celda
        const contenido = procesarContenidoCelda(celda);
        htmlTabla.push(contenido || '&nbsp;');
        
        // Cerrar celda
        htmlTabla.push(`</${tagCelda}>`);
      });
      
      // Cerrar fila
      htmlTabla.push('</tr>');
    });
    
    // Cerrar estructura de la tabla
    htmlTabla.push('</tbody>');
    htmlTabla.push('</table>');
    htmlTabla.push('</div>');
    
    return htmlTabla.join('');
  }

  /**
   * Extrae y formatea el contenido de una celda
   * @param celda El nodo de celda
   * @returns HTML del contenido de la celda
   */
  function procesarContenidoCelda(celda: any) {
    if (!celda.content) return '';
    
    let contenidoHTML = [];
    
    celda.content.forEach((item: any) => {
      if (item.type === 'paragraph' && item.content) {
        let textoParrafo = '';
        
        item.content.forEach((nodoTexto: any) => {
          if (nodoTexto.type === 'text') {
            let texto = nodoTexto.text;
            
            // Aplicar formatos de texto
            if (nodoTexto.marks && nodoTexto.marks.length > 0) {
              // Ordenar marcas para aplicarlas de adentro hacia afuera
              const marcas = [...nodoTexto.marks].sort((a, b) => {
                // Aplicar primero colores y resaltados
                if (a.type === 'textStyle' || a.type === 'highlight') return -1;
                if (b.type === 'textStyle' || b.type === 'highlight') return 1;
                return 0;
              });
              
              marcas.forEach(marca => {
                if (marca.type === 'bold' || marca.type === 'strong') {
                  texto = `<strong>${texto}</strong>`;
                } else if (marca.type === 'italic' || marca.type === 'em') {
                  texto = `<em>${texto}</em>`;
                } else if (marca.type === 'underline') {
                  texto = `<u>${texto}</u>`;
                } else if (marca.type === 'strike') {
                  texto = `<s>${texto}</s>`;
                } else if (marca.type === 'code') {
                  texto = `<code>${texto}</code>`;
                } else if (marca.type === 'link' && marca.attrs?.href) {
                  texto = `<a href="${marca.attrs.href}" target="_blank" rel="noopener noreferrer">${texto}</a>`;
                } else if (marca.type === 'textStyle' && marca.attrs?.color) {
                  // Aplicar color de texto
                  texto = `<span style="color: ${marca.attrs.color};">${texto}</span>`;
                } else if (marca.type === 'highlight' && marca.attrs?.color) {
                  // Aplicar resaltado de fondo
                  texto = `<span style="background-color: ${marca.attrs.color};">${texto}</span>`;
                }
              });
            }
            
            textoParrafo += texto;
          }
        });
        
        if (textoParrafo) {
          contenidoHTML.push(`<p>${textoParrafo}</p>`);
        }
      } else if (item.type === 'heading' && item.content) {
        let textoEncabezado = '';
        const nivel = item.attrs?.level || 3;
        
        item.content.forEach((nodoTexto: any) => {
          if (nodoTexto.type === 'text') {
            textoEncabezado += nodoTexto.text;
          }
        });
        
        if (textoEncabezado) {
          contenidoHTML.push(`<h${nivel}>${textoEncabezado}</h${nivel}>`);
        }
      } else if (item.type === 'list') {
        const tipoLista = item.attrs?.type === 'bullet' ? 'ul' : 'ol';
        const contenidoLista = procesarListaItems(item);
        
        if (contenidoLista) {
          contenidoHTML.push(`<${tipoLista}>${contenidoLista}</${tipoLista}>`);
        }
      }
    });
    
    return contenidoHTML.join('');
  }

  /**
   * Procesa elementos de lista
   * @param nodoLista El nodo de lista
   * @returns HTML de los elementos de la lista
   */
  function procesarListaItems(nodoLista: any) {
    if (!nodoLista.content) return '';
    
    const itemsHTML = [];
    
    nodoLista.content.forEach((item: any) => {
      if (item.type === 'listItem' && item.content) {
        let contenidoItem = '';
        
        item.content.forEach((parrafo: any) => {
          if (parrafo.type === 'paragraph' && parrafo.content) {
            parrafo.content.forEach((nodoTexto: any) => {
              if (nodoTexto.type === 'text') {
                contenidoItem += nodoTexto.text;
              }
            });
          }
        });
        
        if (contenidoItem) {
          itemsHTML.push(`<li>${contenidoItem}</li>`);
        }
      }
    });
    
    return itemsHTML.join('');
  }

  // Retornar las funciones públicas del composable
  return {
    renderTable,
    generarTablaHTML,
    procesarContenidoCelda
  };
}
