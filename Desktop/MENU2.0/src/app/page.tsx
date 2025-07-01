import Link from 'next/link'
import Image from 'next/image'
import { getStores } from '@/lib/stores'

// Force revalidation every 30 seconds
export const revalidate = 30

export default async function Home() {
  const stores = await getStores(true) // Force fresh data

  // Get custom icon for each store
  const getStoreIcon = (storeName: string) => {
    const name = storeName.toLowerCase()
    if (name.includes('blowing rock')) return '🏔️'
    if (name.includes('charlotte')) return '🏙️'
    if (name.includes('salisbury')) return '🗑️'
    if (name.includes('tennessee')) return '🚜'
    return '🏪' // Default icon
  }

  // Get quest-style descriptions
  const getQuestDescription = (storeName: string) => {
    const name = storeName.toLowerCase()
    if (name.includes('blowing rock')) return 'A mystical dispensary nestled high in the mountain peaks'
    if (name.includes('charlotte')) return 'An urban sanctuary amidst the bustling city realm'
    if (name.includes('salisbury')) return 'A humble yet worthy establishment for the discerning adventurer'
    if (name.includes('tennessee')) return 'A rustic outpost where tradition meets the finest herbs'
    return 'An ancient repository of botanical treasures'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-amber-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-1 h-1 bg-amber-400 rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-amber-300 rounded-full animate-pulse"></div>
        <div className="absolute top-80 right-1/3 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Global Admin Link */}
        <div className="text-right mb-8">
          <Link
            href="/setup"
            className="inline-flex items-center px-6 py-3 bg-amber-900/30 backdrop-blur-sm border-2 border-amber-700/50 text-amber-300 text-sm font-medium rounded-lg hover:bg-amber-800/40 hover:border-amber-600 hover:text-amber-100 transition-all duration-300 shadow-lg hover:shadow-amber-900/50"
          >
            <span className="mr-2 text-lg">⚙️</span>
            <span className="font-serif">Database Setup</span>
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Image
                src="/newlogo.png"
                alt="Cannabis Menu Logo"
                width={200}
                height={200}
                className="w-50 h-50 object-contain drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-7xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-amber-600 mb-6 font-serif drop-shadow-2xl">
            CHOOSE YOUR FATE
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8 animate-pulse"></div>
          <p className="text-xl text-amber-200/80 font-light tracking-wide font-serif italic">
            by fahad and darion
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stores.map((store, index) => {
              let floatClass = 'animate-float';
              if (index === 1) floatClass = 'animate-float-delay-1';
              if (index === 2) floatClass = 'animate-float-delay-2';
              if (index === 3) floatClass = 'animate-float-delay-4';
              
              return (
                <Link
                  key={store.code}
                  href={`/stores/${store.code.toLowerCase()}`}
                  className="group relative"
                >
                  {/* Quest Card Container */}
                  <div className={`relative bg-gradient-to-br from-amber-900/20 to-amber-950/40 backdrop-blur-sm rounded-2xl border-2 border-amber-700/30 p-8 hover:border-amber-500/60 transition-all duration-500 text-center transform hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-amber-900/30 ${floatClass}`}>
                    
                    {/* Ornate border decoration */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Corner decorations */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-amber-600/50 rounded-tl-lg group-hover:border-amber-400 transition-colors duration-500"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-amber-600/50 rounded-tr-lg group-hover:border-amber-400 transition-colors duration-500"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-amber-600/50 rounded-bl-lg group-hover:border-amber-400 transition-colors duration-500"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-amber-600/50 rounded-br-lg group-hover:border-amber-400 transition-colors duration-500"></div>
                    
                    {/* Glowing effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    
                    {/* Quest Icon */}
                    <div className="relative mb-6">
                      <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg">
                        {getStoreIcon(store.name)}
                      </div>
                      <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Quest Title */}
                    <h3 className="text-3xl font-bold text-amber-100 group-hover:text-amber-50 mb-2 font-serif tracking-wide drop-shadow-lg">
                      {store.name}
                    </h3>
                    
                    {/* Quest Details */}
                    <div className="mb-4">
                      <p className="text-amber-300/80 text-sm mb-2 font-mono tracking-wider">
                        Quest Code: {store.code}
                      </p>
                      {store.address && (
                        <p className="text-amber-400/60 text-xs mb-3 italic">{store.address}</p>
                      )}
                    </div>
                    
                    {/* Quest Description */}
                    <p className="text-amber-200/70 text-sm mb-6 italic font-serif leading-relaxed">
                      "{getQuestDescription(store.name)}"
                    </p>
                    
                    {/* Call to Action */}
                    <div className="relative">
                      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-700/40 to-amber-800/40 text-amber-200 font-semibold rounded-lg border border-amber-600/50 group-hover:from-amber-600/50 group-hover:to-amber-700/50 group-hover:text-amber-100 group-hover:border-amber-500 transition-all duration-500 font-serif tracking-wider">
                        <span className="mr-2">⚔️</span>
                        <span>Begin Quest</span>
                        <svg className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      
                      {/* Magical sparkles on hover */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700"></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-sm text-amber-400/60 font-serif italic">
              🔮 Live inventory updates every 30 seconds • Powered by ancient Supabase magic ✨
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 