import React from 'react'
import '../scss/components/preloader.css'
export default function Preloader() {
  return (
    <div className='h-[100vh] flex items-center justify-center w-[100vw] left-0 top-[10vh] absolute flex-col gap-10'>
        <div className="loader"></div>
    </div>
  )
}

