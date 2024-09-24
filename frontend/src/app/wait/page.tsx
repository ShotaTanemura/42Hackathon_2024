'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WaitingForOrder() {

  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeout(() => {
        router.push('/accept')
      }, 500)
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#D70F64]">
      <div className="text-white font-bold text-3xl mb-20">Waiting for Order...</div>
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-white border-solid"></div>
    </div>
  )
}
