'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const SplashScreen = () => {
  const [isFading, setIsFading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true)
      setTimeout(() => {
        router.push('/start')
      }, 500)
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-[#D70F64] ${
        isFading ? 'fade-out' : ''
      }`}
    >
      <Image
        src="/panda-rider-logo.png"
        alt="Panda Rider Logo"
        width={300}
        height={300}
        priority
      />
    </div>
  )
}
