import { supabase } from './supabase'

export interface StoreConfig {
  code: string
  name: string
  address?: string
}

// Cache for store data
let storeCache: StoreConfig[] | null = null
let lastFetch = 0
const CACHE_DURATION = 30 * 1000 // 30 seconds instead of 5 minutes for faster updates

// Store code to name mapping
const STORE_NAMES: Record<string, string> = {
  'CLT': 'Charlotte',
  'SAL': 'Salem',
  'TN': 'Tennessee',
  'BR': 'Baton Rouge'
}

export async function getStores(forceRefresh = false): Promise<StoreConfig[]> {
  const now = Date.now()
  
  // Return cached data if still fresh and not forcing refresh
  if (!forceRefresh && storeCache && now - lastFetch < CACHE_DURATION) {
    return storeCache
  }

  try {
    // Get stores from the store table instead of products table
    const { data, error } = await supabase
      .from('store')
      .select('code, name, address')
      .order('name')

    if (error) throw error

    storeCache = data?.map(store => ({
      code: store.code,
      name: store.name,
      address: store.address
    })) || []
    
    lastFetch = now
    return storeCache
  } catch (error) {
    
    // Fallback to hardcoded stores if database fails
    const fallbackStores = [
      { code: 'CLT', name: 'Charlotte' },
      { code: 'SAL', name: 'Salem' },
      { code: 'TN', name: 'Tennessee' },
      { code: 'BR', name: 'Baton Rouge' }
    ]
    
    // Don't cache fallback data
    return fallbackStores
  }
}

export async function getStoreByCode(code: string): Promise<StoreConfig | undefined> {
  const stores = await getStores()
  return stores.find(store => store.code.toLowerCase() === code.toLowerCase())
}

export function clearStoreCache(): void {
  storeCache = null
  lastFetch = 0
}

// Add store management functions
export async function addStore(code: string, name: string, address?: string) {
  const { data, error } = await supabase
    .from('store')
    .insert([{ code: code.toUpperCase(), name, address }])
    .select()
  
  if (error) throw error
  clearStoreCache()
  return data[0]
}

export async function removeStore(code: string) {
  const { error } = await supabase
    .from('store')
    .delete()
    .eq('code', code.toUpperCase())
  
  if (error) throw error
  clearStoreCache()
}

// Helper function to create store name mapping
export async function getStoreMapping(): Promise<Record<string, string>> {
  const stores = await getStores()
  const mapping: Record<string, string> = {}
  
  stores.forEach(store => {
    mapping[store.code] = store.name
  })
  
  return mapping
} 