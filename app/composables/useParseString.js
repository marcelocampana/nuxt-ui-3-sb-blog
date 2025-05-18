export const useParseString = customString => {
  return computed(() => {
    const value = unref(customString)
    if (typeof value === 'string') {
      try {
        return Function(`return ${value}`)()
      } catch (e) {
        console.error('Error parsing customString:', e)
        return {}
      }
    }
    return value || {}
  })
}