'use client'

import React, { useState } from 'react'
import { Calendar, Baby, Share, Download, TrendingUp } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { pregnancyMilestones } from '../data/mockData'
import Card from './Card'
import Button from './Button'
import PrimeBadge from './PrimeBadge'
import Layout from './Layout'

const TrackerPage: React.FC = () => {
  const { pregnancyData, setPregnancyData, isPrime } = useAppStore()
  const [conceptionDate, setConceptionDate] = useState(
    pregnancyData.dueDate ? 
      new Date(pregnancyData.dueDate.getTime() - (266 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : ''
  )

  const calculateWeekFromConception = (conceptionDate: Date) => {
    // Get today's date at midnight local time for consistent calculation
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Ensure conception date is also at midnight for consistent comparison
    const normalizedConceptionDate = new Date(conceptionDate)
    normalizedConceptionDate.setHours(0, 0, 0, 0)
    
    // Validate that conception date is reasonable (not in future, not more than 42 weeks ago)
    const maxPastDate = new Date(today.getTime() - (294 * 24 * 60 * 60 * 1000)) // 42 weeks ago
    const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000))
    
    if (normalizedConceptionDate > tomorrow || normalizedConceptionDate < maxPastDate) {
      return 0 // Invalid date range
    }
    
    // Calculate weeks since conception
    const timeSinceConception = today.getTime() - normalizedConceptionDate.getTime()
    const daysSinceConception = timeSinceConception / (1000 * 60 * 60 * 24)
    const weeksSinceConception = Math.round(daysSinceConception / 7)
    
    // Medical pregnancy weeks start from LMP, which is typically 2 weeks before conception
    // So we add 2 weeks to weeks since conception
    const pregnancyWeek = weeksSinceConception + 2
    
    // Ensure we're within reasonable pregnancy bounds (2-44 weeks)
    const currentWeek = Math.max(0, Math.min(44, pregnancyWeek))
    
    return currentWeek
  }

  const handleConceptionDateChange = (date: string) => {
    setConceptionDate(date)
    if (date) {
      // Parse date in local timezone to avoid timezone shift issues
      const [year, month, day] = date.split('-').map(Number)
      const conception = new Date(year, month - 1, day) // month is 0-indexed
      const week = calculateWeekFromConception(conception)
      
      // Calculate due date (266 days after conception, which is 280 days from LMP)
      const dueDate = new Date(conception.getTime() + (266 * 24 * 60 * 60 * 1000))
      
      const milestone = pregnancyMilestones[week as keyof typeof pregnancyMilestones]
      
      setPregnancyData({
        dueDate: dueDate,
        currentWeek: week,
        babySize: milestone?.babySize || 'grape',
        milestone: milestone?.milestone || 'Your pregnancy journey begins!'
      })
    }
  }

  const shareToWhatsApp = () => {
    const message = `🤱 Week ${pregnancyData.currentWeek} Update: ${pregnancyData.milestone}`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <Layout>
      <div className="space-y-6 lg:space-y-8">
        <div className="text-center py-4 lg:py-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-primary-900 mb-2">Pregnancy Tracker</h1>
          <p className="text-primary-600 lg:text-lg">Track your journey week by week</p>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
          {/* Conception Date Input */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6 lg:p-8 space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-6 h-6 text-primary-500" />
                  <span className="font-semibold text-primary-900 lg:text-lg">Conception Date</span>
                </div>
                <input
                  type="date"
                  value={conceptionDate}
                  onChange={(e) => handleConceptionDateChange(e.target.value)}
                  className="w-full p-4 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent lg:text-lg"
                  min={new Date(Date.now() - (294 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]} // Up to 42 weeks ago
                  max={new Date().toISOString().split('T')[0]} // Today
                />
                
                {conceptionDate && pregnancyData.currentWeek === 0 && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please enter when you conceived - this should be in the past, up to 10 months ago.
                    </p>
                  </div>
                )}
                
                {pregnancyData.currentWeek > 0 && (
                  <div className="pt-4 border-t border-primary-100">
                    <div className="text-center space-y-3">
                      <div className="text-sm text-primary-600">
                        <strong>Due Date:</strong> {pregnancyData.dueDate?.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      {pregnancyData.currentWeek >= 40 ? (
                        <div>
                          <div className="text-2xl font-bold text-coral-600 mb-1">
                            {pregnancyData.currentWeek > 40 ? `${pregnancyData.currentWeek - 40} week${pregnancyData.currentWeek - 40 !== 1 ? 's' : ''}` : 'Due'} 
                          </div>
                          <div className="text-sm text-coral-500">
                            {pregnancyData.currentWeek > 40 ? 'past due date' : 'date arrived!'}
                          </div>
                        </div>
                      ) : pregnancyData.currentWeek >= 37 ? (
                        <div>
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            Full Term
                          </div>
                          <div className="text-sm text-green-500">
                            Baby can safely arrive anytime
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl font-bold text-primary-600 mb-1">
                            {Math.max(0, 40 - pregnancyData.currentWeek)}
                          </div>
                          <div className="text-sm text-primary-500">
                            weeks until due date
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Current Week Display */}
          <div className="lg:col-span-2">
            {pregnancyData.currentWeek > 0 && (
              <Card className="bg-gradient-to-r from-primary-50 to-coral-50 h-full">
                <div className="p-6 lg:p-8 text-center lg:flex lg:items-center lg:text-left lg:space-x-8">
                  <div className="flex-1">
                    <div className="text-4xl lg:text-6xl font-bold text-primary-600 mb-4">
                      Week {pregnancyData.currentWeek}
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                      <Baby className="w-6 h-6 text-coral-500" />
                      <span className="text-coral-600 font-medium lg:text-lg">
                        Size of a {pregnancyData.babySize}
                      </span>
                    </div>
                    <p className="text-primary-700 text-lg lg:text-xl leading-relaxed">
                      {pregnancyData.milestone}
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-32 h-32 bg-gradient-to-r from-coral-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Baby className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Progress Timeline */}
        {pregnancyData.currentWeek > 0 && (
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
            <Card>
              <div className="p-6 lg:p-8">
                <h3 className="font-semibold text-primary-900 mb-6 lg:text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Your Progress
                </h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-1 bg-primary-200 rounded-full"></div>
                  <div 
                    className="absolute left-4 top-0 w-1 bg-primary-500 transition-all duration-1000 rounded-full"
                    style={{ height: `${(pregnancyData.currentWeek / 40) * 100}%` }}
                  ></div>
                  
                  {[12, 24, 36, 40].map((week) => (
                    <div key={week} className="relative flex items-center mb-6 last:mb-0">
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                        pregnancyData.currentWeek >= week 
                          ? 'bg-primary-500 border-primary-500 text-white' 
                          : 'bg-white border-primary-200 text-primary-500'
                      }`}>
                        <span className="text-sm lg:text-base font-bold">{week}</span>
                      </div>
                      <div className="ml-4 lg:ml-6">
                        <div className="font-medium text-primary-900 lg:text-lg">
                          {week === 12 && 'End of First Trimester'}
                          {week === 24 && 'Halfway Point'}
                          {week === 36 && 'Full Term Soon'}
                          {week === 40 && (pregnancyData.dueDate ? 
                            `Due Date: ${pregnancyData.dueDate.toLocaleDateString()}` : 
                            'Due Date'
                          )}
                        </div>
                        <div className="text-sm text-primary-600">
                          Week {week}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Health Checklist */}
            <Card>
              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-primary-900 lg:text-lg">This Week's Checklist</h3>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-25 transition-colors">
                    <input type="checkbox" className="rounded border-primary-300 text-primary-500 focus:ring-primary-500 w-5 h-5" />
                    <span className="text-primary-700 lg:text-lg">Take prenatal vitamins</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-25 transition-colors">
                    <input type="checkbox" className="rounded border-primary-300 text-primary-500 focus:ring-primary-500 w-5 h-5" />
                    <span className="text-primary-700 lg:text-lg">Stay hydrated (8-10 glasses)</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-25 transition-colors">
                    <input type="checkbox" className="rounded border-primary-300 text-primary-500 focus:ring-primary-500 w-5 h-5" />
                    <span className="text-primary-700 lg:text-lg">Gentle exercise (20-30 minutes)</span>
                  </label>
                  <label className="flex items-center justify-between space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-primary-300 text-primary-500 focus:ring-primary-500 w-5 h-5" disabled />
                      <span className="text-primary-700 lg:text-lg">Nutrition meal planning</span>
                    </div>
                    <PrimeBadge />
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {pregnancyData.currentWeek > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 lg:justify-center">
            <Button variant="outline" onClick={shareToWhatsApp} icon={Share} className="lg:px-8">
              Share Update
            </Button>
            <Button 
              variant="outline" 
              icon={Download} 
              className="opacity-75 lg:px-8" 
              disabled={!isPrime}
            >
              <span className="flex items-center">
                PDF Report <PrimeBadge className="ml-2" />
              </span>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TrackerPage