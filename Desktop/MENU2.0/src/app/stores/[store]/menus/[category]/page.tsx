import MenuGrid from '@/components/MenuGrid'
import { getStores } from '@/lib/stores'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
        <div className="w-full px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Image
                src="/newlogo.png"
                alt="Cannabis Menu Logo"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
              <h1 className="text-7xl font-normal tracking-wide text-gray-100 lowercase" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {category} menu
              </h1>
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