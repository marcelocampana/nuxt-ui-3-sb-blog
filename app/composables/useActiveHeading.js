/**
 * Composable para detectar el heading actualmente visible en el viewport
 */
export const useActiveHeading = () => {
  const activeHeading = ref('')
  
  /**
   * Configura el observer para detectar headings visibles
   * @param {Array} headingIds - Array de IDs de los headings a observar
   */
  const observeHeadings = (headingIds) => {
    console.log('Configurando observer para headings:', headingIds)
    
    if (process.client && headingIds.length > 0) {
      // Esperar un poco para que el DOM esté completamente renderizado
      setTimeout(() => {
        // Verificar que los elementos existen
        const existingElements = headingIds.filter(id => {
          const element = document.getElementById(id)
          if (!element) {
            console.warn(`Elemento con ID "${id}" no encontrado`)
            return false
          }
          console.log(`Elemento encontrado: ${id}`, element)
          return true
        })
        
        if (existingElements.length === 0) {
          console.warn('No se encontraron elementos para observar')
          return
        }
        
        // Establecer el primer heading como activo inicialmente
        if (!activeHeading.value && existingElements.length > 0) {
          activeHeading.value = existingElements[0]
          console.log('Estableciendo heading inicial:', existingElements[0])
        }
        
        const observer = new IntersectionObserver(
          (entries) => {
            console.log('Intersection entries:', entries.map(e => ({ id: e.target.id, isIntersecting: e.isIntersecting, ratio: e.intersectionRatio })))
            
            // Encontrar el heading más visible
            let maxRatio = 0
            let mostVisibleId = ''
            
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                maxRatio = entry.intersectionRatio
                mostVisibleId = entry.target.id
              }
            })
            
            if (mostVisibleId) {
              console.log('Heading activo por intersección:', mostVisibleId)
              activeHeading.value = mostVisibleId
            } else {
              // Estrategia alternativa: encontrar el heading más cercano al top del viewport
              const viewportTop = window.scrollY + 100 // offset para considerar header
              let closestId = ''
              let closestDistance = Infinity
              
              existingElements.forEach(id => {
                const element = document.getElementById(id)
                if (element) {
                  const elementTop = element.offsetTop
                  const distance = Math.abs(elementTop - viewportTop)
                  
                  if (distance < closestDistance) {
                    closestDistance = distance
                    closestId = id
                  }
                }
              })
              
              if (closestId && closestId !== activeHeading.value) {
                console.log('Heading activo por proximidad:', closestId)
                activeHeading.value = closestId
              }
            }
          },
          {
            rootMargin: '-10% 0% -50% 0%', // Área más amplia para detección
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
          }
        )
        
        // Observar todos los headings existentes
        existingElements.forEach(id => {
          const element = document.getElementById(id)
          if (element) {
            observer.observe(element)
            console.log(`Observando elemento: ${id}`)
          }
        })
        
        // Cleanup function
        onUnmounted(() => {
          console.log('Desconectando observer')
          observer.disconnect()
        })
        
        return observer
      }, 500) // Esperar 500ms para que el DOM esté listo
    }
  }
  
  // Watch para debug
  watch(activeHeading, (newValue, oldValue) => {
    console.log(`Heading activo cambió de "${oldValue}" a "${newValue}"`)
  })
  
  return {
    activeHeading: readonly(activeHeading),
    observeHeadings
  }
}
