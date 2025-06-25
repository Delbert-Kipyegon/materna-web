'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-primary-50 to-coral-50">
      <Header />
      <main className="pb-20 lg:pb-8 pt-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
              <div className="sticky top-24">
                <Navigation />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-9 xl:col-span-10">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Navigation />
      </div>
      
      <Footer />
    </div>
  )
}

export default Layout