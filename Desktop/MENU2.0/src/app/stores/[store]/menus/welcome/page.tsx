import WelcomeBoard from '@/components/WelcomeBoard'
import MenuHeader from '@/components/MenuHeader'
import { getStores } from '@/lib/stores'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    store: string
  }
}

export default async function WelcomePage({ params }: PageProps) {
  const storeCode = params.store.toUpperCase()
  const stores = await getStores()
  const store = stores.find(s => s.code.toLowerCase() === params.store.toLowerCase())
  
  if (!store) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <MenuHeader 
        storeCode={storeCode} 
        category="welcome"
        storeName={store.name}
      />
      <WelcomeBoard storeCode={storeCode} />
    </main>
  )
}