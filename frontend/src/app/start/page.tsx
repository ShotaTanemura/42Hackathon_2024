'use client'

import { useState, useEffect } from 'react'
import { OptionButton } from '@/components/OptionButton'
import { vehicleOptions, bagOptions } from '@/config/driveOption'
import { useRouter } from 'next/navigation'
import { SplashScreen } from '@/components/SplashScreen'

const MainComponent = () => {
  const router = useRouter()
  const [vehicleType, setVehicleType] = useState<keyof typeof vehicleOptions | null>(null)
  const [bagType, setBagType] = useState<keyof typeof bagOptions | null>(null)
  const [temperature, setTemperature] = useState<string>('')
  const [autoAccept, setAutoAccept] = useState<boolean>(false)


  const isFormValid = () => {
    return vehicleType && bagType && temperature
  }

  return (
    <div className="w-full h-screen flex flex-col justify-between p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Start working</h2>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
          <h3 className="text-lg font-semibold mb-2">Vehicle Type</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(vehicleOptions).map((option) => (
              <OptionButton
                key={option.name}
                type={option.name}
                selectedType={vehicleType}
                setType={setVehicleType}
                icon={option.icon}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Bag Type</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(bagOptions).map((option) => (
              <OptionButton
                key={option.name}
                type={option.name}
                selectedType={bagType}
                setType={setBagType}
                icon={option.icon}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Enter your body temperature</h3>
          <input
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full px-4 py-2 text-xl border border-gray-300 rounded-lg"
            placeholder="37.0"
          />
          <p className="text-sm text-gray-500 mt-1">
            The average human temperature is between 36.5°C and 37.5°C
          </p>
        </div>

        <div className="flex items-center justify-between mt-8">
          <span className="text-lg font-semibold">Auto-Accept Orders</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoAccept}
              onChange={() => setAutoAccept(!autoAccept)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
          </label>
        </div>
      </div>

      <button
        className={`w-full py-3 rounded-lg text-white text-lg font-semibold ${
          isFormValid()
            ? 'bg-pink-500 hover:bg-pink-600'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
        disabled={!isFormValid()}
        onClick={() => router.push('/wait')}
      >
        Start
      </button>
    </div>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return showSplash ? <SplashScreen /> : <MainComponent />
}