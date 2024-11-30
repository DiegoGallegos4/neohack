'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function FilterSort() {
  const [minInvestment, setMinInvestment] = useState('')
  const [term, setTerm] = useState('')
  const [location, setLocation] = useState('')
  const [sortBy, setSortBy] = useState('')

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Filter & Sort</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="min-investment" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Investment
          </label>
          <Select value={minInvestment} onValueChange={setMinInvestment}>
            <SelectTrigger id="min-investment">
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1000">$1,000+</SelectItem>
              <SelectItem value="5000">$5,000+</SelectItem>
              <SelectItem value="10000">$10,000+</SelectItem>
              <SelectItem value="25000">$25,000+</SelectItem>
              <SelectItem value="50000">$50,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
            Investment Term
          </label>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger id="term">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="short">Short (1-12 months)</SelectItem>
              <SelectItem value="medium">Medium (1-3 years)</SelectItem>
              <SelectItem value="long">Long (3+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="new-york">New York</SelectItem>
              <SelectItem value="los-angeles">Los Angeles</SelectItem>
              <SelectItem value="chicago">Chicago</SelectItem>
              <SelectItem value="miami">Miami</SelectItem>
              <SelectItem value="dallas">Dallas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-by">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="min-investment-low">Min Investment (Low to High)</SelectItem>
              <SelectItem value="min-investment-high">Min Investment (High to Low)</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="term-low">Term (Low to High)</SelectItem>
              <SelectItem value="term-high">Term (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

