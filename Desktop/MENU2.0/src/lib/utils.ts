export const formatCategory = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
}

export const formatStoreCode = (code: string): string => {
  return code.toUpperCase()
}

export const parseNumericValue = (value: string | undefined): number | null => {
  if (!value) return null
  const parsed = parseFloat(value)
  return isNaN(parsed) ? null : parsed
} 