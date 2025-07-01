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

  // Get theme-specific styling based on store
  const getStoreTheme = (storeName: string) => {
    const name = storeName.toLowerCase()
    
    if (name.includes('blowing rock')) {
      return {
        background: 'bg-gradient-to-br from-slate-900 via-blue-900 to-gray-900',
        accent: 'text-blue-300',
        border: 'border-blue-500/50',
        cardBg: 'from-blue-900/20 to-slate-900/40',
        cardBorder: 'border-blue-600/30',
        hoverBorder: 'hover:border-blue-400/60',
        questTitle: '🏔️ Mountain Trail Quest',
        questDesc: 'Navigate treacherous mountain paths to discover legendary strains',
        decorative: '⛰️',
        theme: 'mountain'
      }
    }
    
    if (name.includes('charlotte')) {
      return {
        background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-gray-900',
        accent: 'text-purple-300',
        border: 'border-purple-500/50',
        cardBg: 'from-purple-900/20 to-slate-900/40',
        cardBorder: 'border-purple-600/30',
        hoverBorder: 'hover:border-purple-400/60',
        questTitle: '🏰 Medieval City Quest',
        questDesc: 'Venture through ancient city walls to the royal cannabis courts',
        decorative: '🏛️',
        theme: 'city'
      }
    }
    
    if (name.includes('salisbury')) {
      return {
        background: 'bg-gradient-to-br from-slate-900 via-yellow-900 to-amber-900',
        accent: 'text-yellow-300',
        border: 'border-yellow-500/50',
        cardBg: 'from-yellow-900/20 to-amber-900/40',
        cardBorder: 'border-yellow-600/30',
        hoverBorder: 'hover:border-yellow-400/60',
        questTitle: '👑 Gilded Age Quest',
        questDesc: 'Enter the opulent halls of the cannabis aristocracy',
        decorative: '💰',
        theme: 'gilded'
      }
    }
    
    if (name.includes('tennessee')) {
      return {
        background: 'bg-gradient-to-br from-slate-900 via-green-900 to-amber-900',
        accent: 'text-green-300',
        border: 'border-green-500/50',
        cardBg: 'from-green-900/20 to-amber-900/40',
        cardBorder: 'border-green-600/30',
        hoverBorder: 'hover:border-green-400/60',
        questTitle: '🚜 Farmer\'s Quest',
        questDesc: 'Journey through fertile fields to harvest nature\'s finest',
        decorative: '🌾',
        theme: 'farm'
      }
    }
    
    // Default theme
    return {
      background: 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950',
      accent: 'text-amber-300',
      border: 'border-amber-500/50',
      cardBg: 'from-amber-900/20 to-slate-900/40',
      cardBorder: 'border-amber-600/30',
      hoverBorder: 'hover:border-amber-400/60',
      questTitle: '⚔️ Ancient Quest',
      questDesc: 'Embark on a legendary journey through mystical realms',
      decorative: '🗡️',
      theme: 'default'
    }
  }

  const theme = getStoreTheme(store.name)

  // Get themed category styling
  const getThemedCategories = (categories: any[], theme: any) => {
    return categories.map(category => {
      let themedIcon = category.icon
      let themedName = category.name
      
      // Theme-specific category modifications
      if (theme.theme === 'mountain') {
        if (category.name === 'Flower') themedIcon = '🌸'
        if (category.name === 'Vape') themedIcon = '❄️'
        if (category.name === 'Edible') themedIcon = '🥧'
        if (category.name === 'Concentrate') themedIcon = '💎'
        if (category.name === 'Moonwater') themedIcon = '🌙'
      } else if (theme.theme === 'city') {
        if (category.name === 'Flower') themedIcon = '🌹'
        if (category.name === 'Vape') themedIcon = '💨'
        if (category.name === 'Edible') themedIcon = '🍰'
        if (category.name === 'Concentrate') themedIcon = '💜'
        if (category.name === 'Moonwater') themedIcon = '🌙'
      } else if (theme.theme === 'gilded') {
        if (category.name === 'Flower') themedIcon = '🥀'
        if (category.name === 'Vape') themedIcon = '💨'
        if (category.name === 'Edible') themedIcon = '🧁'
        if (category.name === 'Concentrate') themedIcon = '💛'
        if (category.name === 'Moonwater') themedIcon = '🌙'
      } else if (theme.theme === 'farm') {
        if (category.name === 'Flower') themedIcon = '🌻'
        if (category.name === 'Vape') themedIcon = '🌿'
        if (category.name === 'Edible') themedIcon = '🥕'
        if (category.name === 'Concentrate') themedIcon = '🍯'
        if (category.name === 'Moonwater') themedIcon = '🌙'
      }
      
      return {
        ...category,
        icon: themedIcon,
        name: themedName
      }
    })
  }

  const categories = getThemedCategories(
    ['Flower', 'Vape', 'Edible', 'Concentrate', 'Moonwater'].map(name => ({
      name,
      icon: CATEGORY_ICONS[name],
      color: CATEGORY_GRADIENTS[name]
    })),
    theme
  )

  return (
    <main className={`min-h-screen ${theme.background} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className={`absolute inset-0 opacity-10 ${theme.accent}`}>
        <div className="absolute top-20 left-10 w-2 h-2 bg-current rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-current rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-1 h-1 bg-current rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-current rounded-full animate-pulse"></div>
        <div className="absolute top-80 right-1/3 w-1.5 h-1.5 bg-current rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* Quest Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 md:mb-12">
          <Link
            href="/"
            className={`inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-black/30 backdrop-blur-sm border-2 ${theme.border} ${theme.accent} text-xs md:text-sm font-medium rounded-lg hover:bg-black/40 hover:scale-105 transition-all duration-300 shadow-lg font-serif`}
          >
            <svg className="w-4 md:w-5 h-4 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Return to Quest Selection</span>
          </Link>
          
          <Link
            href={`/stores/${params.store}/admin`}
            className={`inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-black/30 backdrop-blur-sm border-2 ${theme.border} ${theme.accent} text-xs md:text-sm font-medium rounded-lg hover:bg-black/40 hover:scale-105 transition-all duration-300 shadow-lg font-serif`}
          >
            <span className="mr-2 text-base md:text-lg">⚙️</span>
            <span>Quest Master Controls</span>
          </Link>
        </div>

        {/* Quest Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <Image
                src="/newlogo.png"
                alt="Cannabis Menu Logo"
                width={120}
                height={120}
                className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-2xl"
              />
              <div className={`absolute inset-0 rounded-full blur-xl animate-pulse opacity-20 ${theme.accent} bg-current`}></div>
            </div>
          </div>
          
          <div className="mb-4 md:mb-6">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4 animate-bounce">
              {theme.decorative}
            </div>
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide md:tracking-widest text-white mb-3 md:mb-4 font-serif drop-shadow-2xl`}>
              {theme.questTitle}
            </h1>
          </div>
          
          <div className={`w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-current to-transparent mx-auto mb-4 md:mb-6 animate-pulse ${theme.accent}`}></div>
          
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-light tracking-wider mb-3 md:mb-4 font-serif ${theme.accent}`}>
            {store.name}
          </h2>
          
          <p className={`text-base md:text-lg font-light tracking-wide font-serif italic mb-3 md:mb-4 ${theme.accent} opacity-80 max-w-2xl mx-auto px-4`}>
            "{theme.questDesc}"
          </p>
          
          <div className={`text-xs md:text-sm font-mono tracking-wider opacity-70 ${theme.accent}`}>
            Quest Code: {store.code} • Live Inventory Enchantments
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <h3 className={`text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 font-serif tracking-wide ${theme.accent}`}>
            Choose Your Path
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => {
              let floatClass = 'animate-float';
              if (index === 1) floatClass = 'animate-float-delay-1';
              if (index === 2) floatClass = 'animate-float-delay-2';
              if (index === 3) floatClass = 'animate-float-delay-4';
              if (index === 4) floatClass = 'animate-float';
              
              return (
                <Link
                  key={category.name}
                  href={`/stores/${params.store}/menus/${category.name.toLowerCase()}`}
                  className="group relative"
                >
                  {/* Quest Category Card */}
                  <div className={`relative bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm rounded-2xl border-2 ${theme.cardBorder} p-6 md:p-8 ${theme.hoverBorder} transition-all duration-500 text-center transform hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-black/30 ${floatClass}`}>
                    
                    {/* Ornate border decoration */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Corner decorations */}
                    <div className={`absolute top-3 md:top-4 left-3 md:left-4 w-4 md:w-6 h-4 md:h-6 border-l-2 border-t-2 ${theme.cardBorder} rounded-tl-lg group-hover:border-current transition-colors duration-500 ${theme.accent}`}></div>
                    <div className={`absolute top-3 md:top-4 right-3 md:right-4 w-4 md:w-6 h-4 md:h-6 border-r-2 border-t-2 ${theme.cardBorder} rounded-tr-lg group-hover:border-current transition-colors duration-500 ${theme.accent}`}></div>
                    <div className={`absolute bottom-3 md:bottom-4 left-3 md:left-4 w-4 md:w-6 h-4 md:h-6 border-l-2 border-b-2 ${theme.cardBorder} rounded-bl-lg group-hover:border-current transition-colors duration-500 ${theme.accent}`}></div>
                    <div className={`absolute bottom-3 md:bottom-4 right-3 md:right-4 w-4 md:w-6 h-4 md:h-6 border-r-2 border-b-2 ${theme.cardBorder} rounded-br-lg group-hover:border-current transition-colors duration-500 ${theme.accent}`}></div>
                    
                    {/* Glowing effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    
                    {/* Category Icon */}
                    <div className="relative mb-4 md:mb-6">
                      <div className="text-5xl md:text-7xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg">
                        {category.icon}
                      </div>
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Category Title */}
                    <h4 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 font-serif tracking-wide drop-shadow-lg ${theme.accent} group-hover:text-white transition-colors duration-300`}>
                      {category.name}
                    </h4>
                    
                    {/* Call to Action */}
                    <div className="relative">
                      <div className={`inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-black/40 to-black/60 border ${theme.border} font-semibold rounded-lg group-hover:from-black/60 group-hover:to-black/80 group-hover:scale-105 transition-all duration-500 font-serif tracking-wider ${theme.accent} group-hover:text-white text-sm md:text-base`}>
                        <span className="mr-2">⚔️</span>
                        <span>Enter Path</span>
                        <svg className="ml-2 md:ml-3 w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      
                      {/* Magical sparkles on hover */}
                      <div className={`absolute -top-2 -right-2 w-3 md:w-4 h-3 md:h-4 bg-current rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500 ${theme.accent}`}></div>
                      <div className={`absolute -bottom-1 -left-1 w-2 h-2 bg-current rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 ${theme.accent}`}></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-12 md:mt-16 text-center">
            <p className={`text-xs md:text-sm font-serif italic opacity-60 ${theme.accent} px-4`}>
              🔮 Inventory enchantments refresh every 60 seconds • {store.name} Realm ✨
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 