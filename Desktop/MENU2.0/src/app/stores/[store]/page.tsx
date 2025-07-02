import Link from 'next/link'
import Image from 'next/image'
import { getStores } from '@/lib/stores'
import { notFound } from 'next/navigation'
import { CATEGORY_ICONS, CATEGORY_GRADIENTS } from '@/lib/constants'

interface PageProps {
  params: {
    store: string
  }
}

export default async function StorePage({ params }: PageProps) {
  const storeCode = params.store.toUpperCase()
  const stores = await getStores()
  const store = stores.find(s => s.code.toLowerCase() === params.store.toLowerCase())
  
  if (!store) {
    notFound()
  }

  const categories = [
    { name: 'Flower', icon: CATEGORY_ICONS['Flower'], color: CATEGORY_GRADIENTS['Flower'] },
    { name: 'Vape & Concentrate', icon: '💨💎', color: 'from-blue-600 via-orange-500 to-yellow-500' },
    { name: 'Concentrate', icon: CATEGORY_ICONS['Concentrate'], color: CATEGORY_GRADIENTS['Concentrate'] },
    { name: 'Edible', icon: CATEGORY_ICONS['Edible'], color: CATEGORY_GRADIENTS['Edible'] },
    { name: 'Pricing', icon: '💰', color: 'from-green-600 to-emerald-500' },
    { name: 'Welcome', icon: '📋', color: 'from-indigo-600 to-purple-500' }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Store Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Store Selection
          </Link>
          
          <div className="flex justify-center mb-4">
            <Image
              src="/newlogo.png"
              alt="Cannabis Menu Logo"
              width={100}
              height={100}
              className="w-25 h-25 object-contain"
            />
          </div>
          
          <h1 className="text-5xl font-light tracking-wider text-gray-100 mb-4 font-sf-pro-display">
            {store.name}
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-6"></div>
          <p className="text-lg text-gray-300 font-light font-sf-pro-display">
            Store Code: {store.code} • Live Inventory System
          </p>
        </div>

        {/* Store Admin */}
        <div className="text-right mb-8">
          <Link
            href={`/stores/${params.store}/admin`}
            className="inline-flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 text-sm font-medium rounded-md hover:bg-gray-700/50 hover:border-gray-600 hover:text-gray-100 transition-all duration-200"
          >
            <span className="mr-2">⚙️</span>
            Store Admin
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-light text-gray-200 mb-8 text-center font-sf-pro-display">Browse Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={
                  category.name === 'Vape & Concentrate' 
                    ? `/stores/${params.store}/menus/vape-concentrate`
                    : category.name === 'Concentrate'
                    ? `/stores/${params.store}/menus/concentrate`
                    : category.name === 'Pricing'
                    ? `/stores/${params.store}/menus/pricing`
                    : category.name === 'Welcome'
                    ? `/stores/${params.store}/menus/welcome`
                    : `/stores/${params.store}/menus/${category.name.toLowerCase()}`
                }
                className="group bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-300 text-center transform hover:scale-105"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-200 group-hover:text-gray-100 mb-2">
                  {category.name}
                </h3>
                <div className={`inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r ${category.color} font-medium`}>
                  <span>View Menu</span>
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Live inventory system • {store.name} Location
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 