import MenuGrid from '@/components/MenuGrid'
import MenuHeader from '@/components/MenuHeader'
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
    <main className="min-h-screen">
      <MenuHeader 
        storeCode={storeCode} 
        category={category}
        storeName={store.name}
      />
      <MenuGrid storeCode={storeCode} category={category} />
    </main>
  )
} 