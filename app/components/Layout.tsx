'use client'

import Navigation from './Navigation'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-zinc-50">
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute -right-1/4 top-32 h-[480px] w-[480px] rounded-full bg-fuchsia-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-96 rounded-full bg-violet-100/40 blur-3xl" />
      </div>
      <Header />
      <main className="pb-24 pt-6 lg:pb-10 lg:pt-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            <div className="hidden lg:col-span-3 lg:block xl:col-span-2">
              <div className="sticky top-28">
                <Navigation />
              </div>
            </div>
            <div className="lg:col-span-9 xl:col-span-10">{children}</div>
          </div>
        </div>
      </main>
      <div className="lg:hidden">
        <Navigation />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
