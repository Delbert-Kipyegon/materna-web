'use client'

import { useState } from 'react'
import { Calendar, Baby, Share, TrendingUp } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { pregnancyMilestones } from '../data/mockData'
import Card from './Card'
import Button from './Button'
import Layout from './Layout'

function TrackerPage() {
  const { pregnancyData, setPregnancyData } = useAppStore()
  const [conceptionDate, setConceptionDate] = useState(
    pregnancyData.dueDate
      ? new Date(pregnancyData.dueDate.getTime() - 266 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      : ''
  )

  const calculateWeekFromConception = (conceptionDateInput: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const normalizedConceptionDate = new Date(conceptionDateInput)
    normalizedConceptionDate.setHours(0, 0, 0, 0)

    const maxPastDate = new Date(today.getTime() - 294 * 24 * 60 * 60 * 1000)
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    if (normalizedConceptionDate > tomorrow || normalizedConceptionDate < maxPastDate) {
      return 0
    }

    const timeSinceConception = today.getTime() - normalizedConceptionDate.getTime()
    const daysSinceConception = timeSinceConception / (1000 * 60 * 60 * 24)
    const weeksSinceConception = Math.round(daysSinceConception / 7)
    const pregnancyWeek = weeksSinceConception + 2
    return Math.max(0, Math.min(44, pregnancyWeek))
  }

  const handleConceptionDateChange = (date: string) => {
    setConceptionDate(date)
    if (date) {
      const [year, month, day] = date.split('-').map(Number)
      const conception = new Date(year, month - 1, day)
      const week = calculateWeekFromConception(conception)
      const dueDate = new Date(conception.getTime() + 266 * 24 * 60 * 60 * 1000)
      const milestone = pregnancyMilestones[week]

      setPregnancyData({
        dueDate,
        currentWeek: week,
        babySize: milestone?.babySize || '—',
        milestone: milestone?.milestone || 'Your pregnancy journey continues.',
      })
    }
  }

  const shareToWhatsApp = () => {
    const message = `Week ${pregnancyData.currentWeek} — ${pregnancyData.milestone}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <Layout>
      <div className="space-y-10 lg:space-y-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Tracker</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Your pregnancy timeline
          </h1>
          <p className="mt-3 text-zinc-600 leading-relaxed">
            Set your conception date to see week, due date, and milestones — clear and private on this device.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-4 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-zinc-900">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Conception date</span>
                </div>
                <input
                  type="date"
                  value={conceptionDate}
                  onChange={(e) => handleConceptionDateChange(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                  min={new Date(Date.now() - 294 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  max={new Date().toISOString().split('T')[0]}
                />

                {conceptionDate && pregnancyData.currentWeek === 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Choose a conception date in the past (within the last ~10 months).
                  </div>
                )}

                {pregnancyData.currentWeek > 0 && (
                  <div className="space-y-3 border-t border-zinc-100 pt-4">
                    <p className="text-sm text-zinc-600">
                      <span className="font-medium text-zinc-800">Due date · </span>
                      {pregnancyData.dueDate?.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {pregnancyData.currentWeek >= 40 ? (
                      <div>
                        <p className="text-2xl font-semibold text-violet-700">
                          {pregnancyData.currentWeek > 40
                            ? `${pregnancyData.currentWeek - 40} week${pregnancyData.currentWeek - 40 !== 1 ? 's' : ''} past due`
                            : 'Due window'}
                        </p>
                        <p className="text-sm text-zinc-500">Stay in touch with your care team.</p>
                      </div>
                    ) : pregnancyData.currentWeek >= 37 ? (
                      <div>
                        <p className="text-2xl font-semibold text-emerald-700">Full term</p>
                        <p className="text-sm text-zinc-500">Baby can arrive safely anytime.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-3xl font-semibold tracking-tight text-zinc-900">
                          {Math.max(0, 40 - pregnancyData.currentWeek)}
                        </p>
                        <p className="text-sm text-zinc-500">weeks until due date (est.)</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {pregnancyData.currentWeek > 0 && (
              <Card className="h-full overflow-hidden border-violet-100/80 bg-gradient-to-br from-white via-violet-50/40 to-fuchsia-50/30">
                <div className="p-6 sm:p-8 lg:flex lg:items-center lg:gap-10">
                  <div className="flex-1 text-center lg:text-left">
                    <p className="text-sm font-medium uppercase tracking-wider text-violet-600">This week</p>
                    <p className="mt-1 text-5xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
                      {pregnancyData.currentWeek}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-zinc-700 lg:justify-start">
                      <Baby className="h-5 w-5 text-violet-600" />
                      <span className="font-medium">About the size of a {pregnancyData.babySize}</span>
                    </div>
                    <p className="mt-4 text-lg leading-relaxed text-zinc-600">{pregnancyData.milestone}</p>
                  </div>
                  <div className="mx-auto mt-8 flex h-36 w-36 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-xl shadow-violet-500/30 lg:mt-0 lg:h-40 lg:w-40">
                    <Baby className="h-16 w-16 text-white opacity-95" />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {pregnancyData.currentWeek > 0 && (
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <Card>
              <div className="p-6 sm:p-8">
                <h3 className="mb-6 flex items-center gap-2 font-semibold text-zinc-900">
                  <TrendingUp className="h-5 w-5 text-violet-600" />
                  Progress
                </h3>
                <div className="relative pl-2">
                  <div className="absolute bottom-2 left-[1.15rem] top-2 w-px rounded-full bg-zinc-200" />
                  <div
                    className="absolute left-[1.15rem] top-2 w-px rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500 transition-all duration-700"
                    style={{ height: `${Math.min(100, (pregnancyData.currentWeek / 40) * 100)}%` }}
                  />
                  {[12, 24, 36, 40].map((week) => (
                    <div key={week} className="relative mb-6 flex items-center last:mb-0">
                      <div
                        className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          pregnancyData.currentWeek >= week
                            ? 'bg-zinc-900 text-white'
                            : 'border-2 border-zinc-200 bg-white text-zinc-400'
                        }`}
                      >
                        {week}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-zinc-900">
                          {week === 12 && 'End of first trimester'}
                          {week === 24 && 'Halfway'}
                          {week === 36 && 'Almost full term'}
                          {week === 40 &&
                            (pregnancyData.dueDate
                              ? `Due ${pregnancyData.dueDate.toLocaleDateString()}`
                              : 'Due date')}
                        </p>
                        <p className="text-sm text-zinc-500">Week {week}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6 sm:p-8">
                <h3 className="mb-6 font-semibold text-zinc-900">This week</h3>
                <ul className="space-y-3">
                  {[
                    'Take prenatal vitamins as directed',
                    'Stay hydrated',
                    'Gentle movement most days',
                    'Rest when you need it',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-700"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        )}

        {pregnancyData.currentWeek > 0 && (
          <div className="flex justify-start">
            <Button variant="outline" onClick={shareToWhatsApp} icon={Share}>
              Share update
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TrackerPage
