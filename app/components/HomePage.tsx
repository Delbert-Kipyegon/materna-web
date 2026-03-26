'use client'

import Link from 'next/link'
import { ArrowUpRight, Calendar, Video } from 'lucide-react'
import Layout from './Layout'

const cards = [
  {
    href: '/tracker',
    title: 'Pregnancy tracker',
    description: 'Week-by-week progress, milestones, and a calm view of your timeline.',
    icon: Calendar,
    accent: 'from-violet-500 to-violet-600',
  },
  {
    href: '/video',
    title: 'Video visit',
    description: 'Connect face-to-face with clinicians through a secure Tavus session.',
    icon: Video,
    accent: 'from-fuchsia-500 to-violet-600',
  },
]

function HomePage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          Welcome
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
          Care that fits{' '}
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            your rhythm
          </span>
          .
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-600 lg:mx-0">
          Track your pregnancy and meet your team over video — one calm, focused experience.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:max-w-4xl lg:gap-6">
        {cards.map(({ href, title, description, icon: Icon, accent }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm shadow-zinc-900/[0.04] transition-all duration-300 hover:border-violet-200/80 hover:shadow-lg hover:shadow-violet-500/10"
          >
            <div
              className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{description}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-violet-600">
              Open
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export default HomePage
