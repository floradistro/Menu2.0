import Link from 'next/link'
import { getStores } from '@/lib/stores'

// Force revalidation every 30 seconds
export const revalidate = 30

export default async function Home() {
  const stores = await getStores(true) // Force fresh data

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Global Admin Link */}
        <div className="text-right mb-8">
          <Link
            href="/setup"
            className="inline-flex items-center px-4 py-2 bg-blue-800/50 backdrop-blur-sm border border-blue-700/50 text-blue-300 text-sm font-medium rounded-md hover:bg-blue-700/50 hover:border-blue-600 hover:text-blue-100 transition-all duration-200"
          >
            <span className="mr-2">🔧</span>
            Database Setup
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-6xl font-light tracking-wider text-gray-100 mb-4">
            CANNABIS MENU
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 font-light tracking-wide">
            Multi-Store Live Inventory System
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-gray-200 mb-12 text-center">Select Your Store</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stores.map((store) => (
              <Link
                key={store.code}
                href={`/stores/${store.code.toLowerCase()}`}
                className="group bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-300 text-center transform hover:scale-105"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  🏪
                </div>
                <h3 className="text-2xl font-medium text-gray-200 group-hover:text-gray-100 mb-3">
                  {store.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">Store Code: {store.code}</p>
                {store.address && (
                  <p className="text-gray-500 text-xs mb-4">{store.address}</p>
                )}
                <div className="inline-flex items-center text-green-400 font-medium">
                  <span>Enter Store Environment</span>
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">
              Live inventory updates every 30 seconds • Powered by Supabase
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 