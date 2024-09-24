'use client'

import { useCurrentLocation } from '@/hooks/currentLocation'
import { RouteMap } from '@/components/RouteMap'
import { useRouter } from 'next/navigation'

const DeliveryPage = () => {
  const router = useRouter()
  const currentLocation = useCurrentLocation()
  return (
    <div className="relative h-screen w-full flex flex-col">
      <div className="h-[70%]">
        <RouteMap currentLocation={currentLocation} />
      </div>
      <div className="absolute h-[35%] bottom-0 left-0 right-0 bg-[#D70F64] text-white rounded-t-3xl">
        <div className="flex items-center p-6 mt-5">
          <div className="flex items-center flex-1">
            <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D70F64]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold">FoodPanda</p>
              <p className="text-lg">★ 4.95</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">3 min</p>
            <p className="text-xl">0.6 min</p>
          </div>
        </div>
        <div className="flex justify-end p-6">
          <button className="bg-white text-[#D70F64] font-bold py-2 px-4 rounded-lg text-lg"
            onClick={() => router.push('/result')}>
            Delivery Done!
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeliveryPage
