import MenuGrid from '@/components/MenuGrid'
import { getStores } from '@/lib/stores'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCategory } from '@/lib/utils'

interface PageProps {
  params: {
    store: string
    category: string
  }
}

export default async function StoreMenuPage({ params }: PageProps) {
  const storeCode = params.store.toUpperCase()
  const category = formatCategory(params.category)
  const stores = await getStores()
  const store = stores.find(s => s.code.toLowerCase() === params.store.toLowerCase())
  
  if (!store) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/stores/${params.store}`}
                className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors mb-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {store.name}
              </Link>
              <h1 className="text-3xl font-light tracking-wide text-gray-100 font-sf-pro-display">
                {store.name} - {category}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Live inventory • Refreshes every 60 seconds
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Store Code: {storeCode}
              </div>
              <Link
                href={`/stores/${params.store}/admin`}
                className="inline-flex items-center px-3 py-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-400 text-xs font-medium rounded-md hover:bg-gray-700/50 hover:border-gray-600 hover:text-gray-300 transition-all duration-200 mt-2"
              >
                <span className="mr-1">⚙️</span>
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <MenuGrid storeCode={storeCode} category={category} />
    </main>
  )
} 