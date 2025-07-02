import CombinedMenuGrid from '@/components/CombinedMenuGrid'
import { getStoreMapping } from '@/lib/stores'

interface PageProps {
  params: {
    store: string
  }
}

export default async function VapeConcentratePage({ params }: PageProps) {
  const storeCode = params.store.toUpperCase()
  const storeMapping = await getStoreMapping()
  const storeName = storeMapping[storeCode] || storeCode

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-wide text-gray-100 font-sf-pro-display">
                {storeName} - Vape & Concentrate
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Live inventory • Combined menu display
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Store Code: {storeCode}
            </div>
          </div>
        </div>
      </div>
      
      <CombinedMenuGrid storeCode={storeCode} />
    </main>
  )
} 