import MenuGrid from '@/components/MenuGrid'
import { getStoreMapping } from '@/lib/stores'
import { formatCategory } from '@/lib/utils'

interface PageProps {
  params: {
    store: string
    category: string
  }
}

export default async function MenuPage({ params }: PageProps) {
  const storeCode = params.store.toUpperCase()
  const category = formatCategory(params.category)
  const storeMapping = await getStoreMapping()
  const storeName = storeMapping[storeCode] || storeCode

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-wide text-gray-100 font-sf-pro-display">
                {storeName} - {category}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Live inventory • Refreshes every 60 seconds
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Store Code: {storeCode}
            </div>
          </div>
        </div>
      </div>
      
      <MenuGrid storeCode={storeCode} category={category} />
    </main>
  )
} 