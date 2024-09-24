'use client'

import Image from 'next/image'
import { Map } from '@/components/Map'
import { useCurrentLocation } from '@/hooks/currentLocation'
import { useRouter } from 'next/navigation'

// @ts-expect-error: this is any type
const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded-md ${className}`} {...props}>
    {children}
  </button>
)

// @ts-expect-error: this is any type
const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`} {...props}>
    {children}
  </div>
)

export default function Page() {
  const router = useRouter()
  const countdown = 16
  const currentLocation = useCurrentLocation()

  return (
    <div className="relative h-screen w-full flex flex-col">
      {/* Map Area */}
      <div className="h-[45%] relative overflow-hidden">
        <div className="absolute inset-0">
          <Map currentLocation={currentLocation} />
        </div>
        {/* Overlay elements for Map */}
        <div className="absolute top-4 left-4 bg-white rounded-full p-2">
          <svg className="w-6 h-6 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6m16-6v6h-6M1 20v-6h6m16 6v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="absolute top-4 right-4 bg-white rounded-full p-2">
          <svg className="w-6 h-6 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <Card className="absolute top-16 left-1/2 transform -translate-x-1/2 w-48 bg-opacity-80">
          <div className="p-2 text-center">
            <div className="text-gray-500">Acceptance</div>
            <div className="text-2xl text-gray-700">89%</div>
          </div>
        </Card>
        <Button className="absolute top-36 right-4 bg-white text-red-500 font-semibold">
          Decline
        </Button>
      </div>
      {/* Order Details */}
      <div className="h-[55%] bottom-0 left-0 right-0 mt-4 overflow-y-auto">
        <Card className="m-4">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-green-600">€4.70</div>
              <div className="text-green-600">✓</div>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
              </svg>
              Includes €3,70 extra
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-rose-500 text-white flex items-center justify-center rounded-full mr-2">
                  🏪
                </div>
                <div>
                  <div className="font-semibold">Pick up</div>
                  <div className="text-sm">Bernauer Str. 37, 10291 Berlin</div>
                  <div className="text-sm text-gray-600">2.6km-12min</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-rose-500 text-white flex items-center justify-center rounded-full mr-2">
                  👤
                </div>
                <div>
                  <div className="font-semibold">Drop off</div>
                  <div className="text-sm">Schönhauser Allee 12A, 10431 Berlin</div>
                  <div className="text-sm">Apartment flat number: 25</div>
                  <div className="text-sm text-gray-600">2.6km-12min</div>
                </div>
              </div>
            </div>
            <div className="h-px bg-orange-500"></div>
            <div className="text-sm text-gray-600 text-center">
              {countdown} seconds to auto-decline
            </div>
            <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white"
              onClick={() => router.push('/delivery')}>
              Accept order
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}