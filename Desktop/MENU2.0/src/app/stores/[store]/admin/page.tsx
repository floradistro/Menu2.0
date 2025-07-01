'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import StoreProductManager from '@/components/admin/StoreProductManager'

export default function StoreAdminPage() {
  const params = useParams()
  const storeCode = (params.store as string).toUpperCase()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/stores/${params.store}`}
              className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Store Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <Image
                src="/newlogo.png"
                alt="Cannabis Menu Logo"
                width={60}
                height={60}
                className="w-15 h-15 object-contain"
              />
              <div>
                <h1 className="text-4xl font-light text-gray-100 font-sf-pro-display">
                  {storeCode} Admin Dashboard
                </h1>
                <p className="text-gray-400 mt-2">
                  Manage products for store {storeCode}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
          <StoreProductManager storeCode={storeCode} />
        </div>
      </div>
    </main>
  )
} 